import React, { useState } from 'react';
import { Edge } from '@xyflow/react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Zap, 
  Minus, 
  MoreHorizontal, 
  Type, 
  Palette, 
  Trash2,
  Edit3
} from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface EdgeContextMenuProps {
  edge: Edge;
  onUpdateEdge: (edgeId: string, updates: Partial<Edge>) => void;
  onDeleteEdge: (edgeId: string) => void;
  children: React.ReactNode;
}

export function EdgeContextMenu({ edge, onUpdateEdge, onDeleteEdge, children }: EdgeContextMenuProps) {
  const [showLabelEdit, setShowLabelEdit] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newLabel, setNewLabel] = useState<string>((edge.data?.label as string) || '');

  const handleTypeChange = (edgeType: 'free' | 'step' | 'straight' | 'dashed') => {
    const typeMapping = {
      'free': 'smoothstep',
      'step': 'step', 
      'straight': 'straight',
      'dashed': 'smoothstep'
    };

    onUpdateEdge(edge.id, {
      type: typeMapping[edgeType],
      data: { ...edge.data, edgeType },
      markerEnd: { type: 'arrowclosed' }
    });
  };

  const handleLabelSave = () => {
    onUpdateEdge(edge.id, {
      data: { ...edge.data, label: newLabel }
    });
    setShowLabelEdit(false);
  };

  const handleColorChange = (color: string, hsl: string) => {
    onUpdateEdge(edge.id, {
      data: { ...edge.data, color: hsl },
      style: {
        ...edge.style,
        stroke: hsl
      }
    });
    setShowColorPicker(false);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Zap className="mr-2 h-4 w-4" />
            Tipo de Linha
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleTypeChange('free')}>
              <Zap className="mr-2 h-4 w-4" />
              Linha Livre (Curva)
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleTypeChange('step')}>
              <Minus className="mr-2 h-4 w-4 rotate-90" />
              Linha 90° (Ângulo)
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleTypeChange('straight')}>
              <Minus className="mr-2 h-4 w-4" />
              Linha Reta
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleTypeChange('dashed')}>
              <MoreHorizontal className="mr-2 h-4 w-4" />
              Linha Tracejada
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={(e) => { e.preventDefault(); setShowLabelEdit(true); }}>
          <Type className="mr-2 h-4 w-4" />
          {edge.data?.label ? 'Editar Label' : 'Adicionar Label'}
        </ContextMenuItem>

        <ContextMenuItem onSelect={(e) => { e.preventDefault(); setShowColorPicker(true); }}>
          <Palette className="mr-2 h-4 w-4" />
          Mudar Cor
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem 
          onClick={() => onDeleteEdge(edge.id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar Conexão
        </ContextMenuItem>
      </ContextMenuContent>

      {/* Label Edit Modal */}
      {showLabelEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg border shadow-lg min-w-80">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Edit3 className="mr-2 h-5 w-5" />
              {edge.data?.label ? 'Editar Label' : 'Adicionar Label'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edge-label">Texto da conexão</Label>
            <Input
              id="edge-label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Ex: Sim, Não, Próximo..."
              className="mt-1"
            />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowLabelEdit(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleLabelSave}>
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg border shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Cor da Conexão
            </h3>
            <ColorPicker
              currentColor={(edge.data?.color as string) || 'hsl(var(--primary))'}
              onColorChange={handleColorChange}
            />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowColorPicker(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </ContextMenu>
  );
}