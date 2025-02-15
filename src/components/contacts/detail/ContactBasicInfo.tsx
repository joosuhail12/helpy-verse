
import { Contact } from '@/types/contact';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { InlineEditField } from './InlineEditField';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ContactBasicInfoProps {
  contact: Contact;
}

export const ContactBasicInfo = ({ contact }: ContactBasicInfoProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copied!",
        description: `${label} has been copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const contactInfo = `
      Name: ${contact.firstName} ${contact.lastName}
      Email: ${contact.email}
      Phone: ${contact.phone || 'N/A'}
      Company: ${contact.company || 'N/A'}
    `.trim();

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Contact: ${contact.firstName} ${contact.lastName}`,
          text: contactInfo,
        });
      } else {
        await copyToClipboard(contactInfo, "Contact information");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        toast({
          title: "Error",
          description: "Failed to share contact.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Basic Information</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1 group">
            <p className="text-sm font-medium text-muted-foreground">Type</p>
            <Badge 
              variant={contact.type === 'customer' ? 'default' : 'secondary'}
              className="mt-1 text-xs font-medium"
            >
              {contact.type}
            </Badge>
          </div>
          <div className="space-y-1 group">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge 
              variant={contact.status === 'active' ? 'default' : 'destructive'}
              className="mt-1 text-xs font-medium px-3 py-1"
            >
              {contact.status}
            </Badge>
          </div>
          <div className="space-y-1 group">
            <p className="text-sm font-medium text-muted-foreground">Company</p>
            <div className="flex items-center gap-2">
              <InlineEditField
                value={contact.company || '-'}
                contactId={contact.id}
                field="company"
                label="Company"
              />
              {contact.company && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(contact.company!, "Company")}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-1 group">
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <div className="flex items-center gap-2">
              <InlineEditField
                value={contact.phone || '-'}
                contactId={contact.id}
                field="phone"
                label="Phone"
              />
              {contact.phone && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(contact.phone!, "Phone")}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Created</p>
            <p className="text-sm">{format(new Date(contact.createdAt), 'MMM dd, yyyy')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Last Contact</p>
            <p className="text-sm">
              {contact.lastContacted 
                ? format(new Date(contact.lastContacted), 'MMM dd, yyyy')
                : '-'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
