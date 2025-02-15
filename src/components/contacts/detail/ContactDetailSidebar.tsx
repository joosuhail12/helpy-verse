
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Contact } from '@/types/contact';
import { 
  Edit2, Trash2, 
  Ticket, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QuickNoteInput } from './QuickNoteInput';

interface ContactDetailSidebarProps {
  contact: Contact;
}

export const ContactDetailSidebar = ({ contact }: ContactDetailSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={() => navigate('/home/tickets/new', { 
            state: { contactId: contact.id } 
          })}
        >
          <Ticket className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <Card className="p-4 space-y-3">
        <h3 className="font-medium text-sm text-gray-700">Quick Note</h3>
        <QuickNoteInput contactId={contact.id} />
      </Card>

      {contact.tags.length > 0 && (
        <Card className="p-4 space-y-3">
          <h3 className="font-medium text-sm text-gray-700">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {contact.tags.map((tag) => (
              <div key={tag} className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
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

