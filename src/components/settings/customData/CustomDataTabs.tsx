
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomDataTable from './CustomDataTable';
import type { CustomField } from "@/types/customData";

interface CustomDataTabsProps {
  selectedTable: 'ticket' | 'customer' | 'company';
  onTableChange: (value: 'ticket' | 'customer' | 'company') => void;
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
        <TabsTrigger value="ticket">Tickets</TabsTrigger>
        <TabsTrigger value="customer">Contacts</TabsTrigger>
        <TabsTrigger value="company">Companies</TabsTrigger>
      </TabsList>

      <TabsContent value="ticket">
        <CustomDataTable
          currentFields={currentFields}
          isLoading={isLoading}
          error={error}
          table="ticket"
        />
      </TabsContent>
      <TabsContent value="customer">
        <CustomDataTable
          currentFields={currentFields}
          isLoading={isLoading}
          error={error}
          table="customer"
        />
      </TabsContent>
      <TabsContent value="company">
        <CustomDataTable
          currentFields={currentFields}
          isLoading={isLoading}
          error={error}
          table="company"
        />
      </TabsContent>
    </Tabs>
  );
};

export default CustomDataTabs;

