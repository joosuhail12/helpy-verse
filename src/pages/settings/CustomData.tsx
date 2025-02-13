
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomDataTable from '@/components/settings/customData/CustomDataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddCustomFieldDialog from '@/components/settings/customData/AddCustomFieldDialog';
import { useCustomFields } from '@/hooks/useCustomFields';

const CustomData = () => {
  const [selectedTable, setSelectedTable] = useState<'tickets' | 'contacts' | 'companies'>('tickets');
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const { data: customFields, isLoading, error } = useCustomFields(selectedTable);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Custom Data Fields</h1>
        <Button onClick={() => setIsAddFieldOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      </div>

      <Tabs defaultValue="tickets" className="w-full" onValueChange={(value) => setSelectedTable(value as any)}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <CustomDataTable 
            fields={customFields?.tickets || []} 
            isLoading={isLoading} 
            error={error}
            table="tickets" 
          />
        </TabsContent>
        <TabsContent value="contacts">
          <CustomDataTable 
            fields={customFields?.contacts || []} 
            isLoading={isLoading} 
            error={error}
            table="contacts" 
          />
        </TabsContent>
        <TabsContent value="companies">
          <CustomDataTable 
            fields={customFields?.companies || []} 
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
      />
    </div>
  );
};

export default CustomData;
