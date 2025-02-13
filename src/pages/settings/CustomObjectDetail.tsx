
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { ArrowLeft, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { mockCustomObjects, type CustomObject } from "@/mock/customObjects";
import { Skeleton } from "@/components/ui/skeleton";
import CustomDataTable from "@/components/settings/customData/CustomDataTable";
import { ObjectSettingsForm } from "./components/ObjectSettingsForm";

// This will be replaced with actual API call
const fetchCustomObject = async (id: string): Promise<CustomObject | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockCustomObjects.find(obj => obj.id === id);
};

const CustomObjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: customObject, isLoading } = useQuery({
    queryKey: ['customObject', id],
    queryFn: () => fetchCustomObject(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!customObject) {
    return (
      <div className="p-6">
        <div className="text-red-500">Custom object not found</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/home/settings/custom-objects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-semibold">{customObject.name}</h1>
          </div>
        </div>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList>
          <TabsTrigger value="settings">Object Settings</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
        </TabsList>
        <TabsContent value="settings" className="mt-6">
          <ObjectSettingsForm object={customObject} />
        </TabsContent>
        <TabsContent value="fields" className="mt-6">
          <CustomDataTable 
            table={customObject.slug} 
            currentFields={customObject.fields.map(field => ({
              id: field.id,
              name: field.name,
              type: field.type as any,
              required: field.required,
              description: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              history: []
            }))} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomObjectDetail;
