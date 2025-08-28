import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Node } from '@xyflow/react';
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
  Edit3,
  Palette
} from 'lucide-react';
import { NodeColorEditor } from './NodeColorEditor';

interface NodeContextMenuProps {
  selectedNodes: Node[];
  position: { x: number; y: number } | null;
  visible: boolean;
  onAddConnectedNode: (parentNodeId: string, direction: 'top' | 'bottom' | 'left' | 'right') => void;
  onChangeShape: (nodeIds: string[], shape: string) => void;
  onEditLabel: (nodeId: string) => void;
  onChangeColor: (nodeIds: string[], colorType: 'border' | 'background' | 'text', color: string, hsl: string) => void;
  onClose: () => void;
}

const shapes = [
  { value: 'rectangle', name: 'Retângulo', icon: Square, preview: '▭' },
  { value: 'circle', name: 'Círculo', icon: Circle, preview: '●' },
  { value: 'diamond', name: 'Losango', icon: Diamond, preview: '◆' },
  { value: 'triangle', name: 'Triângulo', icon: Triangle, preview: '▲' },
  { value: 'hexagon', name: 'Hexágono', icon: Hexagon, preview: '⬡' },
];

const directions = [
  { value: 'top' as const, icon: ArrowUp, label: 'Acima' },
  { value: 'right' as const, icon: ArrowRight, label: 'Direita' },
  { value: 'bottom' as const, icon: ArrowDown, label: 'Abaixo' },
  { value: 'left' as const, icon: ArrowLeft, label: 'Esquerda' },
];

export function NodeContextMenu({ 
  selectedNodes, 
  position, 
  visible, 
  onAddConnectedNode, 
  onChangeShape, 
  onEditLabel, 
  onChangeColor,
  onClose 
}: NodeContextMenuProps) {
  const [menuVisible, setMenuVisible] = useState(visible);
  const [showColorEditor, setShowColorEditor] = useState(false);

  useEffect(() => {
    setMenuVisible(visible);
  }, [visible]);

  const handleAddNode = useCallback((direction: 'top' | 'bottom' | 'left' | 'right') => {
    if (selectedNodes.length === 1) {
      onAddConnectedNode(selectedNodes[0].id, direction);
      onClose();
    }
  }, [selectedNodes, onAddConnectedNode, onClose]);

  const handleShapeChange = useCallback((shape: string) => {
    const nodeIds = selectedNodes.map(n => n.id);
    onChangeShape(nodeIds, shape);
    onClose();
  }, [selectedNodes, onChangeShape, onClose]);

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

    if (menuVisible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuVisible, onClose]);

  if (!menuVisible || !position) {
    return null;
  }

  if (showColorEditor) {
    return (
      <div 
        className="fixed z-50"
        style={{ left: position.x, top: position.y }}
      >
        <NodeColorEditor 
          nodeIds={selectedNodes.map(n => n.id)}
          onColorChange={onChangeColor}
          onClose={() => {
            setShowColorEditor(false);
            onClose();
          }}
        />
      </div>
    );
  }

  return (
    <Card 
      className="fixed z-50 bg-card border-border shadow-toolbar min-w-[220px] p-3"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-3">
        {/* Actions for nodes */}
        {selectedNodes.length === 1 && (
          <>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground px-2 py-1 uppercase tracking-wider">
                Adicionar Conexão
              </div>
              {directions.map((direction) => {
                const Icon = direction.icon;
                return (
                  <Button
                    key={direction.value}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={() => handleAddNode(direction.value)}
                  >
                    <Icon className="h-4 w-4" />
                    {direction.label}
                  </Button>
                );
              })}
            </div>
            
            <div className="w-full h-px bg-border" />
          </>
        )}
        
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground px-2 py-1 uppercase tracking-wider">
            Formato
          </div>
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <Button
                key={shape.value}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-sm"
                onClick={() => handleShapeChange(shape.value)}
              >
                <Icon className="h-4 w-4" />
                {shape.name}
              </Button>
            );
          })}
        </div>
        
        <div className="w-full h-px bg-border" />
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sm"
          onClick={() => setShowColorEditor(true)}
        >
          <Palette className="h-4 w-4" />
          Personalizar Cores
        </Button>

        {selectedNodes.length === 1 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sm"
            onClick={handleEdit}
          >
            <Edit3 className="h-4 w-4" />
            Editar Texto
          </Button>
        )}
      </div>
    </Card>
  );
}