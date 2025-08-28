import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Input } from '@/components/ui/input';

export const CustomNode = memo(({ data, id }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(String(data.label || 'Node'));

  useEffect(() => {
    setLabel(String(data.label || 'Node'));
  }, [data.label]);

  // Check if this node is being edited globally
  useEffect(() => {
    const handleGlobalEditMode = (event: CustomEvent) => {
      setIsEditing(event.detail === id);
    };
    
    window.addEventListener('editNode', handleGlobalEditMode as EventListener);
    return () => window.removeEventListener('editNode', handleGlobalEditMode as EventListener);
  }, [id]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Trigger update to parent
    const event = new CustomEvent('updateNodeLabel', {
      detail: { nodeId: id, newLabel: label }
    });
    window.dispatchEvent(event);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setLabel(String(data.label || 'Node'));
      setIsEditing(false);
    }
  };

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
        <div className="relative" onDoubleClick={handleDoubleClick}>
          <div className="w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-primary" />
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            {isEditing ? (
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyPress}
                className="text-xs text-center w-20 h-6 p-1"
                autoFocus
              />
            ) : (
              <span className="text-xs text-primary-foreground cursor-pointer">{String(label)}</span>
            )}
          </div>
        </div>
      );
    }
    
    if (nodeData.shape === 'hexagon') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center" onDoubleClick={handleDoubleClick}>
          <div 
            className="w-16 h-16 bg-primary" 
            style={{
              clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)'
            }} 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {isEditing ? (
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyPress}
                className="text-xs text-center w-16 h-6 p-1"
                autoFocus
              />
            ) : (
              <span className="text-xs text-primary-foreground font-medium cursor-pointer">{String(label)}</span>
            )}
          </div>
        </div>
      );
    }
    
    if (nodeData.shape === 'diamond') {
      return (
        <div className="relative w-20 h-20 flex items-center justify-center" onDoubleClick={handleDoubleClick}>
          <div 
            className="w-20 h-20 bg-primary border-2 border-border" 
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }} 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {isEditing ? (
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyPress}
                className="text-xs text-center w-16 h-6 p-1"
                autoFocus
              />
            ) : (
              <span className="text-xs text-primary-foreground font-medium cursor-pointer">{String(label)}</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div onDoubleClick={handleDoubleClick} className="cursor-pointer">
        {isEditing ? (
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className="text-sm text-center min-w-[100px] h-8 p-2"
            autoFocus
          />
        ) : (
          <span>{String(label)}</span>
        )}
      </div>
    );
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