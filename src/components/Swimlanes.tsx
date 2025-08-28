import React from 'react';
import { useReactFlow } from '@xyflow/react';

export interface Swimlane {
  id: string;
  label: string;
  orientation: 'horizontal' | 'vertical';
  position: number; // Y position for horizontal, X position for vertical
  size: number; // Height for horizontal, width for vertical
  color: string;
}

interface SwimlanesProps {
  swimlanes: Swimlane[];
  canvasWidth: number;
  canvasHeight: number;
}

export function Swimlanes({ swimlanes, canvasWidth, canvasHeight }: SwimlanesProps) {
  const { getViewport } = useReactFlow();
  const { x, y, zoom } = getViewport();

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {swimlanes.map((lane) => {
        const style: React.CSSProperties = {
          position: 'absolute',
          backgroundColor: `${lane.color}15`, // 15% opacity
          border: `1px solid ${lane.color}40`, // 40% opacity
          pointerEvents: 'none',
        };

        if (lane.orientation === 'horizontal') {
          style.left = -x / zoom;
          style.top = (lane.position - y) / zoom;
          style.width = canvasWidth / zoom;
          style.height = lane.size / zoom;
        } else {
          style.left = (lane.position - x) / zoom;
          style.top = -y / zoom;
          style.width = lane.size / zoom;
          style.height = canvasHeight / zoom;
        }

        return (
          <div key={lane.id} style={style}>
            {/* Lane Label */}
            <div
              className={`absolute text-xs font-medium px-2 py-1 rounded ${
                lane.orientation === 'horizontal' 
                  ? 'top-2 left-2' 
                  : 'top-2 left-2 transform -rotate-90 origin-top-left'
              }`}
              style={{
                backgroundColor: lane.color,
                color: 'white',
                pointerEvents: 'auto',
              }}
            >
              {lane.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Hook for managing swimlanes
export function useSwimlanesManager() {
  const [swimlanes, setSwimlanes] = React.useState<Swimlane[]>([]);

  const addSwimlane = (swimlane: Omit<Swimlane, 'id'>) => {
    const newSwimlane: Swimlane = {
      ...swimlane,
      id: `swimlane-${Date.now()}`,
    };
    setSwimlanes(prev => [...prev, newSwimlane]);
  };

  const removeSwimlane = (id: string) => {
    setSwimlanes(prev => prev.filter(lane => lane.id !== id));
  };

  const updateSwimlane = (id: string, updates: Partial<Swimlane>) => {
    setSwimlanes(prev => 
      prev.map(lane => 
        lane.id === id ? { ...lane, ...updates } : lane
      )
    );
  };

  const getSwimlanesForNode = (nodeX: number, nodeY: number) => {
    return swimlanes.filter(lane => {
      if (lane.orientation === 'horizontal') {
        return nodeY >= lane.position && nodeY <= lane.position + lane.size;
      } else {
        return nodeX >= lane.position && nodeX <= lane.position + lane.size;
      }
    });
  };

  return {
    swimlanes,
    addSwimlane,
    removeSwimlane,
    updateSwimlane,
    getSwimlanesForNode,
  };
}