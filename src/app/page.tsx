'use client';

import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, useNodesState, useEdgesState, Panel } from 'reactflow';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Code2, 
  Layers, 
  MemoryStick, 
  Sparkles,
  ChevronRight,
  Box,
  ArrowRightLeft,
  Cpu,
  Info
} from 'lucide-react';
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const glassCard = "backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50";

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

  const [isVisualizing, setIsVisualizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'memory'>('code');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const parseAndVisualize = useCallback(() => {
    setIsVisualizing(true);
    
    // Parse Java code and create visualization nodes
    const newNodes: Node[] = [
      {
        id: 'stack',
        type: 'default',
        position: { x: 50, y: 50 },
        data: { 
          label: (
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">STACK</span>
            </div>
          ) 
        },
        style: { 
          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', 
          border: '2px solid #6366f1', 
          borderRadius: '12px',
          width: 220, 
          padding: '12px',
          fontWeight: 'bold',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)'
        }
      },
      {
        id: 'heap',
        type: 'default',
        position: { x: 350, y: 50 },
        data: { 
          label: (
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">HEAP</span>
            </div>
          ) 
        },
        style: { 
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', 
          border: '2px solid #10b981', 
          borderRadius: '12px',
          width: 320, 
          padding: '12px',
          fontWeight: 'bold',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)'
        }
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
            <div className="text-xs space-y-1">
              <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                Class: {className}
              </div>
              <div className="border-t border-emerald-300/50 pt-1 mt-1">
                {Object.entries(fields).map(([key, val]) => (
                  <div key={key} className="text-slate-600 dark:text-slate-300 font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400">{key}:</span> {String(val)}
                  </div>
                ))}
              </div>
            </div>
          )
        },
        style: { 
          background: 'rgba(255, 255, 255, 0.9)', 
          border: '2px solid #6366f1', 
          borderRadius: '10px',
          width: 200, 
          padding: '12px',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.15)'
        }
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
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-200">{varName}</div>
                <div className="text-slate-500 dark:text-slate-400">Type: {type}</div>
                <div className="flex items-center gap-1 text-indigo-500">
                  <ArrowRightLeft className="w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-wide">Reference</span>
                </div>
              </div>
            )
          },
          style: { 
            background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)', 
            border: '2px solid #8b5cf6', 
            borderRadius: '10px',
            width: 150,
            padding: '10px',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.2)'
          }
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
              <div className="text-xs space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Box className="w-3 h-3" />
                  Object: {className}@{varName}
                </div>
                <div className="border-t border-emerald-300/50 pt-1 mt-1 space-y-0.5">
                  {Object.entries(objectFields).map(([key, val]) => (
                    <div key={key} className="font-mono text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">{key}:</span> {String(val)}
                    </div>
                  ))}
                </div>
              </div>
            )
          },
          style: { 
            background: 'rgba(255, 255, 255, 0.95)', 
            border: '2px solid #10b981', 
            borderRadius: '10px',
            width: 180, 
            padding: '12px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
          }
        });

        // Reference edge
        newEdges.push({
          id: `edge-${varName}`,
          source: `stack-${varName}`,
          target: `heap-${varName}`,
          label: 'ref',
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
          type: 'smoothstep'
        });

        objIndex++;
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
    
    setTimeout(() => setIsVisualizing(false), 500);
  }, [javaCode]);

  // Auto-visualize on first load
  useEffect(() => {
    parseAndVisualize();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-lg opacity-40" />
                <div className="relative p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  OOP Visualizer
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Interactive Java Memory Explorer
                </p>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={parseAndVisualize}
                disabled={isVisualizing}
                className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className={`w-4 h-4 ${isVisualizing ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">Visualize</span>
                <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]"
        >
          {/* Left Panel - Code Editor */}
          <motion.div 
            variants={itemVariants}
            className={`${glassCard} rounded-2xl overflow-hidden flex flex-col`}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 dark:text-slate-200">Code Editor</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Edit Java code to visualize</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
                  Java
                </span>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-0 bg-slate-900/95">
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
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  fontLigatures: true,
                  padding: { top: 16, bottom: 16 },
                  renderLineHighlight: 'all',
                  lineHighlightBackground: '#1e293b',
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                }}
                loading={
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full mr-2" />
                    Loading editor...
                  </div>
                }
              />
            </div>

            {/* Panel Footer */}
            <div className="px-5 py-3 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span>{javaCode.split('\n').length} lines</span>
                <span>{javaCode.length} characters</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                <span>Press Ctrl+Enter to visualize</span>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Visualization */}
          <motion.div 
            variants={itemVariants}
            className={`${glassCard} rounded-2xl overflow-hidden flex flex-col`}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <MemoryStick className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 dark:text-slate-200">Memory Visualization</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Stack & Heap representation</p>
                </div>
              </div>
              
              {/* Legend */}
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-indigo-200 to-indigo-300 border border-indigo-400" />
                  <span className="text-slate-600 dark:text-slate-400">Stack</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gradient-to-br from-emerald-200 to-emerald-300 border border-emerald-400" />
                  <span className="text-slate-600 dark:text-slate-400">Heap</span>
                </div>
              </div>
            </div>

            {/* React Flow Visualization */}
            <div className="flex-1 min-h-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/50">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                attributionPosition="bottom-right"
                minZoom={0.5}
                maxZoom={1.5}
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  animated: true,
                }}
              >
                <Background 
                  color="#94a3b8" 
                  gap={20} 
                  size={1}
                  className="opacity-30"
                />
                <Controls 
                  className="!bg-white/90 dark:!bg-slate-800/90 !border-slate-200 dark:!border-slate-700 !shadow-lg"
                />
                <Panel position="top-right" className="m-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50 shadow-lg text-xs space-y-2"
                  >
                    <div className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Memory Layout</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-slate-600 dark:text-slate-400">Local Variables</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-500" />
                      <span className="text-slate-600 dark:text-slate-400">References</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-slate-600 dark:text-slate-400">Object Instances</span>
                    </div>
                  </motion.div>
                </Panel>
              </ReactFlow>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { 
              icon: Layers, 
              title: 'Stack Memory', 
              desc: 'Local variables & references',
              color: 'indigo'
            },
            { 
              icon: Box, 
              title: 'Heap Memory', 
              desc: 'Object instances stored here',
              color: 'emerald'
            },
            { 
              icon: ArrowRightLeft, 
              title: 'References', 
              desc: 'Connections between stack & heap',
              color: 'violet'
            },
            { 
              icon: Sparkles, 
              title: 'Real-time Updates', 
              desc: 'Instant visualization refresh',
              color: 'amber'
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`${glassCard} rounded-xl p-4 cursor-pointer group`}
            >
              <div className={`p-2.5 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-5 h-5 text-${feature.color}-600 dark:text-${feature.color}-400`} />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
