
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagIcon, Trash, DownloadCloud, UserCheck } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';

export const BulkActions = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const dispatch = useAppDispatch();
  const selectedContacts = useAppSelector(state => state.contacts.selectedContacts);
  const contacts = useAppSelector(state => state.contacts.contacts);
  const { toast } = useToast();

  const selectedContactsData = contacts.filter(contact => 
    selectedContacts.includes(contact.id)
  );

  const handleBulkTagging = () => {
    if (!selectedTag) return;

    selectedContacts.forEach(contactId => {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;

      const currentTags = Array.isArray(contact.tags) ? contact.tags : [];
      if (!currentTags.includes(selectedTag)) {
        dispatch(updateContact({
          id: contactId,
          tags: [...currentTags, selectedTag]
        }));
      }
    });

    toast({
      title: "Tags updated",
      description: `Updated tags for ${selectedContacts.length} contacts`,
    });
    setSelectedTag('');
  };

  const handleStatusUpdate = () => {
    if (!selectedStatus) return;

    selectedContacts.forEach(contactId => {
      dispatch(updateContact({
        id: contactId,
        status: selectedStatus as 'active' | 'inactive'
      }));
    });

    toast({
      title: "Status updated",
      description: `Updated status for ${selectedContacts.length} contacts`,
    });
    setSelectedStatus('');
  };

  const handleExport = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Company', 'Type', 'Status'],
      ...selectedContactsData.map(contact => [
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

  const isDisabled = selectedContacts.length === 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Add tag..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="important">Important</SelectItem>
            <SelectItem value="follow-up">Follow-up</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkTagging}
          disabled={isDisabled || !selectedTag}
        >
          <TagIcon className="h-4 w-4 mr-2" />
          Apply Tag
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Update status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={handleStatusUpdate}
          disabled={isDisabled || !selectedStatus}
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Update Status
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={isDisabled}
      >
        <DownloadCloud className="h-4 w-4 mr-2" />
        Export Selected
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
        disabled={isDisabled}
        className="text-red-600 hover:text-red-700"
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete Selected
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Contacts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedContacts.length} contacts? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => {
              // In a real app, this would call a delete API
              toast({
                title: "Contacts deleted",
                description: `Successfully deleted ${selectedContacts.length} contacts`,
              });
              setShowDeleteDialog(false);
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
