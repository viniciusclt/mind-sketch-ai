import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('diagramflow-api-key') || '');
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    localStorage.setItem('diagramflow-api-key', apiKey);
    toast({
      title: "API Key salva",
      description: "Sua chave API foi salva com sucesso.",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Configurações">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Chave API
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Digite sua chave API"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Esta chave será usada para recursos de IA e integrações futuras.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveApiKey}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}