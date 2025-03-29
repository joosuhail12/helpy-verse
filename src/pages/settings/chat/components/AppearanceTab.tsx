
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import ColorPicker from './ColorPicker';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface AppearanceTabProps {
  primaryColor: string;
  position: string;
  compact: boolean;
  onColorChange: (color: string) => void;
  onPositionChange: (position: string) => void;
  onCompactChange: (compact: boolean) => void;
}

/**
 * Tab component for appearance settings
 */
const AppearanceTab = ({ 
  primaryColor, 
  position, 
  compact, 
  onColorChange, 
  onPositionChange, 
  onCompactChange 
}: AppearanceTabProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Primary Color</Label>
        <ColorPicker
          color={primaryColor}
          onChange={onColorChange}
        />
        <p className="text-sm text-gray-500 mt-1">
          This color is used for buttons, links, and other primary UI elements.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Widget Position</Label>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="position-right"
                name="position"
                checked={position === 'right'}
                onChange={() => onPositionChange('right')}
                className="form-radio"
              />
              <Label htmlFor="position-right">Right</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="position-left"
                name="position"
                checked={position === 'left'}
                onChange={() => onPositionChange('left')}
                className="form-radio"
              />
              <Label htmlFor="position-left">Left</Label>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Choose which side of the screen the chat widget will appear on.
          </p>
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <div>
            <Label htmlFor="compact-mode">Compact Mode</Label>
            <p className="text-sm text-gray-500">Makes the chat widget smaller and more compact</p>
          </div>
          <Switch
            id="compact-mode"
            checked={compact}
            onCheckedChange={onCompactChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AppearanceTab;
