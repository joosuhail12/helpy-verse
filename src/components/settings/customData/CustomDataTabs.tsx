
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomDataTable from './CustomDataTable';
import type { CustomField } from "@/types/customField";

interface CustomDataTabsProps {
  selectedTable: 'tickets' | 'contacts' | 'companies';
  onTableChange: (value: 'tickets' | 'contacts' | 'companies') => void;
  currentFields: CustomField[];
  isLoading: boolean;
  error: any;
}

const CustomDataTabs = ({
  selectedTable,
  onTableChange,
  currentFields,
  isLoading,
  error
}: CustomDataTabsProps) => {
  return (
    <Tabs defaultValue={selectedTable} className="w-full" onValueChange={(value) => onTableChange(value as any)}>
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="tickets">Tickets</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="companies">Companies</TabsTrigger>
      </TabsList>

      <TabsContent value="tickets">
        <CustomDataTable 
          currentFields={currentFields} 
          isLoading={isLoading} 
          error={error}
          table="tickets" 
        />
      </TabsContent>
      <TabsContent value="contacts">
        <CustomDataTable 
          currentFields={currentFields} 
          isLoading={isLoading} 
          error={error}
          table="contacts" 
        />
      </TabsContent>
      <TabsContent value="companies">
        <CustomDataTable 
          currentFields={currentFields} 
          isLoading={isLoading} 
          error={error}
          table="companies" 
        />
      </TabsContent>
    </Tabs>
  );
};

export default CustomDataTabs;

