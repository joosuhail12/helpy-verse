
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ColorPicker from './ColorPicker';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

/**
 * Props for the appearance tab
 */
export interface AppearanceTabProps {
  primaryColor: string;
  position: 'right' | 'left';
  compact: boolean;
  onColorChange: (color: string) => void;
  onPositionChange: (position: 'right' | 'left') => void;
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
      <ColorPicker
        color={primaryColor}
        onChange={onColorChange}
      />
      
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
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="compact-mode">Compact Mode</Label>
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
