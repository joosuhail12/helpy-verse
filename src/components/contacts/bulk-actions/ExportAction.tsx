
import { DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Contact } from '@/types/contact';

interface ExportActionProps {
  selectedContacts: Contact[];
  isDisabled: boolean;
}

export const ExportAction = ({ selectedContacts, isDisabled }: ExportActionProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Company', 'Type', 'Status'],
      ...selectedContacts.map(contact => [
        contact.firstName,
        contact.lastName,
        contact.email,
        contact.company || '',
        contact.type,
        contact.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export complete",
      description: `Exported ${selectedContacts.length} contacts`,
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isDisabled}
    >
      <DownloadCloud className="h-4 w-4 mr-2" />
      Export Selected
    </Button>
  );
};

