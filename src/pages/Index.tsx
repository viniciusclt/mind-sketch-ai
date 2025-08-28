import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { Sidebar } from '@/components/Sidebar';
import { DiagramCanvas } from '@/components/DiagramCanvas';

const Index = () => {
  const [activeTool, setActiveTool] = useState('select');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const handleDragStart = useCallback((item: any) => {
    setDraggedItem(item);
  }, []);

  const handleDrop = useCallback((position: { x: number; y: number }) => {
    if (draggedItem) {
      // This will be handled by DiagramCanvas
      setDraggedItem(null);
    }
  }, [draggedItem]);

  const handleApplyTemplate = useCallback((template: any) => {
    // Apply template nodes and edges to the canvas
    console.log('Applying template:', template);
    // This would set the nodes and edges from the template
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header sidebarCollapsed={sidebarCollapsed} onToggleSidebar={handleToggleSidebar} />
      <Toolbar 
        activeTool={activeTool} 
        onToolChange={setActiveTool}
        onApplyTemplate={handleApplyTemplate}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onDragStart={handleDragStart}
        />
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
        />
      </div>
    </div>
  );
};

export default Index;
