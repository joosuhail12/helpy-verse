
import { useQuery } from '@tanstack/react-query';
import { Company } from '@/types/company';
import { mockCustomObjects } from '@/mock/customObjects';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CompanyCustomObjectDataProps {
  company: Company;
}

export const CompanyCustomObjectData = ({ company }: CompanyCustomObjectDataProps) => {
  const { data: customObjects, isLoading } = useQuery({
    queryKey: ['customObjects'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockCustomObjects.filter(obj => obj.showInCompanyDetail);
    },
  });

  if (isLoading) {
    return (
      <Card className="border-none shadow-none bg-gray-50/50">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg">Custom Objects</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!customObjects?.length) {
    return null;
  }

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg">Custom Objects</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {customObjects.map((object) => (
            <div key={object.id} className="space-y-2">
              <h3 className="text-sm font-medium">{object.name}</h3>
              <p className="text-sm text-muted-foreground">{object.description}</p>
              {/* This would normally display the actual custom object data */}
              <p className="text-sm italic text-muted-foreground">No {object.name.toLowerCase()} data available</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
