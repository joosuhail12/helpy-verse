
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ValidationRule } from "@/types/customData";
import { Plus, X } from "lucide-react";

interface ValidationRulesSectionProps {
  rules: ValidationRule[];
  onRulesChange: (rules: ValidationRule[]) => void;
}

const ValidationRulesSection = ({
  rules,
  onRulesChange,
}: ValidationRulesSectionProps) => {
  const addRule = () => {
    onRulesChange([
      ...rules,
      { type: "required", value: "", message: "" },
    ]);
  };

  const removeRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    onRulesChange(newRules);
  };

  const updateRule = (index: number, field: keyof ValidationRule, value: string) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    onRulesChange(newRules);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Validation Rules</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRule}>
          <Plus className="w-4 h-4 mr-1" />
          Add Rule
        </Button>
      </div>
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Select
              value={rule.type}
              onValueChange={(value) =>
                updateRule(index, "type", value as ValidationRule["type"])
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="required">Required</SelectItem>
                <SelectItem value="minLength">Min Length</SelectItem>
                <SelectItem value="maxLength">Max Length</SelectItem>
                <SelectItem value="regex">Regex Pattern</SelectItem>
                <SelectItem value="min">Min Value</SelectItem>
                <SelectItem value="max">Max Value</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Value"
              value={rule.value.toString()}
              onChange={(e) => updateRule(index, "value", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Error message"
              value={rule.message}
              onChange={(e) => updateRule(index, "message", e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRule(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationRulesSection;
