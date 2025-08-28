import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Node, useReactFlow } from '@xyflow/react';

interface FloatingArrowsProps {
  selectedNode: Node;
  onAddConnectedNode: (nodeId: string, direction: 'top' | 'bottom' | 'left' | 'right') => void;
}

export function FloatingArrows({ selectedNode, onAddConnectedNode }: FloatingArrowsProps) {
  const { getViewport, flowToScreenPosition } = useReactFlow();
  const [screenPosition, setScreenPosition] = useState({ x: 0, y: 0 });

  const handleAddNode = useCallback((direction: 'top' | 'bottom' | 'left' | 'right') => {
    onAddConnectedNode(selectedNode.id, direction);
  }, [selectedNode.id, onAddConnectedNode]);

  // Update screen position when node position or viewport changes
  useEffect(() => {
    const updateScreenPosition = () => {
      const nodeWidth = selectedNode.measured?.width || 120;
      const nodeHeight = selectedNode.measured?.height || 60;
      
      // Convert flow position to screen position
      const screenPos = flowToScreenPosition({
        x: selectedNode.position.x,
        y: selectedNode.position.y,
      });
      
      setScreenPosition({
        x: screenPos.x,
        y: screenPos.y,
      });
    };

    updateScreenPosition();
  }, [selectedNode.position.x, selectedNode.position.y, selectedNode.measured, flowToScreenPosition, getViewport]);

  const nodeWidth = selectedNode.measured?.width || 120;
  const nodeHeight = selectedNode.measured?.height || 60;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top Arrow */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute pointer-events-auto w-8 h-8 p-0 rounded-full shadow-lg bg-card border-border hover:bg-accent transition-all"
        style={{
          left: screenPosition.x + nodeWidth / 2 - 16,
          top: screenPosition.y - 32,
        }}
        onClick={() => handleAddNode('top')}
        title="Add node above"
      >
        <Plus className="w-4 h-4" />
      </Button>

      {/* Bottom Arrow */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute pointer-events-auto w-8 h-8 p-0 rounded-full shadow-lg bg-card border-border hover:bg-accent transition-all"
        style={{
          left: screenPosition.x + nodeWidth / 2 - 16,
          top: screenPosition.y + nodeHeight + 8,
        }}
        onClick={() => handleAddNode('bottom')}
        title="Add node below"
      >
        <Plus className="w-4 h-4" />
      </Button>

      {/* Left Arrow */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute pointer-events-auto w-8 h-8 p-0 rounded-full shadow-lg bg-card border-border hover:bg-accent transition-all"
        style={{
          left: screenPosition.x - 32,
          top: screenPosition.y + nodeHeight / 2 - 16,
        }}
        onClick={() => handleAddNode('left')}
        title="Add node to the left"
      >
        <Plus className="w-4 h-4" />
      </Button>

      {/* Right Arrow */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute pointer-events-auto w-8 h-8 p-0 rounded-full shadow-lg bg-card border-border hover:bg-accent transition-all"
        style={{
          left: screenPosition.x + nodeWidth + 8,
          top: screenPosition.y + nodeHeight / 2 - 16,
        }}
        onClick={() => handleAddNode('right')}
        title="Add node to the right"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}