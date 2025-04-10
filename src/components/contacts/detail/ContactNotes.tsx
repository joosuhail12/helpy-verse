
import { Contact } from '@/types/contact';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { StickyNote } from 'lucide-react';
import { QuickNoteInput } from './QuickNoteInput';
import { format } from 'date-fns';

interface ContactNotesProps {
  contact: Contact;
}

export const ContactNotes = ({ contact }: ContactNotesProps) => {
  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-lg">Notes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <QuickNoteInput contactId={contact.id} initialNote={contact.notes || ''} />
        {contact.notes && (
          <div className="space-y-4 mt-4 p-4 bg-white rounded-lg border">
            <div className="space-y-2">
              <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
              <p className="text-xs text-muted-foreground">
                Last updated: {format(new Date(contact.updatedAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
