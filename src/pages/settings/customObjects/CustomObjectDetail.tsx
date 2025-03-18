
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { ArrowLeft, Database, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ObjectSettingsForm } from "@/components/settings/customObjects/ObjectSettingsForm";
import { useState } from "react";
import AddCustomFieldDialog from "@/components/settings/customData/AddCustomFieldDialog";
import { CustomObjectField } from "@/types/customObject";
import { useCustomFieldImport } from "@/hooks/useCustomFieldImport";
import ImportExportFields from "@/components/settings/customData/ImportExportFields";
import { customObjectService } from "@/api/services/customObject.service";
import { useToast } from "@/hooks/use-toast";
import { CustomObject } from "@/types/customObject";
import CustomObjectsTable from "@/components/settings/customObjects/CustomObjectsTable";
import AddCustomObjectFieldDialog from "@/components/settings/customObjects/AddCustomObjectFieldDialog";

const CustomObjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
    const { handleImport } = useCustomFieldImport();
    const { toast } = useToast();

    const fetchCustomObject = async (id: string): Promise<CustomObject | undefined> => {
        try {
            const response = await customObjectService.getCustomObjectById(id);
            if (response.status === "success") {
                return response.data;
            }
            else {
                toast({
                    title: "Error",
                    description: "Failed to fetch custom object",
                    variant: "destructive",
                });
            }
            return undefined;
        } catch (error) {
            console.error("Error fetching custom object:", error);
            return undefined;
        }
    };

    const { data: customObject, isLoading } = useQuery({
        queryKey: ['customObject', id],
        queryFn: () => fetchCustomObject(id!),
        enabled: !!id,
    });

    // const handleImportWrapper = async (importedFields: CustomField[]) => {
    //     if (customObject) {
    //         await handleImport(importedFields, customObject.slug as "tickets" | "contacts" | "companies");
    //     }
    // };

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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Custom Fields</h2>
                            <div className="flex items-center gap-4">
                                {/* <ImportExportFields
                                    fields={customObject.fields as CustomField[]}
                                    table={customObject.slug as "tickets" | "contacts" | "companies"}
                                    onImport={handleImportWrapper}
                                />
                                    
                                TODO:Implement Import Export Fields
                                
                                */}
                                <Button onClick={() => setIsAddFieldOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Field
                                </Button>
                            </div>
                        </div>

                        <CustomObjectsTable
                            customObjectId={id}
                            currentFields={customObject.customobjectfields}
                        />
                    </div>

                    <AddCustomObjectFieldDialog
                        customObjectId={id}
                        isOpen={isAddFieldOpen}
                        onClose={() => setIsAddFieldOpen(false)}
                        existingFields={customObject.customobjectfields as CustomObjectField[]}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CustomObjectDetail;
