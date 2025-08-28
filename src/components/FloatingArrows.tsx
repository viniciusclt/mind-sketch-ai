import { useCallback } from 'react';
import { Button } from './ui/button';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { Node } from '@xyflow/react';

interface FloatingArrowsProps {
  selectedNode: Node;
  onAddConnectedNode: (nodeId: string, direction: 'top' | 'bottom' | 'left' | 'right') => void;
}

export function FloatingArrows({ selectedNode, onAddConnectedNode }: FloatingArrowsProps) {
  const handleAddNode = useCallback((direction: 'top' | 'bottom' | 'left' | 'right') => {
    onAddConnectedNode(selectedNode.id, direction);
  }, [selectedNode.id, onAddConnectedNode]);

  const nodeRect = {
    x: selectedNode.position.x,
    y: selectedNode.position.y,
    width: selectedNode.measured?.width || 120,
    height: selectedNode.measured?.height || 60
  };

  return (
    <div className="pointer-events-none">
      {/* Top Arrow */}
      <Button
        variant="secondary"
        size="sm"
        className="absolute pointer-events-auto w-8 h-8 p-0 rounded-full shadow-lg bg-card border-border hover:bg-accent z-50"
        style={{
          left: nodeRect.x + nodeRect.width / 2 - 16,
          top: nodeRect.y - 32,
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
        className="absolute pointer-events-auto w-8 h-8 p-0 rounded-full shadow-lg bg-card border-border hover:bg-accent z-50"
        style={{
          left: nodeRect.x + nodeRect.width / 2 - 16,
          top: nodeRect.y + nodeRect.height + 8,
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
        className="absolute pointer-events-auto w-8 h-8 p-0 rounded-full shadow-lg bg-card border-border hover:bg-accent z-50"
        style={{
          left: nodeRect.x - 32,
          top: nodeRect.y + nodeRect.height / 2 - 16,
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
        className="absolute pointer-events-auto w-8 h-8 p-0 rounded-full shadow-lg bg-card border-border hover:bg-accent z-50"
        style={{
          left: nodeRect.x + nodeRect.width + 8,
          top: nodeRect.y + nodeRect.height / 2 - 16,
        }}
        onClick={() => handleAddNode('right')}
        title="Add node to the right"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}