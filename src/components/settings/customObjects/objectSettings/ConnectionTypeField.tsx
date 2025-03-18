
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Ticket } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import type { ObjectSettingsFormValues } from "./schema";

interface ConnectionTypeFieldProps {
  form: UseFormReturn<ObjectSettingsFormValues>;
}

export function ConnectionTypeField({ form }: ConnectionTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="connectiontype"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Connect to</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="No connection" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="customer">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Customers</span>
                </div>
              </SelectItem>
              <SelectItem value="ticket">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span>Tickets</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Connect this object to customers or tickets to establish a relationship
          </FormDescription>
        </FormItem>
      )}
    />
  );
}

