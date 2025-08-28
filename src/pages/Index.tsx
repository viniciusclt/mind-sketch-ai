import { useState } from 'react';
import { Header } from '@/components/Header';
import { Toolbar } from '@/components/Toolbar';
import { Sidebar } from '@/components/Sidebar';
import { DiagramCanvas } from '@/components/DiagramCanvas';

const Index = () => {
  const [activeTool, setActiveTool] = useState('select');

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <Toolbar activeTool={activeTool} onToolChange={setActiveTool} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <DiagramCanvas />
      </div>
    </div>
  );
};

export default Index;
