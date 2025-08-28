import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getStraightPath,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';

export interface CustomEdgeData {
  label?: string;
  edgeType?: 'arrow' | 'straight' | 'dashed';
  color?: string;
  strokeWidth?: number;
}

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  style?: React.CSSProperties;
  markerEnd?: string;
  data?: CustomEdgeData;
}

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data = {},
}: CustomEdgeProps) {
  const { setEdges } = useReactFlow();
  const { label, edgeType = 'arrow', color = 'hsl(var(--primary))', strokeWidth = 2 } = data;

  // Calculate path based on edge type
  let edgePath, labelX, labelY;
  
  if (edgeType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  } else {
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  // Determine style based on edge type
  const edgeStyle = {
    ...style,
    stroke: color,
    strokeWidth,
    strokeDasharray: edgeType === 'dashed' ? '8,4' : undefined,
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    // Edge context menu will be handled by parent
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd || `url(#arrow-${id})`}
        style={edgeStyle}
        onContextMenu={handleContextMenu}
      />
      
      {/* Custom arrow marker */}
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="12"
          markerHeight="12"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L9,3 z"
            fill={color}
            style={{ strokeWidth: 0 }}
          />
        </marker>
      </defs>

      {/* Edge label */}
      {label && (
        <EdgeLabelRenderer>
          <div
            className="edge-label nodrag nopan bg-background border border-border rounded px-2 py-1 text-xs font-medium shadow-sm"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}