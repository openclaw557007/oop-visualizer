'use client';

import { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, useNodesState, useEdgesState } from 'reactflow';
import Editor from '@monaco-editor/react';
import 'reactflow/dist/style.css';

interface ObjectState {
  [key: string]: string | number | boolean;
}

interface MemoryObject {
  id: string;
  type: 'class' | 'object' | 'primitive' | 'reference';
  name: string;
  value?: string | number | boolean;
  fields?: ObjectState;
}

export default function OOPVisualizer() {
  const [javaCode, setJavaCode] = useState(`public class Car {
    private String brand = "Toyota";
    private String color = "Red";
    private int year = 2023;
    private boolean isElectric = false;
    
    public Car(String brand, String color) {
        this.brand = brand;
        this.color = color;
    }
    
    public void setElectric(boolean electric) {
        this.isElectric = electric;
    }
}

// Creating objects
Car car1 = new Car("Toyota", "Blue");
Car car2 = new Car("Tesla", "White");
car2.setElectric(true);`);

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'stack',
      type: 'default',
      position: { x: 50, y: 50 },
      data: { label: 'STACK' },
      style: { background: '#e3f2fd', border: '2px solid #1976d2', width: 200 }
    },
    {
      id: 'heap',
      type: 'default',
      position: { x: 350, y: 50 },
      data: { label: 'HEAP' },
      style: { background: '#fff3e0', border: '2px solid #f57c00', width: 300 }
    }
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const parseAndVisualize = useCallback(() => {
    // Parse Java code and create visualization nodes
    const newNodes: Node[] = [
      {
        id: 'stack',
        type: 'default',
        position: { x: 50, y: 50 },
        data: { label: 'STACK (Local Variables)' },
        style: { background: '#e3f2fd', border: '2px solid #1976d2', width: 220, fontWeight: 'bold' }
      },
      {
        id: 'heap',
        type: 'default',
        position: { x: 350, y: 50 },
        data: { label: 'HEAP (Objects)' },
        style: { background: '#fff3e0', border: '2px solid #f57c00', width: 320, fontWeight: 'bold' }
      }
    ];

    const newEdges: Edge[] = [];

    // Extract class definitions
    const classMatch = javaCode.match(/class\s+(\w+)\s*{([^}]*)}/);
    if (classMatch) {
      const className = classMatch[1];
      const classBody = classMatch[2];

      // Parse fields
      const fields: ObjectState = {};
      const fieldMatches = classBody.matchAll(/(private|public|protected)?\s+(\w+)\s+(\w+)\s*=\s*([^;]+);/g);
      for (const match of fieldMatches) {
        const fieldName = match[3];
        const fieldValue = match[4].replace(/"/g, '');
        fields[fieldName] = fieldValue;
      }

      // Create class template node
      newNodes.push({
        id: 'class-template',
        type: 'default',
        position: { x: 370, y: 120 },
        data: {
          label: (
            <div style={{ fontSize: '12px' }}>
              <strong>Class: {className}</strong>
              <br />
              {Object.entries(fields).map(([key, val]) => (
                <div key={key}>{key}: {String(val)}</div>
              ))}
            </div>
          )
        },
        style: { background: '#fff', border: '2px solid #666', width: 200, padding: '10px' }
      });

      // Parse object instantiations
      const objectMatches = javaCode.matchAll(/(\w+)\s+(\w+)\s*=\s*new\s+(\w+)\(([^)]*)\);/g);
      let objIndex = 0;
      for (const match of objectMatches) {
        const type = match[1];
        const varName = match[2];
        const constructorArgs = match[4].split(',').map(s => s.trim().replace(/"/g, ''));

        // Stack variable
        newNodes.push({
          id: `stack-${varName}`,
          type: 'default',
          position: { x: 70, y: 180 + objIndex * 100 },
          data: {
            label: (
              <div style={{ fontSize: '11px' }}>
                <strong>{varName}</strong>
                <br />
                Type: {type}
                <br />
                Reference
              </div>
            )
          },
          style: { background: '#c8e6c9', border: '2px solid #4caf50', width: 150 }
        });

        // Heap object
        const objectFields = { ...fields };
        constructorArgs.forEach((arg, i) => {
          const fieldKeys = Object.keys(objectFields);
          if (fieldKeys[i]) {
            objectFields[fieldKeys[i]] = arg;
          }
        });

        newNodes.push({
          id: `heap-${varName}`,
          type: 'default',
          position: { x: 370, y: 250 + objIndex * 120 },
          data: {
            label: (
              <div style={{ fontSize: '11px' }}>
                <strong>Object: {className}@{varName}</strong>
                <br />
                {Object.entries(objectFields).map(([key, val]) => (
                  <div key={key}>{key}: {String(val)}</div>
                ))}
              </div>
            )
          },
          style: { background: '#ffe0b2', border: '2px solid #ff9800', width: 180, padding: '8px' }
        });

        // Reference edge
        newEdges.push({
          id: `edge-${varName}`,
          source: `stack-${varName}`,
          target: `heap-${varName}`,
          label: 'ref',
          animated: true,
          style: { stroke: '#4caf50' }
        });

        objIndex++;
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [javaCode]);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold">Java OOP Visualizer</h1>
        <p className="text-sm text-gray-400">Edit Java code to see real-time memory visualization</p>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-700">
          <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
            <span className="text-gray-300 text-sm font-medium">Java Code Editor</span>
            <button
              onClick={parseAndVisualize}
              className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              Visualize
            </button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="java"
              value={javaCode}
              onChange={(value) => setJavaCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Right Panel - Visualization */}
        <div className="w-1/2 flex flex-col bg-gray-900">
          <div className="p-2 bg-gray-800 border-b border-gray-700">
            <span className="text-gray-300 text-sm font-medium">Memory Visualization</span>
          </div>
          <div className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="bottom-right"
            >
              <Background color="#444" gap={16} />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
    </div>
  );
}
