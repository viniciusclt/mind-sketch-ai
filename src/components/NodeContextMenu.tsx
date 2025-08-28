import { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Square, 
  Circle, 
  Triangle,
  Diamond,
  Hexagon,
  Edit
} from 'lucide-react';
import { Node } from '@xyflow/react';

interface NodeContextMenuProps {
  selectedNodes: Node[];
  onAddConnectedNode: (nodeId: string, direction: 'top' | 'bottom' | 'left' | 'right') => void;
  onChangeShape: (nodeId: string, shape: string) => void;
  onEditLabel: (nodeId: string) => void;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

const shapes = [
  { name: 'rectangle', icon: Square, preview: '▭' },
  { name: 'circle', icon: Circle, preview: '●' },
  { name: 'diamond', icon: Diamond, preview: '◆' },
  { name: 'triangle', icon: Triangle, preview: '▲' },
  { name: 'hexagon', icon: Hexagon, preview: '⬡' },
];

const directions = [
  { name: 'top', icon: ArrowUp, label: 'Add Above' },
  { name: 'right', icon: ArrowRight, label: 'Add Right' },
  { name: 'bottom', icon: ArrowDown, label: 'Add Below' },
  { name: 'left', icon: ArrowLeft, label: 'Add Left' },
];

export function NodeContextMenu({
  selectedNodes,
  onAddConnectedNode,
  onChangeShape,
  onEditLabel,
  position,
  onClose
}: NodeContextMenuProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!position && selectedNodes.length === 1);
  }, [position, selectedNodes]);

  const handleAddNode = useCallback((direction: 'top' | 'bottom' | 'left' | 'right') => {
    if (selectedNodes.length === 1) {
      onAddConnectedNode(selectedNodes[0].id, direction);
      onClose();
    }
  }, [selectedNodes, onAddConnectedNode, onClose]);

  const handleShapeChange = useCallback((shape: string) => {
    if (selectedNodes.length === 1) {
      onChangeShape(selectedNodes[0].id, shape);
    }
  }, [selectedNodes, onChangeShape]);

  const handleEdit = useCallback(() => {
    if (selectedNodes.length === 1) {
      onEditLabel(selectedNodes[0].id);
      onClose();
    }
  }, [selectedNodes, onEditLabel, onClose]);

  useEffect(() => {
    const handleClickOutside = () => onClose();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible || !position || selectedNodes.length !== 1) return null;

  return (
    <Card 
      className="absolute z-50 p-2 bg-card border-border shadow-toolbar"
      style={{
        left: position.x,
        top: position.y,
        minWidth: '200px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-1">
        {/* Add Connected Node Options */}
        <div className="text-xs font-medium text-muted-foreground mb-1">Add Connected Node</div>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {directions.map(({ name, icon: Icon, label }) => (
            <Button
              key={name}
              variant="ghost"
              size="sm"
              onClick={() => handleAddNode(name as any)}
              className="h-8 text-xs justify-start gap-1"
            >
              <Icon className="w-3 h-3" />
              <span className="truncate">{label}</span>
            </Button>
          ))}
        </div>

        {/* Shape Change Options */}
        <div className="text-xs font-medium text-muted-foreground mb-1">Change Shape</div>
        <div className="grid grid-cols-3 gap-1 mb-2">
          {shapes.map(({ name, icon: Icon, preview }) => (
            <Button
              key={name}
              variant="ghost"
              size="sm"
              onClick={() => handleShapeChange(name)}
              className="h-8 text-xs justify-start gap-1"
            >
              <Icon className="w-3 h-3" />
              <span className="capitalize text-xs">{name}</span>
            </Button>
          ))}
        </div>

        {/* Edit Label */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-8 text-xs justify-start gap-1"
        >
          <Edit className="w-3 h-3" />
          Edit Label
        </Button>
      </div>
    </Card>
  );
}