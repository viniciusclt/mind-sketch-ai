import { useCallback } from 'react';
import { Node, Edge, useReactFlow } from '@xyflow/react';

export interface LayoutOptions {
  direction: 'TB' | 'LR' | 'BT' | 'RL'; // Top-Bottom, Left-Right, Bottom-Top, Right-Left
  spacing: number;
  alignment: 'start' | 'center' | 'end';
  gridSize: number;
}

export const useAutoLayout = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();

  // Hierarchical layout algorithm
  const applyHierarchicalLayout = useCallback(async (options: Partial<LayoutOptions> = {}) => {
    const nodes = getNodes();
    const edges = getEdges();
    
    const {
      direction = 'TB',
      spacing = 150,
      alignment = 'center',
      gridSize = 20
    } = options;

    if (nodes.length === 0) return;

    // Find root nodes (nodes with no incoming edges)
    const rootNodes = nodes.filter(node => 
      !edges.some(edge => edge.target === node.id)
    );

    // If no root nodes found, use the first node
    if (rootNodes.length === 0) {
      rootNodes.push(nodes[0]);
    }

    const positioned = new Set<string>();
    const levels: Node[][] = [];

    // Build hierarchy levels using BFS
    const queue = rootNodes.map(node => ({ node, level: 0 }));
    positioned.clear();

    while (queue.length > 0) {
      const { node, level } = queue.shift()!;
      
      if (positioned.has(node.id)) continue;
      positioned.add(node.id);

      if (!levels[level]) levels[level] = [];
      levels[level].push(node);

      // Find children
      const children = edges
        .filter(edge => edge.source === node.id)
        .map(edge => nodes.find(n => n.id === edge.target))
        .filter(Boolean) as Node[];

      children.forEach(child => {
        if (!positioned.has(child.id)) {
          queue.push({ node: child, level: level + 1 });
        }
      });
    }

    // Position nodes based on direction
    const layoutNodes = nodes.map(node => {
      const levelIndex = levels.findIndex(level => 
        level.some(n => n.id === node.id)
      );
      
      if (levelIndex === -1) return node;

      const level = levels[levelIndex];
      const nodeIndexInLevel = level.findIndex(n => n.id === node.id);
      const levelWidth = level.length;

      let x = 0, y = 0;

      switch (direction) {
        case 'TB': // Top to Bottom
          y = levelIndex * spacing;
          x = (nodeIndexInLevel - (levelWidth - 1) / 2) * spacing;
          break;
        case 'LR': // Left to Right
          x = levelIndex * spacing;
          y = (nodeIndexInLevel - (levelWidth - 1) / 2) * spacing;
          break;
        case 'BT': // Bottom to Top
          y = -levelIndex * spacing;
          x = (nodeIndexInLevel - (levelWidth - 1) / 2) * spacing;
          break;
        case 'RL': // Right to Left
          x = -levelIndex * spacing;
          y = (nodeIndexInLevel - (levelWidth - 1) / 2) * spacing;
          break;
      }

      // Snap to grid
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;

      return {
        ...node,
        position: { x, y },
      };
    });

    setNodes(layoutNodes);
    
    // Fit view after layout
    setTimeout(() => fitView({ duration: 800 }), 100);
  }, [getNodes, getEdges, setNodes, fitView]);

  // Force-directed layout (simplified spring model)
  const applyForceDirectedLayout = useCallback(async (options: Partial<LayoutOptions> = {}) => {
    const nodes = getNodes();
    const edges = getEdges();
    
    const {
      spacing = 120,
      gridSize = 20
    } = options;

    if (nodes.length === 0) return;

    // Initialize positions if not set
    let layoutNodes = nodes.map((node, index) => ({
      ...node,
      position: node.position || {
        x: Math.cos((index * 2 * Math.PI) / nodes.length) * 200,
        y: Math.sin((index * 2 * Math.PI) / nodes.length) * 200,
      },
    }));

    // Simplified force-directed algorithm
    const iterations = 50;
    const repulsionStrength = 1000;
    const attractionStrength = 0.01;
    const damping = 0.9;

    for (let iter = 0; iter < iterations; iter++) {
      const forces: { [id: string]: { x: number; y: number } } = {};

      // Initialize forces
      layoutNodes.forEach(node => {
        forces[node.id] = { x: 0, y: 0 };
      });

      // Repulsion between all nodes
      for (let i = 0; i < layoutNodes.length; i++) {
        for (let j = i + 1; j < layoutNodes.length; j++) {
          const nodeA = layoutNodes[i];
          const nodeB = layoutNodes[j];
          
          const dx = nodeB.position.x - nodeA.position.x;
          const dy = nodeB.position.y - nodeA.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const force = repulsionStrength / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          forces[nodeA.id].x -= fx;
          forces[nodeA.id].y -= fy;
          forces[nodeB.id].x += fx;
          forces[nodeB.id].y += fy;
        }
      }

      // Attraction along edges
      edges.forEach(edge => {
        const sourceNode = layoutNodes.find(n => n.id === edge.source);
        const targetNode = layoutNodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const dx = targetNode.position.x - sourceNode.position.x;
          const dy = targetNode.position.y - sourceNode.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const force = distance * attractionStrength;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          forces[sourceNode.id].x += fx;
          forces[sourceNode.id].y += fy;
          forces[targetNode.id].x -= fx;
          forces[targetNode.id].y -= fy;
        }
      });

      // Apply forces
      layoutNodes = layoutNodes.map(node => ({
        ...node,
        position: {
          x: node.position.x + forces[node.id].x * damping,
          y: node.position.y + forces[node.id].y * damping,
        },
      }));
    }

    // Snap to grid
    layoutNodes = layoutNodes.map(node => ({
      ...node,
      position: {
        x: Math.round(node.position.x / gridSize) * gridSize,
        y: Math.round(node.position.y / gridSize) * gridSize,
      },
    }));

    setNodes(layoutNodes);
    setTimeout(() => fitView({ duration: 800 }), 100);
  }, [getNodes, getEdges, setNodes, fitView]);

  // Grid layout
  const applyGridLayout = useCallback(async (options: Partial<LayoutOptions> = {}) => {
    const nodes = getNodes();
    
    const {
      spacing = 150,
      gridSize = 20
    } = options;

    if (nodes.length === 0) return;

    const cols = Math.ceil(Math.sqrt(nodes.length));
    
    const layoutNodes = nodes.map((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      return {
        ...node,
        position: {
          x: Math.round((col * spacing) / gridSize) * gridSize,
          y: Math.round((row * spacing) / gridSize) * gridSize,
        },
      };
    });

    setNodes(layoutNodes);
    setTimeout(() => fitView({ duration: 800 }), 100);
  }, [getNodes, setNodes, fitView]);

  // Circular layout
  const applyCircularLayout = useCallback(async (options: Partial<LayoutOptions> = {}) => {
    const nodes = getNodes();
    
    const {
      spacing = 200,
      gridSize = 20
    } = options;

    if (nodes.length === 0) return;

    const radius = (nodes.length * spacing) / (2 * Math.PI);
    
    const layoutNodes = nodes.map((node, index) => {
      const angle = (index * 2 * Math.PI) / nodes.length;
      
      return {
        ...node,
        position: {
          x: Math.round((Math.cos(angle) * radius) / gridSize) * gridSize,
          y: Math.round((Math.sin(angle) * radius) / gridSize) * gridSize,
        },
      };
    });

    setNodes(layoutNodes);
    setTimeout(() => fitView({ duration: 800 }), 100);
  }, [getNodes, setNodes, fitView]);

  // Smart alignment functions
  const alignNodes = useCallback((nodeIds: string[], alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const nodes = getNodes();
    const selectedNodes = nodes.filter(node => nodeIds.includes(node.id));
    
    if (selectedNodes.length < 2) return;

    let targetValue: number;
    
    switch (alignment) {
      case 'left':
        targetValue = Math.min(...selectedNodes.map(n => n.position.x));
        break;
      case 'right':
        targetValue = Math.max(...selectedNodes.map(n => n.position.x));
        break;
      case 'center':
        const avgX = selectedNodes.reduce((sum, n) => sum + n.position.x, 0) / selectedNodes.length;
        targetValue = avgX;
        break;
      case 'top':
        targetValue = Math.min(...selectedNodes.map(n => n.position.y));
        break;
      case 'bottom':
        targetValue = Math.max(...selectedNodes.map(n => n.position.y));
        break;
      case 'middle':
        const avgY = selectedNodes.reduce((sum, n) => sum + n.position.y, 0) / selectedNodes.length;
        targetValue = avgY;
        break;
      default:
        return;
    }

    const alignedNodes = nodes.map(node => {
      if (!nodeIds.includes(node.id)) return node;
      
      const newPosition = { ...node.position };
      
      if (['left', 'right', 'center'].includes(alignment)) {
        newPosition.x = targetValue;
      } else {
        newPosition.y = targetValue;
      }
      
      return { ...node, position: newPosition };
    });

    setNodes(alignedNodes);
  }, [getNodes, setNodes]);

  // Distribute nodes evenly
  const distributeNodes = useCallback((nodeIds: string[], direction: 'horizontal' | 'vertical') => {
    const nodes = getNodes();
    const selectedNodes = nodes.filter(node => nodeIds.includes(node.id));
    
    if (selectedNodes.length < 3) return;

    // Sort by position
    selectedNodes.sort((a, b) => 
      direction === 'horizontal' 
        ? a.position.x - b.position.x 
        : a.position.y - b.position.y
    );

    const first = selectedNodes[0];
    const last = selectedNodes[selectedNodes.length - 1];
    const totalDistance = direction === 'horizontal' 
      ? last.position.x - first.position.x
      : last.position.y - first.position.y;
    
    const spacing = totalDistance / (selectedNodes.length - 1);

    const distributedNodes = nodes.map(node => {
      const selectedIndex = selectedNodes.findIndex(n => n.id === node.id);
      if (selectedIndex === -1) return node;
      
      if (selectedIndex === 0 || selectedIndex === selectedNodes.length - 1) {
        return node; // Keep first and last in place
      }
      
      const newPosition = { ...node.position };
      
      if (direction === 'horizontal') {
        newPosition.x = first.position.x + (selectedIndex * spacing);
      } else {
        newPosition.y = first.position.y + (selectedIndex * spacing);
      }
      
      return { ...node, position: newPosition };
    });

    setNodes(distributedNodes);
  }, [getNodes, setNodes]);

  return {
    applyHierarchicalLayout,
    applyForceDirectedLayout,
    applyGridLayout,
    applyCircularLayout,
    alignNodes,
    distributeNodes,
  };
};