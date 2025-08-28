import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';

const colors = [
  { name: 'Azul', value: '#3b82f6', hsl: '214 88% 52%' },
  { name: 'Verde', value: '#10b981', hsl: '158 64% 52%' },
  { name: 'Vermelho', value: '#ef4444', hsl: '0 84% 60%' },
  { name: 'Amarelo', value: '#f59e0b', hsl: '38 92% 50%' },
  { name: 'Roxo', value: '#8b5cf6', hsl: '258 90% 66%' },
  { name: 'Rosa', value: '#ec4899', hsl: '330 81% 60%' },
  { name: 'Laranja', value: '#f97316', hsl: '24 95% 53%' },
  { name: 'Ciano', value: '#06b6d4', hsl: '188 96% 53%' },
  { name: 'Cinza', value: '#6b7280', hsl: '220 14% 46%' },
  { name: 'Preto', value: '#1f2937', hsl: '218 28% 15%' }
];

interface ColorPickerProps {
  currentColor?: string;
  onColorChange: (color: string, hsl: string) => void;
  trigger?: React.ReactNode;
}

export function ColorPicker({ currentColor, onColorChange, trigger }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Cor</span>
            {currentColor && (
              <div 
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: currentColor }}
              />
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Selecionar Cor</h4>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                className={`
                  w-10 h-10 rounded-lg border-2 transition-all hover:scale-110
                  ${currentColor === color.value ? 'border-primary ring-2 ring-primary/20' : 'border-border'}
                `}
                style={{ backgroundColor: color.value }}
                onClick={() => {
                  onColorChange(color.value, color.hsl);
                  setOpen(false);
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}