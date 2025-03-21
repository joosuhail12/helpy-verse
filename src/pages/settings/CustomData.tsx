
import { useEffect, useState } from 'react';
import AddCustomFieldDialog from '@/components/settings/customData/AddCustomFieldDialog';
import { useCustomFields } from '@/hooks/useCustomFields';
import { useCustomFieldShortcuts } from '@/hooks/useCustomFieldShortcuts';
import { useCustomFieldImport } from '@/hooks/useCustomFieldImport';
import CustomDataHeader from '@/components/settings/customData/CustomDataHeader';
import CustomDataTabs from '@/components/settings/customData/CustomDataTabs';
import { CustomField } from '@/types/customData';

// Type to handle the entity type consistency
type EntityType = "ticket" | "contact" | "company" | "customer";

// Helper function to normalize entity types
const normalizeEntityType = (type: EntityType): EntityType => {
  // Map "customer" to "contact" for backward compatibility
  return type === "customer" ? "contact" : type;
};

const CustomData = () => {
  const [selectedTable, setSelectedTable] = useState<EntityType>('ticket');
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  
  // Normalize entity type for API
  const normalizedTable = normalizeEntityType(selectedTable);
  
  const { data: customFields, isLoading, error } = useCustomFields(normalizedTable);
  const { handleImport } = useCustomFieldImport();
  const [currentFields, setCurrentFields] = useState<CustomField[]>([]);

  useEffect(() => {
    const fields = customFields?.reduce((acc: CustomField[], field: CustomField) => {
      const fieldEntityType = normalizeEntityType(field.entityType as EntityType);
      const selectedEntityType = normalizeEntityType(selectedTable);
      
      if (fieldEntityType === selectedEntityType) {
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

  const handleTableChange = (newTable: EntityType) => {
    setSelectedTable(newTable);
  };

  const handleImportWrapper = async (importedFields: CustomField[]) => {
    await handleImport(importedFields, normalizedTable);
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
        onTableChange={handleTableChange}
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
