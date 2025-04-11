import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UserCircle, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { CustomerInlineEditField } from "./inline-edit/CustomerInlineEditField";
import { AddressEdit } from "./inline-edit/AddressEdit";

interface ContactInfoCardProps {
  customer: {
    id?: string,
    email?: string,
    phone?: string,
    firstName?: string,
    lastName?: string,
    title?: string,
    department?: string,
    timezone?: string,
    street?: string,
    city?: string,
    state?: string,
    postalCode?: string,
    country?: string,
    address?: {
      street?: string,
      city?: string,
      state?: string,
      postalCode?: string,
      country?: string
    } | string
  } | null;
  company: string | null;
  isOpen: boolean;
  onToggle: () => void;
  isLoading?: boolean;
}

const ContactInfoCard = ({ customer, company, isOpen, onToggle, isLoading = false }: ContactInfoCardProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-primary" />
              <span className="font-medium">Contact Information</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
                <span className="text-gray-500 font-medium">Email</span>
                <span className="text-gray-700">{customer?.email || "No email provided"}</span>
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
                <span className="text-gray-500 font-medium">Phone</span>
                <div>
                  <CustomerInlineEditField
                    value={customer?.phone || ""}
                    customerId={customer?.id || ""}
                    field="phone"
                    label="Phone"
                    type="phone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
                <span className="text-gray-500 font-medium">Title</span>
                <div>
                  <CustomerInlineEditField
                    value={customer?.title || ""}
                    customerId={customer?.id || ""}
                    field="title"
                    label="Title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
                <span className="text-gray-500 font-medium">Company</span>
                <div>
                  <CustomerInlineEditField
                    value={company || ""}
                    customerId={customer?.id || ""}
                    field="company"
                    label="Company"
                  />
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
                <span className="text-gray-500 font-medium">Address</span>
                <div>
                  <AddressEdit
                    initialValue={typeof customer?.address === 'string' ? customer?.address : ""}
                    customerId={customer?.id}
                    customer={{
                      street: customer?.street || (typeof customer?.address !== 'string' ? customer?.address?.street : "") || "",
                      city: customer?.city || (typeof customer?.address !== 'string' ? customer?.address?.city : "") || "",
                      state: customer?.state || (typeof customer?.address !== 'string' ? customer?.address?.state : "") || "",
                      postalCode: customer?.postalCode || (typeof customer?.address !== 'string' ? customer?.address?.postalCode : "") || "",
                      country: customer?.country || (typeof customer?.address !== 'string' ? customer?.address?.country : "") || ""
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ContactInfoCard;
