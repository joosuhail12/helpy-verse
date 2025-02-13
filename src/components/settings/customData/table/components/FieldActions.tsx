
import { Button } from "@/components/ui/button";
import { Eye, History } from "lucide-react";
import { CustomField } from "@/types/customField";
import CustomFieldActions from "../../CustomFieldActions";

interface FieldActionsProps {
  field: CustomField;
  table: 'tickets' | 'contacts' | 'companies';
  fields: CustomField[];
  onHistoryClick: (field: CustomField) => void;
  onPreviewClick: (field: CustomField) => void;
}

export const FieldActions = ({ field, table, fields, onHistoryClick, onPreviewClick }: FieldActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-purple-100/50"
        onClick={() => onPreviewClick(field)}
      >
        <Eye className="h-4 w-4 text-purple-500" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-purple-100/50"
        onClick={() => onHistoryClick(field)}
      >
        <History className="h-4 w-4 text-purple-500" />
      </Button>
      <CustomFieldActions 
        field={field} 
        table={table} 
        existingFields={fields}
      />
    </div>
  );
};
