
import { Company } from '@/types/company';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomFields } from '@/hooks/useCustomFields';
import { InlineEditField } from './InlineEditField';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

interface CompanyCustomFieldsProps {
  company: Company;
}

export const CompanyCustomFields = ({ company }: CompanyCustomFieldsProps) => {
  const { data: customFields, isLoading } = useCustomFields('company');

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

  if (!customFields?.length) {
    return null;
  }

  const companyFields = customFields.filter(field => field.entityType === 'company');

  if (companyFields.length === 0) {
    return null;
  }

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          {companyFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{field.name}</p>
              <InlineEditField
                value={company[field.id] as string | number | boolean | string[] || ''}
                companyId={company.id}
                field={field.id}
                label={field.name}
                type={field.fieldType}
                options={field.options || []}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
