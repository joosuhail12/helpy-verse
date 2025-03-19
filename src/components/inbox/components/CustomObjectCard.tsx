
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Database, ChevronUp, ChevronDown, Pencil, Check, X, Loader2 } from "lucide-react";
import { mockCustomObjects } from '@/mock/customObjects';
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';

interface CustomObjectCardProps {
  customerId: string;
  ticketId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const CustomObjectCard = ({ customerId, ticketId, isOpen, onToggle }: CustomObjectCardProps) => {
  const { toast } = useToast();
  // Filter custom objects that are connected with tickets or customers
  const relevantObjects = mockCustomObjects.filter(
    obj => (obj.connectionType === 'ticket' || obj.connectionType === 'customer') && 
           obj.showInCustomerContext
  );

  const isLoading = false;

  // State to track which field is being edited
  const [editingField, setEditingField] = useState<string | null>(null);
  // State to store temporary field values during editing
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  // Loading state for save operation
  const [isSaving, setIsSaving] = useState(false);

  if (relevantObjects.length === 0) {
    return null;
  }

  const handleEditField = (objectId: string, fieldId: string, currentValue: string) => {
    const key = `${objectId}_${fieldId}`;
    setFieldValues({ 
      ...fieldValues, 
      [key]: currentValue 
    });
    setEditingField(key);
  };

  const handleSaveField = async (objectId: string, fieldId: string) => {
    const key = `${objectId}_${fieldId}`;
    setIsSaving(true);
    
    try {
      // Simulate API call to update the field
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success toast
      toast({
        title: "Field updated",
        description: "The field has been successfully updated.",
      });
      
      // In a real application, you would update the Redux store or API here
      
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating the field.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setEditingField(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues({
      ...fieldValues,
      [key]: value
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="font-medium">Custom Data</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          ) : (
            <div className="space-y-4">
              {relevantObjects.map((object) => (
                <div key={object.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                  <h4 className="font-medium text-sm mb-2">{object.name}</h4>
                  <div className="grid gap-2">
                    {object.fields.map((field) => {
                      const fieldKey = `${object.id}_${field.id}`;
                      const isEditing = editingField === fieldKey;
                      
                      return (
                        <div key={field.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{field.name}</span>
                          
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <Input
                                value={fieldValues[fieldKey] || ""}
                                onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                                className="h-7 w-36 text-sm"
                                disabled={isSaving}
                                autoFocus
                              />
                              <div className="flex items-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSaveField(object.id, field.id)}
                                  disabled={isSaving}
                                  className="h-7 w-7 p-0"
                                >
                                  {isSaving ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Check className="h-3 w-3 text-green-500" />
                                  )}
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                  disabled={isSaving}
                                  className="h-7 w-7 p-0"
                                >
                                  <X className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 group">
                              <span className="text-gray-600">{fieldValues[fieldKey] || "-"}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditField(object.id, field.id, fieldValues[fieldKey] || "")}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Pencil className="h-3 w-3 text-gray-400" />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CustomObjectCard;
