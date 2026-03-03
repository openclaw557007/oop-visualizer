'use client';

import { useState } from 'react';
import { ReactFlow, Background, Controls, Node, Edge } from 'reactflow';
import Editor from '@monaco-editor/react';
import 'reactflow/dist/style.css';

export default function InheritancePage() {
  const [code, setCode] = useState(`// Parent/Superclass
public class Vehicle {
    protected String brand;
    protected int year;
    
    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
    
    public void startEngine() {
        System.out.println(brand + " engine started");
    }
    
    public void displayInfo() {
        System.out.println("Brand: " + brand + ", Year: " + year);
    }
}

// Child/Subclass
public class Car extends Vehicle {
    private int trunkCapacity;
    private boolean hasSunroof;
    
    public Car(String brand, int year, int trunkCapacity, boolean hasSunroof) {
        super(brand, year); // Call parent constructor
        this.trunkCapacity = trunkCapacity;
        this.hasSunroof = hasSunroof;
    }
    
    // Override parent method
    @Override
    public void displayInfo() {
        super.displayInfo(); // Call parent version
        System.out.println("Trunk: " + trunkCapacity + "L, Sunroof: " + hasSunroof);
    }
    
    public void openTrunk() {
        System.out.println("Trunk opened");
    }
}

// Usage
Car myCar = new Car("Toyota", 2023, 500, true);
myCar.startEngine();  // Inherited from Vehicle
myCar.displayInfo();  // Overridden in Car
myCar.openTrunk();    // Specific to Car`);

  const nodes: Node[] = [
    {
      id: 'vehicle',
      type: 'default',
      position: { x: 250, y: 50 },
      data: {
        label: (
          <div className="text-center">
            <strong className="text-blue-400">Vehicle</strong>
            <div className="text-xs mt-1">- brand: String</div>
            <div className="text-xs">- year: int</div>
            <div className="text-xs text-green-400 mt-1">+ startEngine()</div>
            <div className="text-xs text-green-400">+ displayInfo()</div>
          </div>
        )
      },
      style: { background: '#1e3a5f', border: '2px solid #3b82f6', width: 180, padding: 10 }
    },
    {
      id: 'car',
      type: 'default',
      position: { x: 250, y: 250 },
      data: {
        label: (
          <div className="text-center">
            <strong className="text-orange-400">Car</strong>
            <div className="text-xs mt-1">- trunkCapacity: int</div>
            <div className="text-xs">- hasSunroof: boolean</div>
            <div className="text-xs text-green-400 mt-1">+ openTrunk()</div>
            <div className="text-xs text-yellow-400">+ displayInfo() [override]</div>
          </div>
        )
      },
      style: { background: '#3f2818', border: '2px solid #f97316', width: 180, padding: 10 }
    },
    {
      id: 'motorcycle',
      type: 'default',
      position: { x: 50, y: 250 },
      data: {
        label: (
          <div className="text-center">
            <strong className="text-orange-400">Motorcycle</strong>
            <div className="text-xs mt-1">- engineCC: int</div>
            <div className="text-xs text-green-400 mt-1">+ wheelie()</div>
          </div>
        )
      },
      style: { background: '#3f2818', border: '2px solid #f97316', width: 140, padding: 10 }
    },
    {
      id: 'truck',
      type: 'default',
      position: { x: 450, y: 250 },
      data: {
        label: (
          <div className="text-center">
            <strong className="text-orange-400">Truck</strong>
            <div className="text-xs mt-1">- payloadCapacity: int</div>
            <div className="text-xs text-green-400 mt-1">+ loadCargo()</div>
          </div>
        )
      },
      style: { background: '#3f2818', border: '2px solid #f97316', width: 140, padding: 10 }
    }
  ];

  const edges: Edge[] = [
    { id: 'e1', source: 'vehicle', target: 'car', label: 'extends', animated: true, style: { stroke: '#3b82f6' } },
    { id: 'e2', source: 'vehicle', target: 'motorcycle', label: 'extends', animated: true, style: { stroke: '#3b82f6' } },
    { id: 'e3', source: 'vehicle', target: 'truck', label: 'extends', animated: true, style: { stroke: '#3b82f6' } }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">Inheritance</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">What is Inheritance?</h2>
            <p className="text-gray-300 mb-4">
              Inheritance is a mechanism where a new class (subclass/child) derives properties 
              and behaviors from an existing class (superclass/parent). It promotes code reusability 
              and establishes an &quot;IS-A&quot; relationship between classes.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-green-400">Key Concepts:</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li><strong>extends:</strong> Keyword to inherit from a class</li>
              <li><strong>super:</strong> Refers to the parent class</li>
              <li><strong>super():</strong> Calls parent constructor</li>
              <li><strong>@Override:</strong> Annotation for method overriding</li>
              <li><strong>protected:</strong> Accessible to subclasses</li>
            </ul>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
              <h3 className="font-semibold mb-2 text-yellow-400">Inheritance Hierarchy</h3>
              <div className="h-64">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  fitView
                  attributionPosition="bottom-right"
                >
                  <Background color="#444" gap={16} />
                  <Controls />
                </ReactFlow>
              </div>
            </div>

            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <h4 className="font-semibold text-blue-400 mb-2">Types of Inheritance:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <strong>Single:</strong> One class extends another</li>
                <li>• <strong>Multilevel:</strong> Class extends another extended class</li>
                <li>• <strong>Hierarchical:</strong> Multiple classes extend one parent</li>
                <li>• <strong>Hybrid:</strong> Combination of hierarchies</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">Note: Java does not support multiple inheritance of classes</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Interactive Example</h2>
            <p className="text-gray-400 text-sm mb-2">
              Vehicle inheritance hierarchy with method overriding
            </p>
            <div className="h-[500px] border border-gray-700 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="java"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  readOnly: false,
                }}
              />
            </div>
            <div className="mt-4 bg-green-900/30 p-4 rounded-lg border border-green-700">
              <h4 className="font-semibold text-green-400 mb-2">Key Observations:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <code className="bg-gray-700 px-1 rounded">Car extends Vehicle</code></li>
                <li>• <code className="bg-gray-700 px-1 rounded">super()</code> calls parent constructor</li>
                <li>• <code className="bg-gray-700 px-1 rounded">@Override</code> annotation for clarity</li>
                <li>• Child can call parent methods with <code className="bg-gray-700 px-1 rounded">super.method()</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
