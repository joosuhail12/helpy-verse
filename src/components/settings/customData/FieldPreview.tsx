
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CustomField } from "@/types/customField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { validateFieldValue } from './utils/fieldValidation';
import { getSuggestions } from './utils/fieldSuggestions';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  field: CustomField;
}

const FieldPreview: React.FC<FieldPreviewProps> = ({ isOpen, onClose, field }) => {
  const [value, setValue] = useState<any>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validate = (newValue: any) => {
    setIsValidating(true);
    setTimeout(() => {
      const validationErrors = validateFieldValue(newValue, field);
      setErrors(validationErrors);
      setIsValidating(false);

      if (validationErrors.length === 0 && newValue) {
        toast({
          title: "Field is valid",
          description: "All validation rules passed successfully.",
          duration: 2000,
        });
      }
    }, 300);
  };

  const handleChange = (newValue: any) => {
    setValue(newValue);
    setSuggestions(getSuggestions(field.type, newValue));
    validate(newValue);
  };

  const renderPreviewInput = () => {
    const commonProps = {
      value,
      onChange: (e: any) => handleChange(e.target.value),
      className: cn(
        errors.length > 0 ? "border-red-500" : "border-gray-200",
        isValidating ? "opacity-50" : ""
      ),
    };

    switch (field.type) {
      case 'text':
        return <Input {...commonProps} placeholder="Enter text..." />;
      case 'rich-text':
        return <Textarea {...commonProps} placeholder="Enter rich text..." />;
      case 'number':
        return <Input type="number" {...commonProps} placeholder="Enter number..." />;
      case 'date':
        return <Input type="date" {...commonProps} />;
      case 'boolean':
        return <Switch checked={Boolean(value)} onCheckedChange={handleChange} />;
      case 'select':
        return (
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'multi-select':
        return (
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select options" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'currency':
        return <Input type="number" step="0.01" {...commonProps} placeholder="Enter amount..." />;
      case 'url':
        return <Input type="url" {...commonProps} placeholder="Enter URL..." />;
      case 'email':
        return <Input type="email" {...commonProps} placeholder="Enter email..." />;
      case 'phone':
        return <Input type="tel" {...commonProps} placeholder="Enter phone number..." />;
      default:
        return <Input {...commonProps} placeholder="Enter value..." />;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setErrors([]);
      setSuggestions([]);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Field Preview: {field.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="preview" className="flex items-center gap-2">
              {field.name}
              {errors.length === 0 && value && !isValidating && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            {renderPreviewInput()}
            {suggestions.length > 0 && (
              <div className="mt-2">
                <Label className="text-sm text-gray-500">Suggestions:</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="px-2 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                      onClick={() => handleChange(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {errors.length > 0 && (
              <div className="mt-2 space-y-1">
                {errors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FieldPreview;
