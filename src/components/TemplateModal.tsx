import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { LayoutTemplate } from 'lucide-react';

const templates = [
  {
    id: 'org-chart',
    name: 'Organizational Chart',
    description: 'Hierarchical structure of an organization',
    category: 'Business',
    nodes: [
      { id: '1', type: 'custom', data: { label: 'CEO', nodeType: 'shapes', shape: 'rectangle', preview: '▭' }, position: { x: 200, y: 0 } },
      { id: '2', type: 'custom', data: { label: 'CTO', nodeType: 'shapes', shape: 'rectangle', preview: '▭' }, position: { x: 100, y: 100 } },
      { id: '3', type: 'custom', data: { label: 'CFO', nodeType: 'shapes', shape: 'rectangle', preview: '▭' }, position: { x: 300, y: 100 } },
      { id: '4', type: 'custom', data: { label: 'Dev Team', nodeType: 'shapes', shape: 'rectangle', preview: '▭' }, position: { x: 50, y: 200 } },
      { id: '5', type: 'custom', data: { label: 'QA Team', nodeType: 'shapes', shape: 'rectangle', preview: '▭' }, position: { x: 150, y: 200 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
      { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' },
      { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
      { id: 'e2-5', source: '2', target: '5', type: 'smoothstep' },
    ]
  },
  {
    id: 'process-flow',
    name: 'Process Flow',
    description: 'Step-by-step process diagram',
    category: 'Process',
    nodes: [
      { id: '1', type: 'custom', data: { label: 'Start', nodeType: 'flowchart', shape: 'circle', preview: '●' }, position: { x: 200, y: 0 } },
      { id: '2', type: 'custom', data: { label: 'Process 1', nodeType: 'flowchart', shape: 'rectangle', preview: '▭' }, position: { x: 200, y: 100 } },
      { id: '3', type: 'custom', data: { label: 'Decision', nodeType: 'flowchart', shape: 'diamond', preview: '◆' }, position: { x: 200, y: 200 } },
      { id: '4', type: 'custom', data: { label: 'Process 2', nodeType: 'flowchart', shape: 'rectangle', preview: '▭' }, position: { x: 100, y: 300 } },
      { id: '5', type: 'custom', data: { label: 'End', nodeType: 'flowchart', shape: 'circle', preview: '●' }, position: { x: 300, y: 300 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
      { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
      { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', label: 'Yes' },
      { id: 'e3-5', source: '3', target: '5', type: 'smoothstep', label: 'No' },
    ]
  },
  {
    id: 'mind-map',
    name: 'Mind Map',
    description: 'Visual representation of information hierarchy',
    category: 'Planning',
    nodes: [
      { id: '1', type: 'custom', data: { label: 'Main Topic', nodeType: 'shapes', shape: 'circle', preview: '●' }, position: { x: 200, y: 150 } },
      { id: '2', type: 'custom', data: { label: 'Subtopic 1', nodeType: 'shapes', shape: 'rectangle', preview: '▭' }, position: { x: 50, y: 50 } },
      { id: '3', type: 'custom', data: { label: 'Subtopic 2', nodeType: 'shapes', shape: 'rectangle', preview: '▭' }, position: { x: 350, y: 50 } },
      { id: '4', type: 'custom', data: { label: 'Subtopic 3', nodeType: 'shapes', shape: 'rectangle', preview: '▭' }, position: { x: 50, y: 250 } },
      { id: '5', type: 'custom', data: { label: 'Subtopic 4', nodeType: 'shapes', shape: 'rectangle', preview: '▭' }, position: { x: 350, y: 250 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', type: 'straight' },
      { id: 'e1-3', source: '1', target: '3', type: 'straight' },
      { id: 'e1-4', source: '1', target: '4', type: 'straight' },
      { id: 'e1-5', source: '1', target: '5', type: 'straight' },
    ]
  }
];

interface TemplateModalProps {
  onApplyTemplate: (template: any) => void;
}

export function TemplateModal({ onApplyTemplate }: TemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutTemplate className="h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {template.description}
                </p>
                <div className="bg-muted rounded p-2 h-20 flex items-center justify-center">
                  <div className="text-xs text-muted-foreground">
                    {template.nodes.length} nodes, {template.edges.length} connections
                  </div>
                </div>
                {selectedTemplate?.id === template.id && (
                  <Button
                    onClick={() => onApplyTemplate(template)}
                    className="w-full mt-3"
                    size="sm"
                  >
                    Use Template
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}