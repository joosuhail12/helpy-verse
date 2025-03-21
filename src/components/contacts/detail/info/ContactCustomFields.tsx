
import React, { useState, useEffect } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCustomFields } from '@/hooks/useCustomFields';
import { CustomField } from '@/types/customData';
import { useToast } from '@/hooks/use-toast';

const ContactCustomFields = ({ contact, onUpdate }: any) => {
  const { data: customFields, isLoading, error } = useCustomFields('contact');
  const [contactFields, setContactFields] = useState<CustomField[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (customFields) {
      // Filter fields for the contact entity type
      const filtered = customFields.filter(field => 
        field.entityType === 'contact' || field.entityType === 'customer'
      );
      setContactFields(filtered);
    }
  }, [customFields]);

  const handleFieldUpdate = async (field: CustomField, value: string | number | boolean | string[]) => {
    try {
      // Update the contact with the new field value
      const updatedContact = {
        ...contact,
        customFields: {
          ...contact.customFields,
          [field.id]: value
        }
      };
      
      await onUpdate(updatedContact);
      
      toast({
        title: "Field updated",
        description: `${field.name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating the field.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading custom fields...</div>;
  }

  if (error) {
    return <div className="py-4 text-red-500">Error loading custom fields</div>;
  }

  const renderFieldValue = (field: CustomField, value: unknown) => {
    // Type assertion to handle unknown value type
    const typedValue = value as string | number | boolean | string[];
    
    return (
      <div className="flex justify-between items-center py-2">
        <div>
          <p className="font-medium">{field.name}</p>
          <p className="text-sm text-gray-500">
            {typedValue?.toString() || 'Not set'}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => console.log('Edit field', field.id)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Custom Fields</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Field
        </Button>
      </div>
      
      <Separator />
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {contactFields.length === 0 ? (
            <p className="text-gray-500 py-2">No custom fields available</p>
          ) : (
            contactFields.map(field => (
              <div key={field.id}>
                {renderFieldValue(field, contact?.customFields?.[field.id])}
                <Separator />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ContactCustomFields;
