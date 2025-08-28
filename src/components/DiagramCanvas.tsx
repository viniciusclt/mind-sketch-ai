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
import CustomEdge from './CustomEdge';
import { EdgeContextMenu } from './EdgeContextMenu';
import { Swimlanes, useSwimlanesManager } from './Swimlanes';
import { SwimlanesPanel } from './SwimlanesPanel';

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

const edgeTypes = {
  custom: CustomEdge,
  smoothstep: CustomEdge,
  straight: CustomEdge,
  default: CustomEdge,
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
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Swimlanes management
  const { 
    swimlanes, 
    addSwimlane, 
    removeSwimlane, 
    updateSwimlane 
  } = useSwimlanesManager();

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
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      markerEnd: { type: 'arrowclosed' },
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
    }, eds)),
    [setEdges]
  );

  const addConnectedNode = useCallback((parentNodeId: string, direction: 'bottom' | 'right' | 'left' | 'top' = 'bottom') => {
    const parentNode = nodes.find(node => node.id === parentNodeId);
    if (!parentNode) return;

    // Check for existing connections in the specified direction
    const existingConnections = edges.filter(edge => edge.source === parentNodeId);
    const existingNodes = existingConnections.map(edge => 
      nodes.find(node => node.id === edge.target)
    ).filter(Boolean);

    // Calculate base offset for the direction
    const offsetMap = {
      bottom: { x: 0, y: 120 },
      right: { x: 200, y: 0 },
      left: { x: -200, y: 0 },
      top: { x: 0, y: -120 }
    };

    const baseOffset = offsetMap[direction];
    let finalPosition = {
      x: parentNode.position.x + baseOffset.x,
      y: parentNode.position.y + baseOffset.y,
    };

    // Check if there's already a node in this direction (ramification logic)
    const nodesInDirection = existingNodes.filter(node => {
      if (!node) return false;
      
      switch (direction) {
        case 'bottom':
          return node.position.y > parentNode.position.y && 
                 Math.abs(node.position.x - parentNode.position.x) < 100;
        case 'right':
          return node.position.x > parentNode.position.x && 
                 Math.abs(node.position.y - parentNode.position.y) < 100;
        case 'left':
          return node.position.x < parentNode.position.x && 
                 Math.abs(node.position.y - parentNode.position.y) < 100;
        case 'top':
          return node.position.y < parentNode.position.y && 
                 Math.abs(node.position.x - parentNode.position.x) < 100;
        default:
          return false;
      }
    });

    // If nodes already exist in this direction, create a sibling (ramification)
    if (nodesInDirection.length > 0) {
      if (direction === 'bottom' || direction === 'top') {
        // Add horizontal offset for ramification
        finalPosition.x += (nodesInDirection.length * 150) - 75;
      } else {
        // Add vertical offset for ramification  
        finalPosition.y += (nodesInDirection.length * 100) - 50;
      }
    }

    const newNodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      position: finalPosition,
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
      markerEnd: { type: 'arrowclosed' },
      style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    
    // Auto-select the new node
    setSelectedNodes([newNode]);

    toast({
      title: "Node Added",
      description: `Added connected node in ${direction} direction`,
    });
  }, [nodes, edges, setNodes, setEdges, toast]);

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

      // Melhor conversão usando screenToFlowPosition se disponível
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
          preview: parsedData.item.preview,
          color: '#3b82f6', // Cor padrão azul
          backgroundColor: '#eff6ff' // Background padrão azul claro
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

  const handleChangeShape = useCallback((nodeIds: string[], newShape: string) => {
    setNodes((nds) => 
      nds.map(node => 
        nodeIds.includes(node.id)
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

  const handleChangeColor = useCallback((nodeIds: string[], colorType: 'border' | 'background' | 'text', color: string, hsl: string) => {
    setNodes((nds) => 
      nds.map(node => {
        if (!nodeIds.includes(node.id)) return node;
        
        const updatedData = { ...node.data };
        
        switch (colorType) {
          case 'border':
            updatedData.borderColor = color;
            updatedData.borderColorHsl = hsl;
            break;
          case 'background':
            updatedData.backgroundColor = color;
            updatedData.backgroundColorHsl = hsl;
            break;
          case 'text':
            updatedData.textColor = color;
            updatedData.textColorHsl = hsl;
            break;
        }
        
        return {
          ...node,
          data: updatedData
        };
      })
    );
    
    toast({
      title: "Cores Alteradas",
      description: `Cor do ${colorType === 'border' ? 'borda' : colorType === 'background' ? 'fundo' : 'texto'} alterada`,
    });
  }, [setNodes]);

  // Edge handlers
  const handleUpdateEdge = useCallback((edgeId: string, updates: Partial<Edge>) => {
    setEdges((eds) => 
      eds.map(edge => 
        edge.id === edgeId ? { ...edge, ...updates } : edge
      )
    );
  }, [setEdges]);

  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter(edge => edge.id !== edgeId));
  }, [setEdges]);

  const handleEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setSelectedEdge(edge);
  }, []);

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
          edgeTypes={edgeTypes}
          fitView
          className="bg-canvas-background"
          style={{ background: 'hsl(var(--canvas-background))' }}
          onSelectionChange={(params) => {
            setSelectedNodes(params.nodes);
          }}
          onNodeContextMenu={handleNodeContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
          multiSelectionKeyCode="Control"
          minZoom={0.1}
          maxZoom={4}
          onPaneClick={() => setSelectedNodes([])}
        >
          {/* Swimlanes Background */}
          <Swimlanes 
            swimlanes={swimlanes} 
            canvasWidth={window.innerWidth} 
            canvasHeight={window.innerHeight} 
          />

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
          
          {/* Floating Arrows for single node selection - inside ReactFlow */}
          {selectedNodes.length === 1 && (
            <FloatingArrows
              selectedNode={selectedNodes[0]}
              onAddConnectedNode={addConnectedNode}
            />
          )}
        </ReactFlow>
        
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

        {/* Swimlanes Panel */}
        <SwimlanesPanel
          swimlanes={swimlanes}
          onAddSwimlane={addSwimlane}
          onRemoveSwimlane={removeSwimlane}
          onUpdateSwimlane={updateSwimlane}
        />

        {/* Edge Context Menu */}
        {selectedEdge && (
          <EdgeContextMenu
            edge={selectedEdge}
            onUpdateEdge={handleUpdateEdge}
            onDeleteEdge={handleDeleteEdge}
          >
            <div />
          </EdgeContextMenu>
        )}

      </div>
    </DiagramProvider>
  );
}