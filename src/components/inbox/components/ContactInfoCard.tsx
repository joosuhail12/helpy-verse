import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { UserCircle, Mail, Phone, Globe, ChevronUp, ChevronDown, Loader2, Building, MapPin } from "lucide-react";
import { CustomerInlineEditField } from "./inline-edit/CustomerInlineEditField";

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
    address?: {
      street?: string,
      city?: string,
      state?: string,
      postalCode?: string,
      country?: string
    }
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
        <CollapsibleContent className="p-4 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              <span className="ml-2 text-sm text-gray-500">Loading contact information...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Basic Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Email</span>
                </div>
                {customer?.id ? (
                  <CustomerInlineEditField
                    value={customer?.email || ''}
                    customerId={customer?.id}
                    field="email"
                    label="Email"
                    type="email"
                    validation={[
                      { type: 'required', value: 'true', message: 'Email is required' },
                      { type: 'regex', value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', message: 'Must be a valid email' }
                    ]}
                  />
                ) : (
                  <span className="text-gray-600">{customer?.email || 'No email available'}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Phone</span>
                </div>
                {customer?.id ? (
                  <CustomerInlineEditField
                    value={customer?.phone || ''}
                    customerId={customer?.id}
                    field="phone"
                    label="Phone"
                    type="phone"
                  />
                ) : (
                  <span className="text-gray-600">{customer?.phone || 'No phone available'}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Title</span>
                </div>
                {customer?.id ? (
                  <CustomerInlineEditField
                    value={customer?.title || ''}
                    customerId={customer?.id}
                    field="title"
                    label="Title"
                  />
                ) : (
                  <span className="text-gray-600">{customer?.title || 'No title information'}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Company</span>
                </div>
                {customer?.id ? (
                  <CustomerInlineEditField
                    value={company || ''}
                    customerId={customer?.id}
                    field="company"
                    label="Company"
                  />
                ) : (
                  <span className="text-gray-600">{company || 'No company information'}</span>
                )}
              </div>

              {/* Address Information if available */}
              {customer?.address && (customer?.address?.street || customer?.address?.city) && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500 font-medium">Address</span>
                  </div>

                  {customer?.id && customer?.address?.street !== undefined && (
                    <div className="flex items-center justify-between text-sm pl-6 mb-1">
                      <span className="text-gray-500">Street</span>
                      <CustomerInlineEditField
                        value={customer.address.street || ''}
                        customerId={customer.id}
                        field="street"
                        label="Street"
                      />
                    </div>
                  )}

                  {customer?.id && customer?.address?.city !== undefined && (
                    <div className="flex items-center justify-between text-sm pl-6 mb-1">
                      <span className="text-gray-500">City</span>
                      <CustomerInlineEditField
                        value={customer.address.city || ''}
                        customerId={customer.id}
                        field="city"
                        label="City"
                      />
                    </div>
                  )}

                  {customer?.id && customer?.address?.state !== undefined && (
                    <div className="flex items-center justify-between text-sm pl-6 mb-1">
                      <span className="text-gray-500">State</span>
                      <CustomerInlineEditField
                        value={customer.address.state || ''}
                        customerId={customer.id}
                        field="state"
                        label="State"
                      />
                    </div>
                  )}

                  {customer?.id && customer?.address?.country !== undefined && (
                    <div className="flex items-center justify-between text-sm pl-6">
                      <span className="text-gray-500">Country</span>
                      <CustomerInlineEditField
                        value={customer.address.country || ''}
                        customerId={customer.id}
                        field="country"
                        label="Country"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ContactInfoCard;
