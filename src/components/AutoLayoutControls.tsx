import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutGrid, 
  ArrowDown, 
  ArrowRight, 
  Circle,
  Zap,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  Shuffle,
  X
} from 'lucide-react';
import { useAutoLayout, LayoutOptions } from '../hooks/useAutoLayout';

interface AutoLayoutControlsProps {
  selectedNodeIds: string[];
  onClose: () => void;
}

export function AutoLayoutControls({ selectedNodeIds, onClose }: AutoLayoutControlsProps) {
  const {
    applyHierarchicalLayout,
    applyForceDirectedLayout,
    applyGridLayout,
    applyCircularLayout,
    alignNodes,
    distributeNodes,
  } = useAutoLayout();

  const [layoutOptions, setLayoutOptions] = useState<Partial<LayoutOptions>>({
    direction: 'TB',
    spacing: 150,
    alignment: 'center',
    gridSize: 20,
  });

  const handleLayoutChange = (key: keyof LayoutOptions, value: any) => {
    setLayoutOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="absolute top-4 right-4 w-80 bg-background/95 backdrop-blur-sm border shadow-lg z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Auto Layout</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {selectedNodeIds.length > 0 && (
          <Badge variant="secondary" className="w-fit">
            {selectedNodeIds.length} nodes selected
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Layout Algorithms */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Layout Algorithms</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyHierarchicalLayout(layoutOptions)}
              className="flex items-center gap-2"
            >
              <ArrowDown className="h-4 w-4" />
              Hierarchical
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyGridLayout(layoutOptions)}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyCircularLayout(layoutOptions)}
              className="flex items-center gap-2"
            >
              <Circle className="h-4 w-4" />
              Circular
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyForceDirectedLayout(layoutOptions)}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Force
            </Button>
          </div>
        </div>

        <Separator />

        {/* Layout Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Layout Options</h4>
          
          {/* Direction */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Direction</label>
            <Select
              value={layoutOptions.direction}
              onValueChange={(value) => handleLayoutChange('direction', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TB">Top to Bottom</SelectItem>
                <SelectItem value="LR">Left to Right</SelectItem>
                <SelectItem value="BT">Bottom to Top</SelectItem>
                <SelectItem value="RL">Right to Left</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Spacing */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Spacing: {layoutOptions.spacing}px
            </label>
            <Slider
              value={[layoutOptions.spacing || 150]}
              onValueChange={(value) => handleLayoutChange('spacing', value[0])}
              min={50}
              max={300}
              step={10}
              className="w-full"
            />
          </div>

          {/* Grid Size */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Grid Snap: {layoutOptions.gridSize}px
            </label>
            <Slider
              value={[layoutOptions.gridSize || 20]}
              onValueChange={(value) => handleLayoutChange('gridSize', value[0])}
              min={10}
              max={50}
              step={5}
              className="w-full"
            />
          </div>
        </div>

        <Separator />

        {/* Alignment Tools */}
        {selectedNodeIds.length > 1 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Smart Alignment</h4>
            
            <div className="grid grid-cols-3 gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignNodes(selectedNodeIds, 'left')}
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignNodes(selectedNodeIds, 'center')}
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignNodes(selectedNodeIds, 'right')}
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignNodes(selectedNodeIds, 'top')}
                title="Align Top"
              >
                <AlignVerticalJustifyStart className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignNodes(selectedNodeIds, 'middle')}
                title="Align Middle"
              >
                <AlignVerticalJustifyCenter className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignNodes(selectedNodeIds, 'bottom')}
                title="Align Bottom"
              >
                <AlignVerticalJustifyEnd className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Distribution Tools */}
        {selectedNodeIds.length > 2 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Distribution</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => distributeNodes(selectedNodeIds, 'horizontal')}
                className="flex items-center gap-2"
              >
                <AlignHorizontalJustifyCenter className="h-4 w-4" />
                Horizontal
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => distributeNodes(selectedNodeIds, 'vertical')}
                className="flex items-center gap-2"
              >
                <AlignVerticalJustifyCenter className="h-4 w-4" />
                Vertical
              </Button>
            </div>
          </div>
        )}

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => applyHierarchicalLayout(layoutOptions)}
            className="w-full"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Auto-Arrange All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}