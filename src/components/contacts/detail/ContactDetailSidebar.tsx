
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Contact } from '@/types/contact';
import { 
  Edit2, Trash2, Mail, 
  Phone, Building2, Tag, Ticket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { QuickNoteInput } from './QuickNoteInput';

interface ContactDetailSidebarProps {
  contact: Contact;
}

export const ContactDetailSidebar = ({ contact }: ContactDetailSidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copied!",
        description: `${label} has been copied to clipboard.`,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-80 space-y-6">
      <div className="space-y-2">
        <Button 
          variant="default" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/home/tickets/new', { 
            state: { contactId: contact.id } 
          })}
        >
          <Ticket className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Contact
        </Button>
        <Button variant="destructive" size="sm" className="w-full">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Contact
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <h3 className="font-medium text-sm">Quick Note</h3>
        <QuickNoteInput contactId={contact.id} />
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="font-medium text-sm">Quick Actions</h3>
        <div className="space-y-2">
          {contact.email && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start hover:bg-gray-100" 
              onClick={() => copyToClipboard(contact.email, 'Email')}
            >
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              {contact.email}
            </Button>
          )}
          {contact.phone && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start hover:bg-gray-100"
              onClick={() => copyToClipboard(contact.phone!, 'Phone')}
            >
              <Phone className="h-4 w-4 mr-2 text-gray-500" />
              {contact.phone}
            </Button>
          )}
          {contact.company && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start hover:bg-gray-100"
              onClick={() => copyToClipboard(contact.company!, 'Company')}
            >
              <Building2 className="h-4 w-4 mr-2 text-gray-500" />
              {contact.company}
            </Button>
          )}
        </div>
      </Card>

      {contact.tags.length > 0 && (
        <Card className="p-4 space-y-4">
          <h3 className="font-medium text-sm">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {contact.tags.map((tag) => (
              <div key={tag} className="flex items-center gap-2 text-sm bg-secondary px-2 py-1 rounded-md">
                <Tag className="h-3 w-3" />
                {tag}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

