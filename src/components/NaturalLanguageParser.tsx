import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Node, Edge } from '@xyflow/react';
import { FileText, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NaturalLanguageParserProps {
  onDiagramGenerated: (nodes: Node[], edges: Edge[]) => void;
}

export function NaturalLanguageParser({ onDiagramGenerated }: NaturalLanguageParserProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const parseText = useCallback((text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeMap = new Map<string, Node>();
    let nodeCounter = 1;

    lines.forEach((line, index) => {
      const cleanLine = line.trim();
      
      // Pattern: "A -> B" or "A conecta com B"
      const arrowPattern = /(.+?)\s*(?:->|→|conecta com|connects to)\s*(.+)/i;
      const arrowMatch = cleanLine.match(arrowPattern);
      
      if (arrowMatch) {
        const sourceLabel = arrowMatch[1].trim();
        const targetLabel = arrowMatch[2].trim();
        
        // Create or get source node
        let sourceNode = Array.from(nodeMap.values()).find(n => n.data.label === sourceLabel);
        if (!sourceNode) {
          sourceNode = {
            id: `node-${nodeCounter++}`,
            type: 'custom',
            position: { x: 100 + (nodeMap.size % 3) * 200, y: 100 + Math.floor(nodeMap.size / 3) * 120 },
            data: {
              label: sourceLabel,
              nodeType: 'shapes',
              shape: sourceLabel.toLowerCase().includes('decisão') || sourceLabel.toLowerCase().includes('decision') ? 'diamond' : 'rectangle',
              preview: sourceLabel.toLowerCase().includes('decisão') || sourceLabel.toLowerCase().includes('decision') ? '◆' : '▭'
            }
          };
          nodeMap.set(sourceNode.id, sourceNode);
          nodes.push(sourceNode);
        }
        
        // Create or get target node
        let targetNode = Array.from(nodeMap.values()).find(n => n.data.label === targetLabel);
        if (!targetNode) {
          targetNode = {
            id: `node-${nodeCounter++}`,
            type: 'custom',
            position: { x: 100 + (nodeMap.size % 3) * 200, y: 100 + Math.floor(nodeMap.size / 3) * 120 },
            data: {
              label: targetLabel,
              nodeType: 'shapes',
              shape: targetLabel.toLowerCase().includes('decisão') || targetLabel.toLowerCase().includes('decision') ? 'diamond' : 'rectangle',
              preview: targetLabel.toLowerCase().includes('decisão') || targetLabel.toLowerCase().includes('decision') ? '◆' : '▭'
            }
          };
          nodeMap.set(targetNode.id, targetNode);
          nodes.push(targetNode);
        }
        
        // Create edge
        const edge: Edge = {
          id: `edge-${sourceNode.id}-${targetNode.id}`,
          source: sourceNode.id,
          target: targetNode.id,
          type: 'smoothstep',
          style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
        };
        edges.push(edge);
      } else {
        // Pattern: Single node or "início: A, fim: B"
        const flowPattern = /(?:início|start|inicio):\s*(.+?),\s*(?:fim|end):\s*(.+)/i;
        const flowMatch = cleanLine.match(flowPattern);
        
        if (flowMatch) {
          const startLabel = flowMatch[1].trim();
          const endLabel = flowMatch[2].trim();
          
          const startNode: Node = {
            id: `node-${nodeCounter++}`,
            type: 'custom',
            position: { x: 100, y: 100 },
            data: {
              label: startLabel,
              nodeType: 'shapes',
              shape: 'rectangle',
              preview: '▭'
            }
          };
          
          const endNode: Node = {
            id: `node-${nodeCounter++}`,
            type: 'custom',
            position: { x: 400, y: 100 },
            data: {
              label: endLabel,
              nodeType: 'shapes',
              shape: 'rectangle',
              preview: '▭'
            }
          };
          
          nodes.push(startNode, endNode);
          
          const edge: Edge = {
            id: `edge-${startNode.id}-${endNode.id}`,
            source: startNode.id,
            target: endNode.id,
            type: 'smoothstep',
            style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
          };
          edges.push(edge);
        } else if (cleanLine && !cleanLine.includes('->') && !cleanLine.includes('conecta')) {
          // Single node
          const singleNode: Node = {
            id: `node-${nodeCounter++}`,
            type: 'custom',
            position: { x: 100 + (nodes.length % 3) * 200, y: 100 + Math.floor(nodes.length / 3) * 120 },
            data: {
              label: cleanLine,
              nodeType: 'shapes',
              shape: 'rectangle',
              preview: '▭'
            }
          };
          nodes.push(singleNode);
        }
      }
    });

    return { nodes, edges };
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to generate a diagram",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { nodes, edges } = parseText(input);
      
      if (nodes.length === 0) {
        toast({
          title: "No Diagram Generated",
          description: "Could not parse the input text. Try using patterns like 'A -> B' or 'Start connects to End'",
          variant: "destructive",
        });
        return;
      }
      
      onDiagramGenerated(nodes, edges);
      
      toast({
        title: "Diagram Generated",
        description: `Created ${nodes.length} nodes and ${edges.length} connections`,
      });
      
      setInput('');
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate diagram from text",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, parseText, onDiagramGenerated]);

  const exampleTexts = [
    "Start -> Process -> Decision -> End",
    "Login -> Validate -> Success\nLogin -> Validate -> Error",
    "início: Registration, fim: Welcome Email",
    "User Input\nValidation\nDatabase Save\nConfirmation"
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5" />
          Natural Language Parser
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Enter your diagram description...&#10;Examples:&#10;• Start -> Process -> End&#10;• A conecta com B&#10;• início: Login, fim: Dashboard"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px] text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Quick Examples:</div>
          <div className="grid gap-1">
            {exampleTexts.map((example, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setInput(example)}
                className="text-xs h-auto py-1 px-2 justify-start text-left whitespace-pre-wrap"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={isProcessing || !input.trim()}
          className="w-full"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isProcessing ? 'Generating...' : 'Generate Diagram'}
        </Button>
      </CardContent>
    </Card>
  );
}