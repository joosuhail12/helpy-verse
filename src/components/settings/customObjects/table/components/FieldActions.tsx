
import { Button } from "@/components/ui/button";
import { Eye, History } from "lucide-react";
import { CustomObjectField } from "@/types/customObject";
import CustomObjectsFieldActions from "../../CustomFieldActions";

interface FieldActionsProps {
  customObjectId: string;
  field: CustomObjectField;
  fields: CustomObjectField[];
  onHistoryClick: (field: CustomObjectField) => void;
  onPreviewClick: (field: CustomObjectField) => void;
}

export const FieldActions = ({ customObjectId, field, fields, onHistoryClick, onPreviewClick }: FieldActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      {/* 
        TODO: Implement the following buttons
      
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
      </Button> */}
      <CustomObjectsFieldActions
        customObjectId={customObjectId}
        field={field}
        existingFields={fields}
      />
    </div>
  );
};
