
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Palette, X, Image } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PreviewBackgroundProps {
  background: string;
  setBackground: (color: string) => void;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
}

const PreviewBackground: React.FC<PreviewBackgroundProps> = ({ 
  background, 
  setBackground,
  backgroundImage,
  setBackgroundImage
}) => {
  const [imageUrl, setImageUrl] = React.useState('');
  
  const presetColors = [
    '#ffffff', '#f8f9fa', '#e9ecef', '#f5f3ff', '#f0fdf4', 
    '#eff6ff', '#f0fdfa', '#f5f5f4', '#fafaf9', '#f8fafc'
  ];
  
  const presetBackgrounds = [
    '/placeholder.svg',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  ];
  
  const handleImageUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl) {
      setBackgroundImage(imageUrl);
    }
  };
  
  const handleClearBackground = () => {
    setBackgroundImage(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 shadow-sm hover:shadow">
          <Palette size={14} className="text-purple-500" />
          <span>Background</span>
          {backgroundImage && <X size={14} className="ml-1 text-gray-400" onClick={(e) => { e.stopPropagation(); handleClearBackground(); }} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <Tabs defaultValue="color">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="color" className="text-xs">Color</TabsTrigger>
            <TabsTrigger value="image" className="text-xs">Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="color" className="space-y-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="color-picker" className="text-xs font-medium flex items-center justify-between">
                Select background color
                <div 
                  className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0" 
                  style={{ backgroundColor: background }}
                />
              </Label>
              
              <div className="flex items-center gap-2">
                <Input 
                  id="color-picker"
                  type="color" 
                  value={background} 
                  onChange={(e) => setBackground(e.target.value)} 
                  className="w-12 h-8 p-1 cursor-pointer"
                />
                <Input
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="flex-1 h-8 text-sm"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2 mt-2">
                {presetColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-full aspect-square rounded-md transition-transform hover:scale-110 ${
                      background === color ? 'ring-2 ring-purple-500 ring-offset-1' : 'border border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBackground(color)}
                    aria-label={`Set background color to ${color}`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="space-y-4">
            <form onSubmit={handleImageUrlSubmit} className="flex flex-col gap-3">
              <Label htmlFor="image-url" className="text-xs font-medium">
                Enter image URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  Set
                </Button>
              </div>
            </form>
            
            <div className="mt-2">
              <Label className="text-xs font-medium block mb-2">
                Preset backgrounds
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {presetBackgrounds.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-full aspect-video rounded-md overflow-hidden transition-transform hover:scale-105 ${
                      backgroundImage === url ? 'ring-2 ring-purple-500 ring-offset-1' : 'border border-gray-200'
                    }`}
                    onClick={() => setBackgroundImage(url)}
                  >
                    <img 
                      src={url} 
                      alt={`Background ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {backgroundImage && (
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearBackground}
                  className="text-xs"
                >
                  Clear Background Image
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default PreviewBackground;
