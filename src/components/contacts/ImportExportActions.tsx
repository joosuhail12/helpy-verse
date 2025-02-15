
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import { Contact } from '@/types/contact';

interface ImportExportActionsProps {
  contacts: Contact[];
}

export const ImportExportActions = ({ contacts }: ImportExportActionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    const exportData = contacts.map(contact => ({
      'First Name': contact.firstName,
      'Last Name': contact.lastName,
      'Email': contact.email,
      'Company': contact.company || '',
      'Phone': contact.phone || '',
      'Type': contact.type,
      'Status': contact.status,
      'Tags': contact.tags.join(', '),
      'Last Contacted': contact.lastContacted || '',
      'Created At': contact.createdAt,
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'contacts_export.csv';
    link.click();
    
    toast({
      title: "Export complete",
      description: `Successfully exported ${contacts.length} contacts`,
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log('Parsed CSV:', results.data);
        toast({
          title: "Import complete",
          description: `Successfully parsed ${results.data.length} contacts`,
        });
        // In a real app, this would trigger an API call to import the contacts
      },
      error: (error) => {
        toast({
          title: "Import failed",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import contacts. The file should include columns for First Name, Last Name, Email, and other contact details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Select CSV File
              </Button>
            </div>
            <div className="flex items-start gap-2 p-4 bg-yellow-50 rounded-md">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-semibold">Important:</p>
                <p>Make sure your CSV file includes the following columns:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>First Name</li>
                  <li>Last Name</li>
                  <li>Email</li>
                  <li>Phone (optional)</li>
                  <li>Company (optional)</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );
};
