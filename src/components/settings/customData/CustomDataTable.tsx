
import { Table } from "@/components/ui/table";
import { CustomField } from "@/types/customField";
import BulkCustomFieldActions from "./BulkCustomFieldActions";
import { useState } from "react";
import FieldHistory from "./FieldHistory";
import SearchField from "./SearchField";
import TableHeaderComponent from "./table/TableHeader";
import TableBodyComponent from "./table/TableBody";
import DuplicateFieldsWarning from "./DuplicateFieldsWarning";
import { getDuplicateFields, filterFields } from "./utils/fieldUtils";

interface CustomDataTableProps {
  fields: CustomField[];
  isLoading: boolean;
  error: any;
  table: 'tickets' | 'contacts' | 'companies';
}

const CustomDataTable = ({ fields, isLoading, error, table }: CustomDataTableProps) => {
  const [selectedFields, setSelectedFields] = useState<CustomField[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<CustomField | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const duplicateFields = getDuplicateFields(fields);
  const filteredFields = filterFields(fields, searchQuery);

  const handleSelectAll = (checked: boolean) => {
    setSelectedFields(checked ? filteredFields : []);
  };

  const handleSelectField = (field: CustomField, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, field]);
    } else {
      setSelectedFields(selectedFields.filter((f) => f.id !== field.id));
    }
  };

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        <p className="font-medium">Failed to load custom fields</p>
        <p className="text-sm mt-1">Please try again later. If the problem persists, contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchField value={searchQuery} onChange={setSearchQuery} />
        <BulkCustomFieldActions
          selectedFields={selectedFields}
          table={table}
          onSelectionChange={setSelectedFields}
        />
      </div>

      <DuplicateFieldsWarning duplicateFields={duplicateFields} />

      <div className="rounded-md border">
        <Table>
          <TableHeaderComponent
            filteredFields={filteredFields}
            selectedFields={selectedFields}
            onSelectAll={handleSelectAll}
          />
          <TableBodyComponent
            isLoading={isLoading}
            filteredFields={filteredFields}
            selectedFields={selectedFields}
            duplicateFields={duplicateFields}
            searchQuery={searchQuery}
            table={table}
            fields={fields}
            onSelectField={handleSelectField}
            onHistoryClick={setSelectedHistory}
          />
        </Table>
      </div>

      {selectedHistory && (
        <FieldHistory 
          isOpen={true}
          onClose={() => setSelectedHistory(null)}
          history={selectedHistory.history}
        />
      )}
    </div>
  );
};

export default CustomDataTable;
