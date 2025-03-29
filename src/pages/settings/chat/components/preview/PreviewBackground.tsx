
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaintBucket, Image as ImageIcon, Palette } from 'lucide-react';

interface PreviewBackgroundProps {
  background: string;
  setBackground: (color: string) => void;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
}

const backgroundImages = [
  { id: 'none', url: null, name: 'None' },
  { id: 'office', url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b', name: 'Office' },
  { id: 'laptop', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158', name: 'Laptop' },
  { id: 'tech', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', name: 'Tech' },
  { id: 'code', url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7', name: 'Code' },
  { id: 'gradient1', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', name: 'Gradient' },
  { id: 'minimal', url: 'https://images.unsplash.com/photo-1518655048521-f130df041f66', name: 'Minimal' }
];

const colorPresets = [
  '#ffffff', // White
  '#f3f4f6', // Light gray
  '#e5deff', // Light purple
  '#f1f0fb', // Very light purple
  '#111827', // Dark gray
  '#fef7cd', // Soft yellow
  '#ffdee2', // Soft pink
  '#d3e4fd', // Soft blue
  '#f2fce2'  // Soft green
];

const PreviewBackground: React.FC<PreviewBackgroundProps> = ({
  background,
  setBackground,
  backgroundImage,
  setBackgroundImage
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 shadow-sm hover:shadow">
          {backgroundImage ? (
            <ImageIcon size={14} className="text-purple-500" />
          ) : (
            <Palette size={14} className="text-purple-500" />
          )}
          <span>Background</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <Tabs defaultValue="color" className="w-full">
          <TabsList className="grid grid-cols-2 mb-3 w-full">
            <TabsTrigger value="color" className="text-sm">Color</TabsTrigger>
            <TabsTrigger value="image" className="text-sm">Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="color" className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="bg-color" className="text-xs font-medium">Background Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="bg-color" 
                  type="color" 
                  value={background} 
                  onChange={(e) => setBackground(e.target.value)} 
                  className="w-10 h-10 p-1 cursor-pointer rounded-md" 
                />
                <Input
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="pt-1">
              <Label className="text-xs font-medium mb-2 block">Quick Colors</Label>
              <div className="grid grid-cols-5 gap-1.5">
                {colorPresets.map(color => (
                  <div 
                    key={color} 
                    className={`w-full aspect-square rounded-md border cursor-pointer hover:scale-105 transition-transform ${background === color ? 'ring-2 ring-primary' : 'border-gray-200'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBackground(color)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-2">
            <Label className="text-xs font-medium">Select Background Image</Label>
            <ScrollArea className="h-52 w-full rounded-md border">
              <div className="grid grid-cols-2 gap-2 p-2">
                {backgroundImages.map(img => (
                  <div 
                    key={img.id}
                    className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 hover:opacity-90 transition-opacity ${backgroundImage === img.url ? 'border-primary ring-1 ring-primary' : 'border-transparent'}`}
                    onClick={() => setBackgroundImage(img.url)}
                  >
                    {img.url ? (
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-sm">None</div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default PreviewBackground;
