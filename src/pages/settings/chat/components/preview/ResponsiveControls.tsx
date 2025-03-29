
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Tablet, Monitor, Maximize2 } from 'lucide-react'; // Changed ArrowsMaximize to Maximize2
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DeviceType = 'iphone' | 'android' | 'tablet' | 'desktop';
type Orientation = 'portrait' | 'landscape';

interface ResponsiveControlsProps {
  deviceType: DeviceType;
  setDeviceType: (device: DeviceType) => void;
  orientation: Orientation;
  setOrientation: (orientation: Orientation) => void;
  showFullScreen?: boolean;
  onFullScreenToggle?: () => void;
}

const ResponsiveControls: React.FC<ResponsiveControlsProps> = ({
  deviceType,
  setDeviceType,
  orientation,
  setOrientation,
  showFullScreen = false,
  onFullScreenToggle
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <div>
            <ToggleGroup type="single" value={deviceType} onValueChange={(value) => value && setDeviceType(value as DeviceType)}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="iphone" aria-label="iPhone" className="data-[state=on]:bg-primary data-[state=on]:text-white">
                    <Smartphone className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>iPhone</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="android" aria-label="Android" className="data-[state=on]:bg-primary data-[state=on]:text-white">
                    <Smartphone className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Android</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="tablet" aria-label="Tablet" className="data-[state=on]:bg-primary data-[state=on]:text-white">
                    <Tablet className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Tablet</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="desktop" aria-label="Desktop" className="data-[state=on]:bg-primary data-[state=on]:text-white">
                    <Monitor className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>Desktop</TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </div>
        </TooltipProvider>
        
        {(deviceType === 'iphone' || deviceType === 'android' || deviceType === 'tablet') && (
          <Select value={orientation} onValueChange={(value) => setOrientation(value as Orientation)}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      
      {showFullScreen && onFullScreenToggle && (
        <Button variant="outline" size="sm" onClick={onFullScreenToggle}>
          <Maximize2 className="h-4 w-4 mr-2" /> {/* Changed ArrowsMaximize to Maximize2 */}
          Full Screen
        </Button>
      )}
    </div>
  );
};

export default ResponsiveControls;
