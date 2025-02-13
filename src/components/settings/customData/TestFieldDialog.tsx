
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CustomField, ValidationRule } from "@/types/customField";
import { toast } from "@/hooks/use-toast";

interface TestFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  field: CustomField;
}

const TestFieldDialog = ({ isOpen, onClose, field }: TestFieldDialogProps) => {
  const [testValue, setTestValue] = useState("");
  
  const validateField = () => {
    const errors: string[] = [];
    
    // Check required field
    if (field.required && !testValue) {
      errors.push("This field is required");
    }
    
    // Apply validation rules
    field.validationRules?.forEach((rule: ValidationRule) => {
      switch (rule.type) {
        case 'regex':
          const regex = new RegExp(rule.value as string);
          if (!regex.test(testValue)) {
            errors.push(rule.message);
          }
          break;
        case 'minLength':
          if (testValue.length < Number(rule.value)) {
            errors.push(rule.message);
          }
          break;
        case 'maxLength':
          if (testValue.length > Number(rule.value)) {
            errors.push(rule.message);
          }
          break;
        case 'min':
          if (Number(testValue) < Number(rule.value)) {
            errors.push(rule.message);
          }
          break;
        case 'max':
          if (Number(testValue) > Number(rule.value)) {
            errors.push(rule.message);
          }
          break;
      }
    });
    
    if (errors.length > 0) {
      toast({
        title: "Validation Failed",
        description: (
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Validation Passed",
        description: "The field value is valid.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Field: {field.name}</DialogTitle>
          <DialogDescription>
            Enter a value to test the field's validation rules.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="test-value"
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              placeholder="Enter test value..."
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={validateField}>
            Test Validation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestFieldDialog;
