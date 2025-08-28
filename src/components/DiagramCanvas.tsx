import { useCallback, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { DiagramProvider } from '../contexts/DiagramContext';
import { QuickActions } from './QuickActions';
import { FloatingArrows } from './FloatingArrows';
import { NaturalLanguageParser } from './NaturalLanguageParser';
import { saveDiagramToLocal } from '../utils/offline';
import { toast } from '@/hooks/use-toast';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { 
      label: 'Start',
      nodeType: 'shapes',
      shape: 'rectangle',
      preview: '▭'
    },
    position: { x: 250, y: 50 },
  },
  {
    id: '2',
    type: 'custom',
    data: { 
      label: 'Process',
      nodeType: 'shapes',
      shape: 'rectangle',
      preview: '▭'
    },
    position: { x: 100, y: 150 },
  },
  {
    id: '3',
    type: 'custom',
    data: { 
      label: 'Decision',
      nodeType: 'shapes',
      shape: 'diamond',
      preview: '◆'
    },
    position: { x: 400, y: 150 },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 },
  },
];

const nodeTypes = {
  custom: CustomNode,
};

interface DiagramCanvasProps {
  draggedItem: any;
  onDrop: (position: { x: number; y: number }) => void;
  sidebarCollapsed: boolean;
  templateToApply?: any;
  isFullscreen?: boolean;
}

const shapes = [
  { name: 'rectangle', preview: '▭' },
  { name: 'circle', preview: '●' },
  { name: 'diamond', preview: '◆' },
  { name: 'triangle', preview: '▲' },
  { name: 'hexagon', preview: '⬡' },
  { name: 'ellipse', preview: '⬭' },
];

export function DiagramCanvas({ draggedItem, onDrop: onDropProp, sidebarCollapsed, templateToApply, isFullscreen = false }: DiagramCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [showNLParser, setShowNLParser] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Auto-save diagram every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const diagramData = {
        nodes,
        edges,
        timestamp: new Date().toISOString()
      };
      saveDiagramToLocal('current-diagram', diagramData);
    }, 30000);

    return () => clearInterval(interval);
  }, [nodes, edges]);

  // Apply template when templateToApply changes
  useEffect(() => {
    if (templateToApply) {
      setNodes(templateToApply.nodes);
      setEdges(templateToApply.edges);
    }
  }, [templateToApply, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addConnectedNode = useCallback((parentNodeId: string, direction: 'bottom' | 'right' | 'left' | 'top' = 'bottom') => {
    const parentNode = nodes.find(node => node.id === parentNodeId);
    if (!parentNode) return;

    const offsetMap = {
      bottom: { x: 0, y: 120 },
      right: { x: 200, y: 0 },
      left: { x: -200, y: 0 },
      top: { x: 0, y: -120 }
    };

    const offset = offsetMap[direction];
    const newPosition = {
      x: parentNode.position.x + offset.x,
      y: parentNode.position.y + offset.y,
    };

    const newNodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      position: newPosition,
      data: { 
        label: 'New Node',
        nodeType: 'shapes',
        shape: 'rectangle',
        preview: '▭'
      },
    };

    const newEdge: Edge = {
      id: `edge-${parentNodeId}-${newNodeId}`,
      source: parentNodeId,
      target: newNodeId,
      type: 'smoothstep',
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  }, [nodes, setNodes, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDropHandler = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const dragData = event.dataTransfer.getData('application/reactflow');
      
      if (!dragData) return;

      let parsedData;
      try {
        parsedData = JSON.parse(dragData);
      } catch (e) {
        // Fallback for old drag format
        if (!draggedItem) return;
        parsedData = { item: draggedItem.item, type: draggedItem.type };
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${parsedData.type}-${Date.now()}`,
        type: 'custom',
        position,
        data: { 
          label: parsedData.item.name,
          nodeType: parsedData.type,
          shape: parsedData.item.name.toLowerCase(),
          preview: parsedData.item.preview
        },
      };

      setNodes((nds) => nds.concat(newNode));
      onDropProp(position);

      toast({
        title: "Node Added",
        description: `Added ${parsedData.item.name} to canvas`,
      });
    },
    [setNodes, onDropProp, draggedItem]
  );

  const handleDeleteNodes = useCallback((nodeIds: string[]) => {
    setNodes((nds) => nds.filter(node => !nodeIds.includes(node.id)));
    setEdges((eds) => eds.filter(edge => 
      !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
    ));
  }, [setNodes, setEdges]);

  const handleCopyNodes = useCallback((nodeIds: string[]) => {
    const nodesToCopy = nodes.filter(node => nodeIds.includes(node.id));
    // Store in localStorage for now (could be enhanced with proper clipboard API)
    localStorage.setItem('copiedNodes', JSON.stringify(nodesToCopy));
  }, [nodes]);

  const handleExport = useCallback(() => {
    const diagramData = { nodes, edges };
    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setSelectedNodes([node]);
  }, []);

  const handleChangeShape = useCallback((nodeId: string, newShape: string) => {
    setNodes((nds) => 
      nds.map(node => 
        node.id === nodeId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                shape: newShape,
                preview: shapes.find(s => s.name === newShape)?.preview || '▭'
              } 
            }
          : node
      )
    );
    toast({
      title: "Shape Changed",
      description: `Changed to ${newShape}`,
    });
  }, [setNodes]);

  const handleEditLabel = useCallback((nodeId: string) => {
    const newLabel = prompt('Enter new label:');
    if (newLabel !== null) {
      setNodes((nds) => 
        nds.map(node => 
          node.id === nodeId 
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
      toast({
        title: "Label Updated",
        description: `Node label changed to "${newLabel}"`,
      });
    }
    setEditingNodeId(nodeId);
  }, [setNodes]);

  const handleNaturalLanguageDiagram = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
    setShowNLParser(false);
    toast({
      title: "Diagram Generated",
      description: "Natural language diagram has been created",
    });
  }, [setNodes, setEdges]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Edit selected node with F2 or Enter
      if ((event.key === 'F2' || event.key === 'Enter') && selectedNodes.length === 1) {
        handleEditLabel(selectedNodes[0].id);
      }
      
      // Delete selected nodes with Delete key
      if (event.key === 'Delete' && selectedNodes.length > 0) {
        handleDeleteNodes(selectedNodes.map(node => node.id));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, handleEditLabel, handleDeleteNodes]);

  return (
    <DiagramProvider addConnectedNode={addConnectedNode}>
      <div 
        ref={reactFlowWrapper}
        className={`flex-1 bg-canvas-background relative transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0' : 'ml-0 md:ml-0'
        }`}
        onDrop={onDropHandler}
        onDragOver={onDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-canvas-background"
          style={{ background: 'hsl(var(--canvas-background))' }}
          onSelectionChange={(params) => {
            setSelectedNodes(params.nodes);
          }}
          onNodeContextMenu={handleNodeContextMenu}
          multiSelectionKeyCode="Control"
          minZoom={0.1}
          maxZoom={4}
          onPaneClick={() => setSelectedNodes([])}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="hsl(var(--canvas-grid))"
          />
          <Controls 
            className="bg-card border border-border rounded-lg shadow-card"
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />
          <MiniMap 
            className="!w-52 !h-40 bg-card border border-border rounded-lg shadow-card"
            style={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              width: '220px',
              height: '160px'
            }}
            nodeColor="hsl(var(--primary))"
            maskColor="hsl(var(--muted) / 0.6)"
            pannable
            zoomable
          />
        </ReactFlow>
        
        {/* Floating Arrows for single node selection */}
        {selectedNodes.length === 1 && (
          <FloatingArrows
            selectedNode={selectedNodes[0]}
            onAddConnectedNode={addConnectedNode}
          />
        )}
        
        <QuickActions 
          selectedNodes={selectedNodes.map(node => node.id)}
          onDeleteNodes={handleDeleteNodes}
          onCopyNodes={handleCopyNodes}
          onExport={handleExport}
          onToggleNLParser={() => setShowNLParser(!showNLParser)}
        />

        {showNLParser && (
          <div className="absolute top-4 left-4 z-40">
            <NaturalLanguageParser onDiagramGenerated={handleNaturalLanguageDiagram} />
          </div>
        )}

      </div>
    </DiagramProvider>
  );
}