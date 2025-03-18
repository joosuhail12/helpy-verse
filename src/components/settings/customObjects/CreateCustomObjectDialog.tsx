
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { customObjectService } from "@/api/services/customObject.service";
import { CustomObject } from "@/types/customObject";


const customObjectSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    description: z.string().max(200, "Description must be less than 200 characters"),
    slug: z.string().min(1, "Slug is required").max(50, "Slug must be less than 50 characters")
        .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    showInCustomerContext: z.boolean().default(false),
    showInCustomerDetail: z.boolean().default(false),
    showInCompanyDetail: z.boolean().default(false),
});

type CustomObjectFormValues = z.infer<typeof customObjectSchema>;

export function CreateCustomObjectDialog() {
    const [open, setOpen] = useState(false);

    const form = useForm<CustomObjectFormValues>({
        resolver: zodResolver(customObjectSchema),
        defaultValues: {
            name: "",
            description: "",
            slug: "",
            showInCustomerContext: false,
            showInCustomerDetail: false,
            showInCompanyDetail: false,
        },
    });

    const onSubmit = async (data: CustomObject) => {
        try {
            const response = await customObjectService.createCustomObject(data);
            if (response.status === "success") {
                toast({
                    title: "Success",
                    description: "Custom object created successfully",
                });
            }
            else {
                toast({
                    title: "Error",
                    description: "Failed to create custom object",
                    variant: "destructive",
                });
            }
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error("Error creating custom object:", error);
            toast({
                title: "Error",
                description: "Failed to create custom object",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Custom Object
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Custom Object</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Orders" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        A friendly name for your custom object
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., orders" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Used in API calls and URLs (lowercase, no spaces)
                                    </FormDescription>
                                    <FormMessage />
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
                                        <Textarea placeholder="Describe the purpose of this custom object" {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Object</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
