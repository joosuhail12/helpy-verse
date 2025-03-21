
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { CustomObject } from "@/mock/customObjects";
import { BasicInfoFields } from "./objectSettings/BasicInfoFields";
import { ConnectionTypeField } from "./objectSettings/ConnectionTypeField";
import { VisibilitySettings } from "./objectSettings/VisibilitySettings";
import { useObjectSettingsForm } from "./objectSettings/useObjectSettingsForm";

interface ObjectSettingsFormProps {
  object: CustomObject;
}

export function ObjectSettingsForm({ object }: ObjectSettingsFormProps) {
  const { form, onSubmit } = useObjectSettingsForm(object);

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
