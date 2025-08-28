import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  Layers,
  GripHorizontal,
  GripVertical
} from 'lucide-react';
import { Swimlane } from './Swimlanes';
import { ColorPicker } from './ColorPicker';

interface SwimlanesManagerProps {
  swimlanes: Swimlane[];
  onAddSwimlane: (swimlane: Omit<Swimlane, 'id'>) => void;
  onRemoveSwimlane: (id: string) => void;
  onUpdateSwimlane: (id: string, updates: Partial<Swimlane>) => void;
}

export function SwimlanesPanel({ 
  swimlanes, 
  onAddSwimlane, 
  onRemoveSwimlane, 
  onUpdateSwimlane 
}: SwimlanesManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newLane, setNewLane] = useState({
    label: '',
    orientation: 'horizontal' as 'horizontal' | 'vertical',
    position: 100,
    size: 150,
    color: 'hsl(var(--primary))',
  });

  const handleAddLane = () => {
    if (newLane.label.trim()) {
      onAddSwimlane(newLane);
      setNewLane({
        label: '',
        orientation: 'horizontal',
        position: 100,
        size: 150,
        color: 'hsl(var(--primary))',
      });
    }
  };

  const handleColorChange = (laneId: string, color: string, hsl: string) => {
    onUpdateSwimlane(laneId, { color: hsl });
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-4 z-10 shadow-lg"
      >
        <Layers className="h-4 w-4 mr-2" />
        Raias
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-16 right-4 z-20 w-80 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Raias do Diagrama
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Lane */}
        <div className="border rounded-lg p-3 space-y-3">
          <h4 className="text-sm font-medium">Nova Raia</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="lane-label" className="text-xs">Nome</Label>
              <Input
                id="lane-label"
                value={newLane.label}
                onChange={(e) => setNewLane(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Ex: Setor A"
                className="h-8 text-xs"
              />
            </div>
            
            <div>
              <Label htmlFor="lane-orientation" className="text-xs">Tipo</Label>
              <Select value={newLane.orientation} onValueChange={(value: 'horizontal' | 'vertical') => 
                setNewLane(prev => ({ ...prev, orientation: value }))
              }>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">
                    <div className="flex items-center">
                      <GripHorizontal className="h-3 w-3 mr-2" />
                      Horizontal
                    </div>
                  </SelectItem>
                  <SelectItem value="vertical">
                    <div className="flex items-center">
                      <GripVertical className="h-3 w-3 mr-2" />
                      Vertical
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="lane-position" className="text-xs">Posição</Label>
              <Input
                id="lane-position"
                type="number"
                value={newLane.position}
                onChange={(e) => setNewLane(prev => ({ ...prev, position: Number(e.target.value) }))}
                className="h-8 text-xs"
              />
            </div>
            
            <div>
              <Label htmlFor="lane-size" className="text-xs">Tamanho</Label>
              <Input
                id="lane-size"
                type="number"
                value={newLane.size}
                onChange={(e) => setNewLane(prev => ({ ...prev, size: Number(e.target.value) }))}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <Button onClick={handleAddLane} size="sm" className="w-full h-8">
            <Plus className="h-3 w-3 mr-2" />
            Adicionar Raia
          </Button>
        </div>

        {/* Existing Lanes */}
        {swimlanes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Raias Existentes</h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {swimlanes.map((lane) => (
                <div key={lane.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    {lane.orientation === 'horizontal' ? (
                      <GripHorizontal className="h-3 w-3" />
                    ) : (
                      <GripVertical className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">{lane.label}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-4 h-4 rounded border cursor-pointer"
                      style={{ backgroundColor: lane.color }}
                      onClick={() => {
                        // Color picker would open here - simplified for now
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveSwimlane(lane.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
