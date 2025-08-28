import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorPicker } from './ColorPicker';
import { Palette } from 'lucide-react';

interface NodeColorEditorProps {
  nodeIds: string[];
  onColorChange: (nodeIds: string[], colorType: 'border' | 'background' | 'text', color: string, hsl: string) => void;
  onClose: () => void;
}

export function NodeColorEditor({ nodeIds, onColorChange, onClose }: NodeColorEditorProps) {
  const [selectedType, setSelectedType] = useState<'border' | 'background' | 'text'>('border');

  const colorTypes = [
    { id: 'border', label: 'Borda', icon: '⬜' },
    { id: 'background', label: 'Fundo', icon: '🎨' },
    { id: 'text', label: 'Texto', icon: '📝' }
  ] as const;

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Personalizar Cores
          <span className="text-xs text-muted-foreground">
            ({nodeIds.length} {nodeIds.length === 1 ? 'nó' : 'nós'})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tipo de cor */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Elemento
          </label>
          <div className="grid grid-cols-3 gap-1 mt-2">
            {colorTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className="text-xs"
              >
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Seletor de cor */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Cor do {colorTypes.find(t => t.id === selectedType)?.label}
          </label>
          <div className="mt-2">
            <ColorPicker
              onColorChange={(color, hsl) => onColorChange(nodeIds, selectedType, color, hsl)}
              trigger={
                <Button variant="outline" className="w-full justify-center gap-2">
                  <Palette className="h-4 w-4" />
                  Escolher Cor
                </Button>
              }
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1">
            Fechar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}