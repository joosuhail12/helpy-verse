
import { useEffect, useState } from 'react';
import AddCustomFieldDialog from '@/components/settings/customData/AddCustomFieldDialog';
import { useCustomFields } from '@/hooks/useCustomFields';
import { useCustomFieldShortcuts } from '@/hooks/useCustomFieldShortcuts';
import { useCustomFieldImport } from '@/hooks/useCustomFieldImport';
import CustomDataHeader from '@/components/settings/customData/CustomDataHeader';
import CustomDataTabs from '@/components/settings/customData/CustomDataTabs';
import { CustomField } from '@/types/customData';

const CustomData = () => {
  const [selectedTable, setSelectedTable] = useState<'ticket' | 'contact' | 'company'>('ticket');
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const { data: customFields, isLoading, error } = useCustomFields(selectedTable);
  const { handleImport } = useCustomFieldImport();
  const [currentFields, setCurrentFields] = useState<CustomField[]>([]);

  useEffect(() => {
    const fields = customFields?.reduce((acc: CustomField[], field: CustomField) => {
      if (field.entityType === selectedTable) {
        acc.push(field);
      }
      return acc;
    }, []) || [];

    setCurrentFields(fields);
  }, [selectedTable, customFields]);

  // Setup keyboard shortcuts
  useCustomFieldShortcuts({
    onCreateField: () => setIsAddFieldOpen(true),
    hasSelection: false,
  });

  const handleImportWrapper = async (importedFields: CustomField[]) => {
    await handleImport(importedFields, selectedTable);
  };

  return (
    <div className="p-6 space-y-6">
      <CustomDataHeader
        onAddField={() => setIsAddFieldOpen(true)}
        currentFields={currentFields}
        selectedTable={selectedTable}
        onImport={handleImportWrapper}
      />

      <CustomDataTabs
        selectedTable={selectedTable}
        onTableChange={setSelectedTable}
        currentFields={currentFields}
        isLoading={isLoading}
        error={error}
      />

      <AddCustomFieldDialog
        isOpen={isAddFieldOpen}
        onClose={() => setIsAddFieldOpen(false)}
        table={selectedTable}
        existingFields={currentFields}
      />
    </div>
  );
};

export default CustomData;
