import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shapes,
  LayoutTemplate,
  Database,
  Workflow,
  GitBranch,
  Users,
  Calendar,
  FileText,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const [activeSection, setActiveSection] = useState('shapes');

  const sections = [
    {
      id: 'shapes',
      title: 'Shapes',
      icon: Shapes,
      items: [
        { name: 'Rectangle', preview: '▭' },
        { name: 'Circle', preview: '●' },
        { name: 'Diamond', preview: '◆' },
        { name: 'Triangle', preview: '▲' },
        { name: 'Hexagon', preview: '⬢' },
        { name: 'Pentagon', preview: '⬟' },
      ]
    },
    {
      id: 'flowchart',
      title: 'Flowchart',
      icon: Workflow,
      items: [
        { name: 'Process', preview: '▭' },
        { name: 'Decision', preview: '◆' },
        { name: 'Start/End', preview: '●' },
        { name: 'Document', preview: '📄' },
        { name: 'Database', preview: '🗃️' },
        { name: 'Cloud', preview: '☁️' },
      ]
    },
    {
      id: 'templates',
      title: 'Templates',
      icon: LayoutTemplate,
      items: [
        { name: 'Org Chart', preview: '👥' },
        { name: 'Process Flow', preview: '🔄' },
        { name: 'Mind Map', preview: '🧠' },
        { name: 'Network Diagram', preview: '🌐' },
        { name: 'Timeline', preview: '📅' },
        { name: 'Hierarchy', preview: '🏗️' },
      ]
    }
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col shadow-card">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-semibold text-sidebar-foreground text-lg">Elements</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <div key={section.id} className="mb-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-between px-3 py-2 h-auto ${
                    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                  }`}
                  onClick={() => setActiveSection(isActive ? '' : section.id)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${
                      isActive ? 'rotate-180' : ''
                    }`} 
                  />
                </Button>
                
                {isActive && (
                  <div className="mt-1 space-y-1 pl-2">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors group"
                        draggable
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-light rounded flex items-center justify-center text-sm">
                          {item.preview}
                        </div>
                        <span className="text-sm text-sidebar-foreground group-hover:text-sidebar-accent-foreground">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}