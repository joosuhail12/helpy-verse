
import * as React from 'react';
import { useState, useEffect } from 'react';
import AddCustomFieldDialog from '@/components/settings/customData/AddCustomFieldDialog';
import { useCustomFields } from '@/hooks/useCustomFields';
import { useCustomFieldShortcuts } from '@/hooks/useCustomFieldShortcuts';
import { useCustomFieldImport } from '@/hooks/useCustomFieldImport';
import CustomDataHeader from '@/components/settings/customData/CustomDataHeader';
import CustomDataTabs from '@/components/settings/customData/CustomDataTabs';
import { toast } from '@/components/ui/use-toast';
import { HttpClient } from '@/api/services/http';
import { Loader2 } from 'lucide-react';

const CustomData = () => {
  const [selectedTable, setSelectedTable] = useState<'tickets' | 'contacts' | 'companies'>('tickets');
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [apiInitialized, setApiInitialized] = useState(false);
  const { data: customFields, isLoading, error } = useCustomFields(selectedTable);
  const { handleImport } = useCustomFieldImport();

  const currentFields = customFields?.[selectedTable] || [];

  // Check API connection on component mount
  useEffect(() => {
    HttpClient.checkApiConnection()
      .then(isConnected => {
        setApiInitialized(isConnected);
        if (!isConnected) {
          toast({
            title: "Connection Issue",
            description: "Unable to connect to the API. Some features may be unavailable.",
            variant: "destructive",
          });
        }
      });
  }, []);

  // Setup keyboard shortcuts
  useCustomFieldShortcuts({
    onCreateField: () => setIsAddFieldOpen(true),
    hasSelection: false,
  });

  const handleImportWrapper = async (importedFields: any[]) => {
    try {
      await handleImport(importedFields, selectedTable);
      toast({
        title: "Fields Imported",
        description: `Successfully imported ${importedFields.length} fields.`,
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing fields. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state if API is not initialized yet
  if (!apiInitialized && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Connecting to server...</p>
      </div>
    );
  }

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
