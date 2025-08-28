import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';

export interface CustomEdgeData {
  label?: string;
  edgeType?: 'free' | 'step' | 'straight' | 'dashed';
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
  const { label, edgeType = 'step', color = 'hsl(var(--primary))', strokeWidth = 2 } = data;

  // Calculate path based on edge type
  let edgePath, labelX, labelY;
  
  if (edgeType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  } else if (edgeType === 'step') {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 0,
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
        markerEnd={markerEnd || MarkerType.ArrowClosed}
        style={edgeStyle}
        onContextMenu={handleContextMenu}
      />

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