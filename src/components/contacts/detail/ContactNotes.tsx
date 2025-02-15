
import { Contact } from '@/types/contact';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { StickyNote } from 'lucide-react';

interface ContactNotesProps {
  contact: Contact;
}

export const ContactNotes = ({ contact }: ContactNotesProps) => {
  // Mock notes data - this would come from your backend
  const notes = [
    {
      id: '1',
      content: 'Prefers communication via email',
      date: new Date().toISOString(),
    },
  ];

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-lg">Notes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="space-y-1">
              <p className="text-sm">{note.content}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(note.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
