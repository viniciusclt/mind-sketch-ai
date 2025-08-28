import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Move3D,
  Group,
  Ungroup
} from 'lucide-react';
import { ColorPicker } from './ColorPicker';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  color: string;
  zIndex: number;
  nodeIds: string[];
}

interface LayersManagerProps {
  layers: Layer[];
  nodes: Node[];
  selectedNodes: string[];
  onAddLayer: (layer: Omit<Layer, 'id'>) => void;
  onRemoveLayer: (layerId: string) => void;
  onUpdateLayer: (layerId: string, updates: Partial<Layer>) => void;
  onToggleLayerVisibility: (layerId: string) => void;
  onMoveLayer: (layerId: string, direction: 'up' | 'down') => void;
  onGroupNodes: (layerId: string, nodeIds: string[]) => void;
  onUngroupNodes: (nodeIds: string[]) => void;
}

export function LayersManager({
  layers,
  nodes,
  selectedNodes,
  onAddLayer,
  onRemoveLayer,
  onUpdateLayer,
  onToggleLayerVisibility,
  onMoveLayer,
  onGroupNodes,
  onUngroupNodes
}: LayersManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newLayerName, setNewLayerName] = useState('');
  const [editingLayer, setEditingLayer] = useState<string | null>(null);

  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      const newLayer: Omit<Layer, 'id'> = {
        name: newLayerName,
        visible: true,
        color: 'hsl(var(--primary))',
        zIndex: layers.length,
        nodeIds: [],
      };
      onAddLayer(newLayer);
      setNewLayerName('');
    }
  };

  const handleGroupSelectedNodes = () => {
    if (selectedNodes.length > 0) {
      // Create new layer for selected nodes
      const layerName = `Grupo ${layers.length + 1}`;
      const newLayer: Omit<Layer, 'id'> = {
        name: layerName,
        visible: true,
        color: `hsl(${Math.floor(Math.random() * 360)} 70% 50%)`,
        zIndex: layers.length,
        nodeIds: selectedNodes,
      };
      onAddLayer(newLayer);
    }
  };

  const getLayerForNode = (nodeId: string) => {
    return layers.find(layer => layer.nodeIds.includes(nodeId));
  };

  const getNodesInLayer = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return [];
    return nodes.filter(node => layer.nodeIds.includes(node.id));
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-10 shadow-lg"
      >
        <Layers className="h-4 w-4 mr-2" />
        Layers
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-4 z-20 w-80 shadow-lg max-h-96 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Gerenciar Layers
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-80">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleGroupSelectedNodes}
            disabled={selectedNodes.length === 0}
            className="flex-1"
          >
            <Group className="h-3 w-3 mr-2" />
            Agrupar ({selectedNodes.length})
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onUngroupNodes(selectedNodes)}
            disabled={selectedNodes.length === 0}
            className="flex-1"
          >
            <Ungroup className="h-3 w-3 mr-2" />
            Desagrupar
          </Button>
        </div>

        {/* Add New Layer */}
        <div className="border rounded-lg p-3 space-y-3">
          <h4 className="text-sm font-medium">Nova Layer</h4>
          <div className="flex gap-2">
            <Input
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              placeholder="Nome da layer"
              className="h-8 text-xs"
            />
            <Button onClick={handleAddLayer} size="sm" className="h-8">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Existing Layers */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Layers Existentes</h4>
          <div className="space-y-1">
            {layers
              .sort((a, b) => b.zIndex - a.zIndex) // Higher z-index first
              .map((layer) => {
                const nodesInLayer = getNodesInLayer(layer.id);
                const isEditing = editingLayer === layer.id;
                
                return (
                  <div key={layer.id} className="border rounded p-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        {/* Layer Color */}
                        <div 
                          className="w-4 h-4 rounded border flex-shrink-0"
                          style={{ backgroundColor: layer.color }}
                        />
                        
                        {/* Layer Name */}
                        {isEditing ? (
                          <Input
                            value={layer.name}
                            onChange={(e) => onUpdateLayer(layer.id, { name: e.target.value })}
                            onBlur={() => setEditingLayer(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingLayer(null)}
                            className="h-6 text-xs"
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="text-xs font-medium cursor-pointer flex-1"
                            onClick={() => setEditingLayer(layer.id)}
                          >
                            {layer.name} ({nodesInLayer.length})
                          </span>
                        )}
                        
                        {/* Visibility Toggle */}
                        <Switch
                          checked={layer.visible}
                          onCheckedChange={() => onToggleLayerVisibility(layer.id)}
                          className="scale-75"
                        />
                      </div>

                      <div className="flex items-center space-x-1">
                        {/* Move Layer */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMoveLayer(layer.id, 'up')}
                          className="h-6 w-6 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMoveLayer(layer.id, 'down')}
                          className="h-6 w-6 p-0"
                        >
                          ↓
                        </Button>
                        
                        {/* Delete Layer */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveLayer(layer.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Layer Nodes Preview */}
                    {nodesInLayer.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <div className="flex flex-wrap gap-1">
                        {nodesInLayer.slice(0, 3).map((node) => (
                          <span 
                            key={node.id} 
                            className="bg-muted px-1 rounded"
                          >
                            {(node.data as any).label || 'Node'}
                          </span>
                        ))}
                          {nodesInLayer.length > 3 && (
                            <span className="bg-muted px-1 rounded">
                              +{nodesInLayer.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {layers.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Nenhuma layer criada</p>
            <p className="text-xs">Selecione nós e clique em "Agrupar"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook for managing layers
export function useLayersManager() {
  const [layers, setLayers] = useState<Layer[]>([]);

  const addLayer = (layer: Omit<Layer, 'id'>) => {
    const newLayer: Layer = {
      ...layer,
      id: `layer-${Date.now()}`,
    };
    setLayers(prev => [...prev, newLayer]);
    return newLayer.id;
  };

  const removeLayer = (layerId: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
  };

  const updateLayer = (layerId: string, updates: Partial<Layer>) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    );
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const moveLayer = (layerId: string, direction: 'up' | 'down') => {
    setLayers(prev => {
      const layerIndex = prev.findIndex(layer => layer.id === layerId);
      if (layerIndex === -1) return prev;

      const newLayers = [...prev];
      const layer = newLayers[layerIndex];
      const targetIndex = direction === 'up' ? layerIndex + 1 : layerIndex - 1;

      if (targetIndex >= 0 && targetIndex < newLayers.length) {
        const targetLayer = newLayers[targetIndex];
        // Swap z-index values
        const tempZIndex = layer.zIndex;
        layer.zIndex = targetLayer.zIndex;
        targetLayer.zIndex = tempZIndex;
      }

      return newLayers;
    });
  };

  const groupNodes = (layerId: string, nodeIds: string[]) => {
    setLayers(prev =>
      prev.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, nodeIds: [...new Set([...layer.nodeIds, ...nodeIds])] };
        }
        // Remove nodes from other layers
        return { ...layer, nodeIds: layer.nodeIds.filter(id => !nodeIds.includes(id)) };
      })
    );
  };

  const ungroupNodes = (nodeIds: string[]) => {
    setLayers(prev =>
      prev.map(layer => ({
        ...layer,
        nodeIds: layer.nodeIds.filter(id => !nodeIds.includes(id))
      }))
    );
  };

  const getLayerForNode = (nodeId: string) => {
    return layers.find(layer => layer.nodeIds.includes(nodeId));
  };

  const getVisibleNodeIds = () => {
    const visibleLayers = layers.filter(layer => layer.visible);
    return new Set(visibleLayers.flatMap(layer => layer.nodeIds));
  };

  return {
    layers,
    addLayer,
    removeLayer,
    updateLayer,
    toggleLayerVisibility,
    moveLayer,
    groupNodes,
    ungroupNodes,
    getLayerForNode,
    getVisibleNodeIds,
  };
}
