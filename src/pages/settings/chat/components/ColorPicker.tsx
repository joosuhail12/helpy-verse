
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  id?: string;
  label?: string;
}

/**
 * A component for picking colors with text input and color picker
 */
const ColorPicker = ({ color, onChange, id = 'primary-color', label = 'Primary Color' }: ColorPickerProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex space-x-2 items-center">
        <Input 
          id={id} 
          type="text" 
          value={color} 
          onChange={(e) => onChange(e.target.value)} 
        />
        <div 
          className="w-8 h-8 rounded-md border border-gray-300"
          style={{ backgroundColor: color }}
        />
        <Input 
          type="color" 
          value={color} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-12 h-8 p-0 border-0"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
