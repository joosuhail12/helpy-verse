
import { Contact } from '@/types/contact';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { StickyNote } from 'lucide-react';
import { QuickNoteInput } from './QuickNoteInput';

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
        <QuickNoteInput contactId={contact.id} />
        <div className="space-y-4 mt-4">
          {contact.notes && (
            <div className="space-y-1">
              <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(contact.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
