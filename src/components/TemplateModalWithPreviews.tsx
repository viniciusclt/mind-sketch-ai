import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { File, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const templates = [
  {
    id: 'org-chart',
    name: 'Organograma',
    description: 'Estrutura organizacional com hierarquia',
    category: 'Negócios',
    preview: '👤\n├─👥\n└─👥',
    nodes: [
      { id: '1', type: 'custom', data: { label: 'CEO', shape: 'rectangle', preview: '▭' }, position: { x: 150, y: 0 } },
      { id: '2', type: 'custom', data: { label: 'CTO', shape: 'rectangle', preview: '▭' }, position: { x: 50, y: 100 } },
      { id: '3', type: 'custom', data: { label: 'CFO', shape: 'rectangle', preview: '▭' }, position: { x: 250, y: 100 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } },
      { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } },
    ]
  },
  {
    id: 'process-flow',
    name: 'Fluxo de Processo',
    description: 'Fluxograma com decisões e processos',
    category: 'Processos',
    preview: '🟦→◆→🟦',
    nodes: [
      { id: '1', type: 'custom', data: { label: 'Início', shape: 'circle', preview: '●' }, position: { x: 0, y: 0 } },
      { id: '2', type: 'custom', data: { label: 'Processo', shape: 'rectangle', preview: '▭' }, position: { x: 150, y: 0 } },
      { id: '3', type: 'custom', data: { label: 'Decisão', shape: 'diamond', preview: '◆' }, position: { x: 300, y: 0 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } },
      { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', markerEnd: { type: 'arrowclosed' } },
    ]
  },
  {
    id: 'mind-map',
    name: 'Mapa Mental',
    description: 'Estrutura de ideias centralizada',
    category: 'Criatividade',
    preview: '💡\n├─📝\n├─🎯\n└─⚡',
    nodes: [
      { id: '1', type: 'custom', data: { label: 'Ideia Central', shape: 'circle', preview: '●' }, position: { x: 150, y: 100 } },
      { id: '2', type: 'custom', data: { label: 'Tópico 1', shape: 'rectangle', preview: '▭' }, position: { x: 0, y: 0 } },
      { id: '3', type: 'custom', data: { label: 'Tópico 2', shape: 'rectangle', preview: '▭' }, position: { x: 300, y: 0 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
      { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' },
    ]
  },
];

interface TemplateModalProps {
  onApplyTemplate: (template: any) => void;
}

export function TemplateModal({ onApplyTemplate }: TemplateModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const handleApply = () => {
    if (selectedTemplate) {
      onApplyTemplate(selectedTemplate);
      setOpen(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <File className="h-4 w-4" />
          <span className="hidden sm:inline">Templates</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <File className="h-5 w-5" />
            Escolher Template
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 min-h-0">
          {/* Lista de Templates */}
          <ScrollArea className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPreview(showPreview === template.id ? null : template.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {template.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-md p-3 text-center font-mono text-sm whitespace-pre-line">
                      {template.preview}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Preview Detalhado */}
          {showPreview && (
            <div className="w-80 border-l border-border p-6 bg-muted/30">
              <h4 className="font-medium mb-3">Preview Detalhado</h4>
              {(() => {
                const template = templates.find(t => t.id === showPreview);
                if (!template) return null;
                
                return (
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-2">Nós ({template.nodes.length})</h5>
                      <div className="space-y-1">
                        {template.nodes.map((node) => (
                          <div key={node.id} className="text-xs bg-background rounded px-2 py-1 flex items-center gap-2">
                            <span>{node.data.preview}</span>
                            <span>{node.data.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-2">Conexões ({template.edges.length})</h5>
                      <div className="space-y-1">
                        {template.edges.map((edge) => (
                          <div key={edge.id} className="text-xs bg-background rounded px-2 py-1">
                            {edge.source} → {edge.target}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-6 pt-0 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {selectedTemplate ? `Selecionado: ${selectedTemplate.name}` : 'Selecione um template'}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApply} disabled={!selectedTemplate}>
              Usar Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}