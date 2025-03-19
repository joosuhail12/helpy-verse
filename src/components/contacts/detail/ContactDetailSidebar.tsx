import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickNoteInput } from "./QuickNoteInput";
import type { Contact } from '@/types/contact';

export const ContactDetailSidebar = ({ contact }: { contact: Contact }) => {
  return (
    <div className="space-y-6">
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contact.notes && contact.notes.length > 0 ? (
            <div className="space-y-4">
              
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No notes yet</p>
          )}
          
          <QuickNoteInput contact={contact} />
        </CardContent>
      </Card>
      
    </div>
  );
};
