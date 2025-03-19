
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Contact } from '@/types/contact';
import { 
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
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
          onClick={() => navigate('/home/tickets/new', { 
            state: { contactId: contact.id } 
          })}
        >
          <Ticket className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      <Card className="p-4 space-y-3 bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
        <h3 className="font-medium text-sm text-purple-900">Quick Note</h3>
        <QuickNoteInput contactId={contact.id} />
      </Card>

      {contact?.tags?.length > 0 && (
        <Card className="p-4 space-y-3 bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
          <h3 className="font-medium text-sm text-purple-900">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {contact?.tags?.map((tag) => (
              <div 
                key={tag} 
                className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-2.5 py-1.5 rounded-lg transition-all duration-300 hover:bg-purple-100"
              >
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
