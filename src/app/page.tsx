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
  Info,
  Menu,
  Maximize2,
  Minimize2
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
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const glassCard = "backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50";

export default function OOPVisualizer() {
  const [sidebarHidden, setSidebarHidden] = useState(true);
  const [activePanel, setActivePanel] = useState<'code' | 'visualization' | 'both'>('both');
  const [isMobile, setIsMobile] = useState(false);
  
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setActivePanel('code'); // Default to code on mobile
      } else {
        setActivePanel('both');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const parseAndVisualize = useCallback(() => {
    setIsVisualizing(true);
    
    const newNodes: Node[] = [
      {
        id: 'stack',
        type: 'default',
        position: { x: 80, y: 50 },
        data: { 
          label: (
            <div className="text-center">
              <div className="font-bold text-slate-700 dark:text-slate-200">STACK</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Local Variables</div>
            </div>
          )
        },
        style: { 
          background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', 
          border: '2px solid #6366f1', 
          borderRadius: '12px',
          width: 160,
          padding: '12px',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.2)'
        }
      },
      {
        id: 'heap',
        type: 'default',
        position: { x: 350, y: 50 },
        data: { 
          label: (
            <div className="text-center">
              <div className="font-bold text-slate-700 dark:text-slate-200">HEAP</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Objects</div>
            </div>
          )
        },
        style: { 
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', 
          border: '2px solid #10b981', 
          borderRadius: '12px',
          width: 200,
          padding: '12px',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)'
        }
      }
    ];

    const newEdges: Edge[] = [];

    // Parse class definition
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
        position: { x: 380, y: 150 },
        data: {
          label: (
            <div className="text-center text-xs sm:text-sm">
              <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">{className}</div>
              {Object.entries(fields).map(([key, val]) => (
                <div key={key} className="text-slate-600 dark:text-slate-400">{key}: {String(val)}</div>
              ))}
            </div>
          )
        },
        style: { 
          background: 'white', 
          border: '2px solid #64748b', 
          borderRadius: '10px',
          width: isMobile ? 140 : 180, 
          padding: '10px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
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
          position: { x: 50, y: 180 + objIndex * (isMobile ? 100 : 120) },
          data: {
            label: (
              <div className="text-center text-xs">
                <div className="font-semibold text-slate-700 dark:text-slate-200">{varName}</div>
                <div className="text-slate-500 dark:text-slate-400">{type}</div>
                <div className="text-indigo-600 dark:text-indigo-400 text-[10px]">ref</div>
              </div>
            )
          },
          style: { 
            background: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)', 
            border: '2px solid #6366f1', 
            borderRadius: '10px',
            width: isMobile ? 100 : 120,
            padding: '8px',
            fontSize: '11px'
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
          position: { x: 320, y: 220 + objIndex * (isMobile ? 120 : 140) },
          data: {
            label: (
              <div className="text-center text-xs">
                <div className="font-bold text-emerald-700 dark:text-emerald-300 mb-1">{className}@{varName}</div>
                {Object.entries(objectFields).map(([key, val]) => (
                  <div key={key} className="text-slate-600 dark:text-slate-400">{key}: {String(val)}</div>
                ))}
              </div>
            )
          },
          style: { 
            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', 
            border: '2px solid #10b981', 
            borderRadius: '10px',
            width: isMobile ? 140 : 180,
            padding: '10px',
            fontSize: '11px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)'
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
  }, [javaCode, isMobile]);

  // Auto-visualize on first load
  useEffect(() => {
    parseAndVisualize();
  }, [parseAndVisualize]);

  // Mobile panel toggle
  const toggleMobilePanel = () => {
    setActivePanel(prev => {
      if (prev === 'code') return 'visualization';
      if (prev === 'visualization') return 'both';
      return 'code';
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
      {/* Mobile-Optimized Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - Compact on mobile */}
            <motion.div 
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-lg blur-lg opacity-40" />
                <div className="relative p-1.5 sm:p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg shadow-lg">
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  OOP Visualizer
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Interactive Java Memory Explorer
                </p>
              </div>
            </motion.div>

            {/* Actions - Mobile optimized */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Barishal Practice Link */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/barishal/practice"
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium"
              >
                <span>🎓 Practice</span>
              </motion.a>

              {/* Mobile Panel Toggle */}
              {isMobile && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMobilePanel}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-all text-sm"
                >
                  {activePanel === 'code' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  <span className="text-xs sm:text-sm">
                    {activePanel === 'code' ? 'View' : 'Code'}
                  </span>
                </motion.button>
              )}

              {/* Sidebar Toggle - Hidden on mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarHidden(!sidebarHidden)}
                className="hidden lg:flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-all"
                title={sidebarHidden ? "Show Sidebar" : "Hide Sidebar"}
              >
                <Menu className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">{sidebarHidden ? "Show Menu" : "Hide Menu"}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={parseAndVisualize}
                disabled={isVisualizing}
                className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <Play className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isVisualizing ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">Visualize</span>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Mobile Responsive */}
      <main className="w-full min-h-screen p-2 sm:p-4 lg:p-6 xl:p-8 pb-20">
        <div className="w-full flex flex-col items-center justify-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid gap-4 sm:gap-6 lg:gap-8 w-full max-w-[1400px] ${
            isMobile 
              ? 'grid-cols-1' 
              : activePanel === 'both' 
                ? 'grid-cols-1 xl:grid-cols-2' 
                : 'grid-cols-1'
          }`}
          style={{ margin: '0 auto' }}
        >
          {/* Code Editor Panel */}
          <motion.div 
            variants={itemVariants}
            className={`${glassCard} rounded-xl sm:rounded-2xl overflow-hidden flex flex-col ${
              isMobile && activePanel === 'visualization' ? 'hidden' : 'flex'
            } ${isMobile ? 'min-h-[60vh]' : 'min-h-[400px] lg:min-h-[500px]'}`}
          >
            {/* Panel Header - Mobile optimized */}
            <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/50">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">Code Editor</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Edit Java code to visualize</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
                  Java
                </span>
              </div>
            </div>

            {/* Editor - Mobile optimized */}
            <div className="flex-1 min-h-0 bg-slate-900/95">
              <Editor
                height="100%"
                defaultLanguage="java"
                value={javaCode}
                onChange={(value) => setJavaCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: isMobile ? 12 : 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  fontLigatures: true,
                  padding: { top: isMobile ? 8 : 16, bottom: isMobile ? 8 : 16 },
                  renderLineHighlight: 'all',
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  wordWrap: 'on',
                }}
                loading={
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                    <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-indigo-500 border-t-transparent rounded-full mr-2" />
                    Loading editor...
                  </div>
                }
              />
            </div>

            {/* Panel Footer - Mobile optimized */}
            <div className="px-3 sm:px-5 py-2 sm:py-3 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 sm:gap-4">
                <span>{javaCode.split('\n').length} lines</span>
                <span className="hidden sm:inline">{javaCode.length} chars</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Press Ctrl+Enter to visualize</span>
                <span className="sm:hidden">Ctrl+Enter to visualize</span>
              </div>
            </div>
          </motion.div>

          {/* Visualization Panel */}
          <motion.div 
            variants={itemVariants}
            className={`${glassCard} rounded-xl sm:rounded-2xl overflow-hidden flex flex-col ${
              isMobile && activePanel === 'code' ? 'hidden' : 'flex'
            } ${isMobile ? 'min-h-[60vh]' : 'min-h-[400px] lg:min-h-[500px]'}`}
          >
            {/* Panel Header - Mobile optimized */}
            <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/50">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <MemoryStick className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">Memory Visualization</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Stack & Heap representation</p>
                </div>
              </div>
              
              {/* Legend - Hidden on small mobile */}
              <div className="hidden sm:flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-gradient-to-br from-indigo-200 to-indigo-300 border border-indigo-400" />
                  <span className="text-slate-600 dark:text-slate-400">Stack</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded bg-gradient-to-br from-emerald-200 to-emerald-300 border border-emerald-400" />
                  <span className="text-slate-600 dark:text-slate-400">Heap</span>
                </div>
              </div>
            </div>

            {/* React Flow Visualization - Mobile optimized */}
            <div className="flex-1 min-h-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/50">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                attributionPosition="bottom-right"
                minZoom={0.3}
                maxZoom={1.5}
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  style: { strokeWidth: 2 }
                }}
              >
                <Background 
                  color="#94a3b8" 
                  gap={isMobile ? 12 : 16} 
                  size={1}
                  className="opacity-30"
                />
                <Controls className="!bg-white/80 dark:!bg-slate-800/80 !border-slate-200 dark:!border-slate-700 !shadow-lg" />
                
                {/* Mobile Legend */}
                <Panel position="top-left" className="m-2 sm:m-4">
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-slate-200 dark:border-slate-700 sm:hidden">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded bg-gradient-to-br from-indigo-200 to-indigo-300 border border-indigo-400" />
                        <span className="text-slate-600 dark:text-slate-400">Stack</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded bg-gradient-to-br from-emerald-200 to-emerald-300 border border-emerald-400" />
                        <span className="text-slate-600 dark:text-slate-400">Heap</span>
                      </div>
                    </div>
                  </div>
                </Panel>
              </ReactFlow>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Cards - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 mt-4 sm:mt-8 w-full max-w-[1400px]"
        >
          {[
            { icon: Layers, title: 'Stack Memory', desc: 'Local variables & references', color: 'indigo' },
            { icon: Box, title: 'Heap Memory', desc: 'Objects & instance data', color: 'emerald' },
            { icon: ArrowRightLeft, title: 'References', desc: 'Pointer connections', color: 'violet' },
            { icon: Cpu, title: 'Real-time', desc: 'Live visualization', color: 'amber' }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              className={`${glassCard} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3`}
            >
              <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30`}>
                <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${feature.color}-600 dark:text-${feature.color}-400`} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">{feature.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
          
          {/* Practice Arena Card */}
          <motion.a
            href="/barishal/practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className={`${glassCard} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-lg transition-all cursor-pointer`}
          >
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <span className="text-lg sm:text-xl">🎓</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-300">Practice Arena</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 hidden sm:block">100+ OOP questions</p>
            </div>
          </motion.a>
        </motion.div>
        </div>
      </main>
    </div>
  );
}
