
import { Company } from '@/types/company';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomFields } from '@/hooks/useCustomFields';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { InlineEditField } from '@/components/contacts/detail/InlineEditField';

interface CompanyCustomFieldsProps {
  company: Company;
}

export const CompanyCustomFields = ({ company }: CompanyCustomFieldsProps) => {
  const { data, isLoading } = useCustomFields('companies');

  if (isLoading) {
    return (
      <Card className="border-none shadow-none bg-gray-50/50">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg">Custom Fields</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check data.companies for backward compatibility
  const fields = data?.companies || [];
  
  if (!fields || fields.length === 0) {
    return null;
  }

  // Type mapping from custom field types to InlineEditField types
  const typeMapping: Record<string, "select" | "text" | "url" | "email" | "date" | "phone"> = {
    'text': 'text',
    'email': 'email',
    'phone': 'phone',
    'date': 'date',
    'select': 'select',
    'url': 'url',
    'number': 'text'  // Map number field to text type for input
  };

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          {fields.map((field) => {
            // Convert field value to string for display
            const fieldValue = company[field.id as keyof Company];
            const safeValue = fieldValue !== undefined && fieldValue !== null 
              ? String(fieldValue) 
              : '';
            
            return (
              <div key={field.id} className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{field.name}</p>
                <InlineEditField
                  value={safeValue}
                  contactId={company.id} // Using contactId for company is ok here as it's just used for identification
                  field={field.id}
                  label={field.name}
                  type={typeMapping[field.type] || 'text'} // Default to text if type not recognized
                  options={field.options ? (typeof field.options[0] === 'string' ? field.options : field.options.map((opt: any) => opt.value)) : undefined}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
