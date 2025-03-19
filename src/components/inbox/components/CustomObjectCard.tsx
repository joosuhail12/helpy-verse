
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Database, ChevronUp, ChevronDown } from "lucide-react";
import { mockCustomObjects } from '@/mock/customObjects';
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from '@/hooks/use-toast';
import { InlineEditField } from "@/components/contacts/detail/InlineEditField";

interface CustomObjectCardProps {
  customerId: string;
  ticketId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const CustomObjectCard = ({ customerId, ticketId, isOpen, onToggle }: CustomObjectCardProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter custom objects that are connected with tickets or customers
  const relevantObjects = mockCustomObjects.filter(
    obj => (obj.connectionType === 'ticket' || obj.connectionType === 'customer') && 
           obj.showInCustomerContext
  );

  // Prepare mock data for fields
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    relevantObjects.forEach(obj => {
      obj.fields.forEach(field => {
        const key = `${obj.id}_${field.id}`;
        // Generate some sample values
        if (field.type === 'text') {
          initialValues[key] = field.id === 'name' ? 'Sample Name' : 
                              field.id === 'description' ? 'Sample description' : 
                              field.id === 'reference' ? 'REF-12345' : 'Value';
        } else if (field.type === 'number') {
          initialValues[key] = Math.floor(Math.random() * 1000).toString();
        } else if (field.type === 'select') {
          initialValues[key] = field.options?.[0] || '';
        } else {
          initialValues[key] = '';
        }
      });
    });
    return initialValues;
  });

  const handleFieldSave = (objectId: string, fieldId: string, value: string) => {
    // In a real app, this would dispatch to Redux or call an API
    const key = `${objectId}_${fieldId}`;
    setFieldValues(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Field updated",
      description: "The field has been successfully updated.",
    });
  };

  if (relevantObjects.length === 0) {
    return null;
  }

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
                      
                      return (
                        <div key={field.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{field.name}</span>
                          <div className="w-1/2">
                            <InlineEditField
                              value={fieldValues[fieldKey] || ""}
                              contactId={customerId}  // Using customerId as a fallback
                              field={fieldKey}
                              label={field.name}
                              type={field.type as any}
                              options={field.options}
                              onSave={(newValue) => handleFieldSave(object.id, field.id, newValue)}
                            />
                          </div>
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
