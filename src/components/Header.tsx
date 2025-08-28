import { Button } from '@/components/ui/button';
import { 
  Save, 
  Download, 
  Share2, 
  Undo, 
  Redo,
  Settings,
  Menu,
  FileText
} from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">DiagramFlow</h1>
        </div>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 text-center">
        <span className="text-sm text-muted-foreground">
          Untitled Diagram
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="primary" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}