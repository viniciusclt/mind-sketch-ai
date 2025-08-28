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

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Start' },
    position: { x: 250, y: 50 },
    style: {
      background: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      border: '2px solid hsl(var(--primary))',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  {
    id: '2',
    type: 'default',
    data: { label: 'Process' },
    position: { x: 100, y: 150 },
    style: {
      background: 'hsl(var(--card))',
      color: 'hsl(var(--card-foreground))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '12px',
      fontSize: '14px',
    },
  },
  {
    id: '3',
    type: 'default',
    data: { label: 'Decision' },
    position: { x: 400, y: 150 },
    style: {
      background: 'hsl(var(--accent))',
      color: 'hsl(var(--accent-foreground))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '12px',
      fontSize: '14px',
    },
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
}

export function DiagramCanvas({ draggedItem, onDrop: onDropProp, sidebarCollapsed }: DiagramCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDropHandler = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!draggedItem || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${draggedItem.type}-${Date.now()}`,
        type: 'custom',
        position,
        data: { 
          label: draggedItem.item.name,
          nodeType: draggedItem.type,
          shape: draggedItem.item.name.toLowerCase(),
          preview: draggedItem.item.preview
        },
      };

      setNodes((nds) => nds.concat(newNode));
      onDropProp(position);
    },
    [draggedItem, setNodes, onDropProp]
  );

  return (
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
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="hsl(var(--canvas-grid))"
        />
        <Controls 
          className="bg-card border border-border rounded-lg shadow-card"
        />
        <MiniMap 
          className="bg-card border border-border rounded-lg shadow-card"
          style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
          }}
          nodeColor="hsl(var(--primary))"
          maskColor="hsl(var(--muted) / 0.8)"
        />
      </ReactFlow>
    </div>
  );
}