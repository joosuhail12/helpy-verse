
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ImportExportFields from './ImportExportFields';
import type { CustomField } from "@/types/customField";

interface CustomDataHeaderProps {
  onAddField: () => void;
  currentFields: CustomField[];
  selectedTable: 'ticket' | 'customer' | 'company';
  onImport: (fields: CustomField[]) => Promise<void>;
}

const CustomDataHeader = ({
  onAddField,
  currentFields,
  selectedTable,
  onImport
}: CustomDataHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Custom Data Fields</h1>
      <div className="flex items-center gap-4">
        <ImportExportFields
          fields={currentFields}
          table={selectedTable}
          onImport={onImport}
        />
        <Button onClick={onAddField}>
          <Plus className="w-4 h-4 mr-2" />
          Add Field <span className="ml-2 text-xs text-muted-foreground">(Ctrl+N)</span>
        </Button>
      </div>
    </div>
  );
};

export default CustomDataHeader;
