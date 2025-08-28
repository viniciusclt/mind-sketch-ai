import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const CustomNode = memo(({ data, id }: NodeProps) => {

  const nodeData = data as {
    label: string;
    nodeType: string;
    shape: string;
    preview: string;
  };

  const getNodeStyle = () => {
    const baseStyle = "min-w-[120px] min-h-[60px] px-4 py-2 border-2 bg-card text-card-foreground shadow-card flex items-center justify-center text-sm font-medium relative";
    
    switch (nodeData.shape) {
      case 'circle':
        return `${baseStyle} rounded-full w-20 h-20`;
      case 'diamond':
        return `${baseStyle} bg-transparent border-transparent w-20 h-20`;
      case 'triangle':
        return `${baseStyle} bg-transparent border-transparent`;
      case 'hexagon':
        return `${baseStyle} bg-transparent border-transparent`;
      case 'ellipse':
        return `${baseStyle} rounded-full w-28 h-16`;
      default:
        return `${baseStyle} rounded-lg border-border`;
    }
  };

  const renderShape = () => {
    if (nodeData.shape === 'triangle') {
      return (
        <div className="relative">
          <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-primary" />
          <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs text-primary-foreground">{nodeData.label}</span>
        </div>
      );
    }
    
    if (nodeData.shape === 'hexagon') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div 
            className="w-16 h-16 bg-primary" 
            style={{
              clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)'
            }} 
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs text-primary-foreground font-medium">
            {nodeData.label}
          </span>
        </div>
      );
    }
    
    if (nodeData.shape === 'diamond') {
      return (
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div 
            className="w-20 h-20 bg-primary border-2 border-border" 
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }} 
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs text-primary-foreground font-medium">
            {nodeData.label}
          </span>
        </div>
      );
    }

    return <span>{nodeData.label}</span>;
  };

  return (
    <div className={getNodeStyle()}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 !bg-primary border-2 border-primary-foreground"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-primary border-2 border-primary-foreground"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 !bg-primary border-2 border-primary-foreground"
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 !bg-primary border-2 border-primary-foreground"
      />
      
      {renderShape()}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';