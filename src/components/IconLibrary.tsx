import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  ScrollArea
} from '@/components/ui/scroll-area';
import { 
  Search,
  Star,
  Heart,
  Home,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Image,
  File,
  Folder,
  Download,
  Upload,
  Settings,
  Bell,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Edit,
  Trash,
  Plus,
  Minus,
  Check,
  X,
  ArrowUp as Arrow,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Square as Stop,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Bluetooth,
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  Watch,
  Headphones,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share,
  Copy,
  Clipboard,
  Link,
  ExternalLink,
  Bookmark,
  Tag,
  Filter,
  ArrowUpDown as Sort,
  Grid,
  List,
  Menu,
  MoreHorizontal,
  MoreVertical,
  RefreshCw as Refresh,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Square,
  Circle,
  Triangle,
  Diamond,
  Hexagon,
  Octagon
} from 'lucide-react';

const iconCategories = {
  'Geral': [
    { name: 'Star', icon: Star },
    { name: 'Heart', icon: Heart },
    { name: 'Home', icon: Home },
    { name: 'User', icon: User },
    { name: 'Settings', icon: Settings },
    { name: 'Search', icon: Search },
  ],
  'Comunicação': [
    { name: 'Mail', icon: Mail },
    { name: 'Phone', icon: Phone },
    { name: 'Bell', icon: Bell },
    { name: 'Share', icon: Share },
    { name: 'Link', icon: Link },
    { name: 'ExternalLink', icon: ExternalLink },
  ],
  'Arquivos': [
    { name: 'File', icon: File },
    { name: 'Folder', icon: Folder },
    { name: 'Download', icon: Download },
    { name: 'Upload', icon: Upload },
    { name: 'Copy', icon: Copy },
    { name: 'Clipboard', icon: Clipboard },
  ],
  'Mídia': [
    { name: 'Camera', icon: Camera },
    { name: 'Image', icon: Image },
    { name: 'Play', icon: Play },
    { name: 'Pause', icon: Pause },
    { name: 'Stop', icon: Stop },
    { name: 'Volume2', icon: Volume2 },
    { name: 'Video', icon: Video },
    { name: 'Mic', icon: Mic },
  ],
  'Setas': [
    { name: 'ArrowUp', icon: ArrowUp },
    { name: 'ArrowDown', icon: ArrowDown },
    { name: 'ArrowLeft', icon: ArrowLeft },
    { name: 'ArrowRight', icon: ArrowRight },
    { name: 'ChevronUp', icon: ChevronUp },
    { name: 'ChevronDown', icon: ChevronDown },
    { name: 'ChevronLeft', icon: ChevronLeft },
    { name: 'ChevronRight', icon: ChevronRight },
  ],
  'Ações': [
    { name: 'Plus', icon: Plus },
    { name: 'Minus', icon: Minus },
    { name: 'Check', icon: Check },
    { name: 'X', icon: X },
    { name: 'Edit', icon: Edit },
    { name: 'Trash', icon: Trash },
    { name: 'Refresh', icon: Refresh },
    { name: 'ZoomIn', icon: ZoomIn },
    { name: 'ZoomOut', icon: ZoomOut },
  ],
  'Formas': [
    { name: 'Square', icon: Square },
    { name: 'Circle', icon: Circle },
    { name: 'Triangle', icon: Triangle },
    { name: 'Diamond', icon: Diamond },
    { name: 'Hexagon', icon: Hexagon },
    { name: 'Octagon', icon: Octagon },
  ],
  'Dispositivos': [
    { name: 'Smartphone', icon: Smartphone },
    { name: 'Laptop', icon: Laptop },
    { name: 'Monitor', icon: Monitor },
    { name: 'Tablet', icon: Tablet },
    { name: 'Watch', icon: Watch },
    { name: 'Headphones', icon: Headphones },
  ],
};

interface IconLibraryProps {
  onSelectIcon: (iconName: string, IconComponent: React.ComponentType) => void;
  onClose: () => void;
}

export function IconLibrary({ onSelectIcon, onClose }: IconLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Geral');

  const filteredIcons = Object.entries(iconCategories).reduce((acc, [category, icons]) => {
    if (selectedCategory && category !== selectedCategory) return acc;
    
    const filtered = icons.filter(icon =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    
    return acc;
  }, {} as Record<string, typeof iconCategories[keyof typeof iconCategories]>);

  return (
    <Card className="fixed inset-4 z-50 shadow-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Biblioteca de Ícones
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ícones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Categories Sidebar */}
        <div className="w-48 space-y-1">
          <h3 className="text-sm font-medium mb-2">Categorias</h3>
          {Object.keys(iconCategories).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Icons Grid */}
        <div className="flex-1">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {Object.entries(filteredIcons).map(([category, icons]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium mb-3">{category}</h3>
                  <div className="grid grid-cols-8 gap-2">
                    {icons.map(({ name, icon: IconComponent }) => (
                      <Button
                        key={name}
                        variant="outline"
                        size="sm"
                        className="h-16 w-16 flex-col gap-1 hover:bg-primary/10"
                        onClick={() => onSelectIcon(name, IconComponent)}
                      >
                        <IconComponent className="h-6 w-6" />
                        <span className="text-xs truncate w-full">{name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}