import { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { Sidebar } from '@/components/Sidebar';
import { DiagramCanvas } from '@/components/DiagramCanvas';
import { useUndoableState } from '@/hooks/useUndoableState';
import { Node, Edge } from '@xyflow/react';

interface DiagramState {
  nodes: Node[];
  edges: Edge[];
}

const Index = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [templateToApply, setTemplateToApply] = useState<any>(null);
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    state: diagramState,
    set: setDiagramState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoableState<DiagramState>({
    nodes: [],
    edges: []
  });

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
    
    // Clear any existing auto-hide timeout when manually toggling
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
      autoHideTimeoutRef.current = null;
    }
  }, []);

  const handleSidebarActivity = useCallback(() => {
    // Clear existing timeout
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }
    
    // Only auto-hide if sidebar is open
    if (!sidebarCollapsed) {
      autoHideTimeoutRef.current = setTimeout(() => {
        setSidebarCollapsed(true);
      }, 3000); // Auto-hide after 3 seconds of inactivity
    }
  }, [sidebarCollapsed]);

  const handleDragStart = useCallback((item: any) => {
    setDraggedItem(item);
  }, []);

  const handleDrop = useCallback((position: { x: number; y: number }) => {
    if (draggedItem) {
      setDraggedItem(null);
    }
  }, [draggedItem]);

  const handleApplyTemplate = useCallback((template: any) => {
    setTemplateToApply(template);
  }, []);

  // Auto-hide sidebar setup
  useEffect(() => {
    // Start auto-hide timer when sidebar is opened
    if (!sidebarCollapsed) {
      handleSidebarActivity();
    }

    // Cleanup on unmount
    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [sidebarCollapsed, handleSidebarActivity]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header 
        sidebarCollapsed={sidebarCollapsed} 
        onToggleSidebar={handleToggleSidebar}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <Toolbar 
        activeTool={activeTool} 
        onToolChange={setActiveTool}
        onApplyTemplate={handleApplyTemplate}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <div 
          onMouseEnter={handleSidebarActivity}
          onMouseMove={handleSidebarActivity}
        >
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onDragStart={handleDragStart}
          />
        </div>
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black/20 z-5 md:hidden"
            onClick={handleToggleSidebar}
          />
        )}
        <DiagramCanvas 
          draggedItem={draggedItem}
          onDrop={handleDrop}
          sidebarCollapsed={sidebarCollapsed}
          templateToApply={templateToApply}
        />
      </div>
    </div>
  );
};

export default Index;
