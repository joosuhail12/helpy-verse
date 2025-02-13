
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomDataTable from '@/components/settings/customData/CustomDataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddCustomFieldDialog from '@/components/settings/customData/AddCustomFieldDialog';
import { useCustomFields } from '@/hooks/useCustomFields';
import { useCustomFieldShortcuts } from '@/hooks/useCustomFieldShortcuts';
import ImportExportFields from '@/components/settings/customData/ImportExportFields';
import { CustomField } from '@/types/customField';
import { useCustomDataMutations } from '@/hooks/useCustomDataMutations';

const CustomData = () => {
  const [selectedTable, setSelectedTable] = useState<'tickets' | 'contacts' | 'companies'>('tickets');
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const { data: customFields, isLoading, error } = useCustomFields(selectedTable);
  const { addCustomField } = useCustomDataMutations();

  const currentFields = customFields?.[selectedTable] || [];

  // Setup keyboard shortcuts
  useCustomFieldShortcuts({
    onCreateField: () => setIsAddFieldOpen(true),
    hasSelection: false,
  });

  const handleImport = async (importedFields: CustomField[]) => {
    // Add each imported field using the existing mutation
    for (const field of importedFields) {
      await addCustomField({
        table: selectedTable,
        field: {
          name: field.name,
          type: field.type,
          required: field.required,
          description: field.description,
          options: field.options,
          validationRules: field.validationRules,
          dependencies: field.dependencies,
        }
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Custom Data Fields</h1>
        <div className="flex items-center gap-4">
          <ImportExportFields
            fields={currentFields}
            table={selectedTable}
            onImport={handleImport}
          />
          <Button onClick={() => setIsAddFieldOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field <span className="ml-2 text-xs text-muted-foreground">(Ctrl+N)</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tickets" className="w-full" onValueChange={(value) => setSelectedTable(value as any)}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <CustomDataTable 
            fields={currentFields} 
            isLoading={isLoading} 
            error={error}
            table="tickets" 
          />
        </TabsContent>
        <TabsContent value="contacts">
          <CustomDataTable 
            fields={currentFields} 
            isLoading={isLoading} 
            error={error}
            table="contacts" 
          />
        </TabsContent>
        <TabsContent value="companies">
          <CustomDataTable 
            fields={currentFields} 
            isLoading={isLoading} 
            error={error}
            table="companies" 
          />
        </TabsContent>
      </Tabs>

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
