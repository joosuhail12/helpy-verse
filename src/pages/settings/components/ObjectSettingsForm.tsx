
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { CustomObject } from "@/mock/customObjects";
import { toast } from "@/components/ui/use-toast";

const objectSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters"),
  showInCustomerContext: z.boolean(),
  showInCustomerDetail: z.boolean(),
  showInCompanyDetail: z.boolean(),
});

type ObjectSettingsFormValues = z.infer<typeof objectSettingsSchema>;

interface ObjectSettingsFormProps {
  object: CustomObject;
}

export function ObjectSettingsForm({ object }: ObjectSettingsFormProps) {
  const form = useForm<ObjectSettingsFormValues>({
    resolver: zodResolver(objectSettingsSchema),
    defaultValues: {
      name: object.name,
      description: object.description,
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                A friendly name for your custom object
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Describe the purpose of this custom object
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="showInCustomerContext"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show in Customer Context</FormLabel>
                  <FormDescription>
                    Display this object in customer context panels
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showInCustomerDetail"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show in Customer Detail</FormLabel>
                  <FormDescription>
                    Display this object on customer detail pages
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showInCompanyDetail"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show in Company Detail</FormLabel>
                  <FormDescription>
                    Display this object on company detail pages
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
