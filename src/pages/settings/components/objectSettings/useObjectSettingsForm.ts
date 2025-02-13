
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { objectSettingsSchema, type ObjectSettingsFormValues } from "./schema";
import type { CustomObject } from "@/mock/customObjects";

export const useObjectSettingsForm = (object: CustomObject) => {
  const form = useForm<ObjectSettingsFormValues>({
    resolver: zodResolver(objectSettingsSchema),
    defaultValues: {
      name: object.name,
      description: object.description,
      connectionType: object.connectionType,
      showInCustomerContext: object.showInCustomerContext,
      showInCustomerDetail: object.showInCustomerDetail,
      showInCompanyDetail: object.showInCompanyDetail,
    },
  });

  const onSubmit = async (data: ObjectSettingsFormValues) => {
    try {
      // This will be replaced with actual API call
      console.log("Updating custom object:", data);
      toast({
        title: "Success",
        description: "Custom object updated successfully",
      });
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
