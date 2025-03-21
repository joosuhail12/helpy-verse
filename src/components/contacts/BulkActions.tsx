
import { useAppSelector } from '@/hooks/useAppSelector';
import { TagActions } from './bulk-actions/TagActions';
import { StatusActions } from './bulk-actions/StatusActions';
import { ExportAction } from './bulk-actions/ExportAction';
import { DeleteAction } from './bulk-actions/DeleteAction';

export const BulkActions = () => {
  const selectedContacts = useAppSelector(state => state.contacts.selectedContacts);
  const contacts = useAppSelector(state => state.contacts.contacts);
  
  const selectedContactsData = contacts.filter(contact => 
    selectedContacts.includes(contact.id)
  );
  
  const isDisabled = selectedContacts.length === 0;

  return (
    <div className="flex items-center gap-2">
      <TagActions 
        selectedContacts={selectedContacts}
        contacts={contacts}
      />
      
      <StatusActions 
        selectedContacts={selectedContacts}
      />

      <ExportAction 
        selectedContacts={selectedContactsData}
        isDisabled={isDisabled}
      />

      <DeleteAction 
        selectedContacts={selectedContacts}
        isDisabled={isDisabled}
      />
    </div>
  );
};

