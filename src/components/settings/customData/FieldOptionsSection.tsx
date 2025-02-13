
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface FieldOptionsSectionProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
}

const FieldOptionsSection = ({ options, onOptionsChange }: FieldOptionsSectionProps) => {
  const addOption = () => {
    onOptionsChange([...options, '']);
  };

  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    onOptionsChange(newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    onOptionsChange(newOptions);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Field Options</Label>
        <Button type="button" variant="outline" size="sm" onClick={addOption}>
          <Plus className="w-4 h-4 mr-1" />
          Add Option
        </Button>
      </div>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeOption(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldOptionsSection;
