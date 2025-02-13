
import React from 'react';
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

interface FieldPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  field: CustomField;
}

const FieldPreview: React.FC<FieldPreviewProps> = ({ isOpen, onClose, field }) => {
  const renderPreviewInput = () => {
    switch (field.type) {
      case 'text':
        return <Input placeholder="Enter text..." />;
      case 'rich-text':
        return <Textarea placeholder="Enter rich text..." />;
      case 'number':
        return <Input type="number" placeholder="Enter number..." />;
      case 'date':
        return <Input type="date" />;
      case 'boolean':
        return <Switch />;
      case 'select':
        return (
          <Select>
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
          <Select>
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
        return <Input type="number" step="0.01" placeholder="Enter amount..." />;
      case 'url':
        return <Input type="url" placeholder="Enter URL..." />;
      case 'email':
        return <Input type="email" placeholder="Enter email..." />;
      case 'phone':
        return <Input type="tel" placeholder="Enter phone number..." />;
      default:
        return <Input placeholder="Enter value..." />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Field Preview: {field.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="preview">{field.name}</Label>
            {field.description && (
              <p className="text-sm text-gray-500">{field.description}</p>
            )}
            {renderPreviewInput()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FieldPreview;
