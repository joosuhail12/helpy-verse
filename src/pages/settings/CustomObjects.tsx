
import { Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { mockCustomObjects, type CustomObject } from "@/mock/customObjects";

// This will be replaced with actual API call once backend is ready
const fetchCustomObjects = async (): Promise<CustomObject[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockCustomObjects;
};

const CustomObjects = () => {
  const { data: customObjects, isLoading } = useQuery({
    queryKey: ['customObjects'],
    queryFn: fetchCustomObjects,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-semibold">Custom Objects</h1>
        </div>
        <Button>
          Create Custom Object
        </Button>
      </div>

      {customObjects?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Database className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No custom objects yet</h3>
            <p className="text-sm text-gray-500 mt-2">
              Get started by creating your first custom object
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {customObjects?.map((object) => (
            <Card key={object.id}>
              <CardContent className="flex items-center justify-between py-6">
                <div>
                  <h3 className="text-lg font-medium">{object.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{object.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {object.fields.length} fields
                    </span>
                    {object.showInCustomerContext && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Shows in customer context
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="outline">
                  Manage Fields
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomObjects;
