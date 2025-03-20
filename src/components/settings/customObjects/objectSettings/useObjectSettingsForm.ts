
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { objectSettingsSchema, type ObjectSettingsFormValues } from "./schema";
import { customObjectService } from "@/api/services/customObject.service";
import { CustomObject } from "@/types/customObject";

export const useObjectSettingsForm = (object: CustomObject) => {
  const form = useForm<ObjectSettingsFormValues>({
    resolver: zodResolver(objectSettingsSchema),
    defaultValues: {
      name: object.name,
      description: object.description,
      connectiontype: object.connectiontype,
      showInCustomerContext: object.showInCustomerContext,
      showInCustomerDetail: object.showInCustomerDetail,
      showInCompanyDetail: object.showInCompanyDetail,
    },
  });

  const onSubmit = async (data: ObjectSettingsFormValues) => {
    try {
      const response = await customObjectService.updateCustomObject(object.id, data);

      if (response.status === "success") {
        toast({
          title: "Success",
          description: "Custom object updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update custom object",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update custom object",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    onSubmit,
  };
};
