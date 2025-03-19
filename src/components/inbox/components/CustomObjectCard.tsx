
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Database, ChevronUp, ChevronDown, Clock, Tag } from "lucide-react";
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

  // Mocked custom object data
  const customObjectData = {
    id: 'co-mock-id',
    name: 'Subscription',
    description: 'Customer subscription details',
    fields: [
      {
        id: 'field-1',
        name: 'Plan Type',
        type: 'select',
        value: 'Enterprise',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-03-01T14:30:00Z',
        history: [],
        required: true,
        description: 'Customer plan type',
        selectOptions: ['Basic', 'Pro', 'Enterprise']
      },
      {
        id: 'field-2',
        name: 'Billing Cycle',
        type: 'select',
        value: 'Annual',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-03-01T14:30:00Z',
        history: [],
        required: true,
        description: 'Billing cycle frequency',
        selectOptions: ['Monthly', 'Quarterly', 'Annual']
      },
      {
        id: 'field-3',
        name: 'Active Licenses',
        type: 'number',
        value: '250',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-03-01T14:30:00Z',
        history: [],
        required: true,
        description: 'Number of active licenses'
      },
      {
        id: 'field-4',
        name: 'Contract Start',
        type: 'date',
        value: '2023-09-01',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-03-01T14:30:00Z',
        history: [],
        required: true,
        description: 'Contract start date'
      },
      {
        id: 'field-5',
        name: 'Contract End',
        type: 'date',
        value: '2024-09-01',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-03-01T14:30:00Z',
        history: [],
        required: true,
        description: 'Contract end date'
      },
      {
        id: 'field-6',
        name: 'Auto-Renew',
        type: 'boolean',
        value: 'true',
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-03-01T14:30:00Z',
        history: [],
        required: false,
        description: 'Contract auto-renewal'
      }
    ]
  };

  const handleFieldSave = (field: string, value: string) => {
    toast({
      title: "Field updated",
      description: `${field} has been successfully updated.`,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="group">
      <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-t-lg group-data-[state=closed]:rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="font-medium">{customObjectData.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                Custom Object
              </Badge>
              {isOpen ? 
                <ChevronUp className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" /> : 
                <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              }
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="space-y-3 text-sm">
            <div className="space-y-1 pb-2 mb-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">{customObjectData.description}</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              {customObjectData.fields.map(field => (
                <div key={field.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {field.type === 'date' ? (
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                    ) : field.type === 'select' ? (
                      <Tag className="h-3.5 w-3.5 text-gray-400" />
                    ) : null}
                    <span className="text-gray-500 font-medium">{field.name}</span>
                  </div>
                  <InlineEditField
                    value={field.value}
                    contactId={customerId}
                    field={field.id}
                    label={field.name}
                    type={field.type as any}
                    options={field.selectOptions || []}
                    onSave={(value) => handleFieldSave(field.name, value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CustomObjectCard;
