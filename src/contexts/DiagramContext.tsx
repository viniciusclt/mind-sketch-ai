import { createContext, useContext, ReactNode } from 'react';

interface DiagramContextType {
  addConnectedNode?: (parentNodeId: string, direction?: 'bottom' | 'right' | 'left' | 'top') => void;
}

const DiagramContext = createContext<DiagramContextType>({});

export const useDiagram = () => useContext(DiagramContext);

interface DiagramProviderProps {
  children: ReactNode;
  addConnectedNode?: (parentNodeId: string, direction?: 'bottom' | 'right' | 'left' | 'top') => void;
}

export const DiagramProvider = ({ children, addConnectedNode }: DiagramProviderProps) => {
  return (
    <DiagramContext.Provider value={{ addConnectedNode }}>
      {children}
    </DiagramContext.Provider>
  );
};