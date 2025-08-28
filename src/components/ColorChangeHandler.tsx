import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';

interface ColorChangeHandlerProps {
  nodes: Node[];
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
}

export const useColorChangeHandler = ({ nodes, setNodes }: ColorChangeHandlerProps) => {
  return useCallback((nodeIds: string[], colorType: 'border' | 'background' | 'text', color: string, hsl: string) => {
    setNodes((nds) => 
      nds.map(node => {
        if (!nodeIds.includes(node.id)) return node;
        
        const updatedData = { ...node.data };
        
        switch (colorType) {
          case 'border':
            updatedData.borderColor = color;
            updatedData.borderColorHsl = hsl;
            break;
          case 'background':
            updatedData.backgroundColor = color;
            updatedData.backgroundColorHsl = hsl;
            break;
          case 'text':
            updatedData.textColor = color;
            updatedData.textColorHsl = hsl;
            break;
        }
        
        return {
          ...node,
          data: updatedData
        };
      })
    );
    
    toast({
      title: "Cores Alteradas",
      description: `Cor do ${colorType === 'border' ? 'borda' : colorType === 'background' ? 'fundo' : 'texto'} alterada`,
    });
  }, [setNodes]);
};