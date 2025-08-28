import { Button } from '@/components/ui/button';
import { TemplateModal } from './TemplateModalWithPreviews';
import { 
  Square, 
  Circle, 
  ArrowRight, 
  Type, 
  MousePointer,
  Minus,
  Move3D,
  Zap,
  RotateCcw,
  RotateCw
} from 'lucide-react';

interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  onApplyTemplate?: (template: any) => void;
}

export function Toolbar({ activeTool, onToolChange, onApplyTemplate }: ToolbarProps) {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'move', icon: Move3D, label: 'Pan' },
  ];

  return (
    <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-2 shadow-toolbar overflow-x-auto">
      <div className="flex items-center gap-1 mr-4 flex-shrink-0">
        <Button variant="primary" size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Button>
      </div>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      <div className="flex items-center gap-1 flex-shrink-0">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToolChange(tool.id)}
              className="h-9 w-9 p-0"
              title={tool.label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <div className="w-px h-6 bg-border mx-2" />

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button variant="ghost" size="sm" title="Rotate Left">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" title="Rotate Right">
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border mx-2" />

      <div className="flex items-center gap-1 flex-shrink-0">
        {onApplyTemplate && (
          <TemplateModal onApplyTemplate={onApplyTemplate} />
        )}
      </div>
    </div>
  );
}