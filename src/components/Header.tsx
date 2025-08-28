import { Button } from '@/components/ui/button';
import { SettingsModal } from '@/components/SettingsModal';
import { 
  Save, 
  Download, 
  Share2, 
  Undo, 
  Redo,
  Settings,
  Menu,
  FileText,
  PanelLeftClose,
  PanelLeft,
  Maximize,
  Minimize
} from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function Header({ 
  sidebarCollapsed, 
  onToggleSidebar, 
  onUndo, 
  onRedo, 
  canUndo = false, 
  canRedo = false,
  isFullscreen = false,
  onToggleFullscreen
}: HeaderProps) {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shadow-card">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="h-9 w-9 p-0"
          title="Toggle Sidebar"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground hidden sm:block">DiagramFlow</h1>
        </div>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </Button>
          {onToggleFullscreen && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen (F11)" : "Fullscreen (F11)"}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          )}
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
        <SettingsModal />
      </div>
    </header>
  );
}