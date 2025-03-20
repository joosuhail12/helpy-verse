
import * as z from "zod";

export const objectSettingsSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters"),
  connectionType: z.enum(['customer', 'ticket']).nullable(),
  showInCustomerContext: z.boolean(),
  showInCustomerDetail: z.boolean(),
  showInCompanyDetail: z.boolean(),
});

export type ObjectSettingsFormValues = z.infer<typeof objectSettingsSchema>;

