import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Trash2, 
  RotateCw, 
  Edit3,
  ZoomIn,
  ZoomOut,
  Move3D,
  Download,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsProps {
  selectedNodes?: string[];
  onDeleteNodes?: (nodeIds: string[]) => void;
  onCopyNodes?: (nodeIds: string[]) => void;
  onExport?: () => void;
  onToggleNLParser?: () => void;
}

export function QuickActions({ selectedNodes = [], onDeleteNodes, onCopyNodes, onExport, onToggleNLParser }: QuickActionsProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    if (selectedNodes.length > 0 && onDeleteNodes) {
      onDeleteNodes(selectedNodes);
      toast({
        title: "Nodes deleted",
        description: `${selectedNodes.length} node(s) removed from canvas`,
      });
    }
  };

  const handleCopy = () => {
    if (selectedNodes.length > 0 && onCopyNodes) {
      onCopyNodes(selectedNodes);
      toast({
        title: "Nodes copied",
        description: `${selectedNodes.length} node(s) copied to clipboard`,
      });
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
      toast({
        title: "Diagram exported",
        description: "Your diagram has been exported successfully",
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-card p-2 flex gap-1 z-10">
      {onToggleNLParser && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onToggleNLParser}
          title="Natural Language Parser"
        >
          <FileText className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => window.location.reload()}
        title="Reset Canvas"
      >
        <RotateCw className="h-4 w-4" />
      </Button>
      
      {selectedNodes.length > 0 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleCopy}
            title="Copy Selected"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            onClick={handleDelete}
            title="Delete Selected"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleExport}
        title="Export Diagram"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}