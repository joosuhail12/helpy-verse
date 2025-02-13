
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CustomObject } from "@/mock/customObjects";
import { toast } from "@/components/ui/use-toast";
import { BasicInfoFields } from "./objectSettings/BasicInfoFields";
import { ConnectionTypeField } from "./objectSettings/ConnectionTypeField";
import { VisibilitySettings } from "./objectSettings/VisibilitySettings";
import { objectSettingsSchema, type ObjectSettingsFormValues } from "./objectSettings/schema";

interface ObjectSettingsFormProps {
  object: CustomObject;
}

export function ObjectSettingsForm({ object }: ObjectSettingsFormProps) {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <ConnectionTypeField form={form} />
        <VisibilitySettings form={form} />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}

