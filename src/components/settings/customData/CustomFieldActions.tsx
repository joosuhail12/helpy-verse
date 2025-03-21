
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, TestTube } from "lucide-react";
import { useState } from "react";
import { CustomField } from "@/types/customData";
import DeleteCustomFieldDialog from "./DeleteCustomFieldDialog";
import EditCustomFieldDialog from "./EditCustomFieldDialog";
import TestFieldDialog from "./TestFieldDialog";

interface CustomFieldActionsProps {
  field: CustomField;
  table: 'ticket' | 'customer' | 'company';
  existingFields: CustomField[];
}

const CustomFieldActions = ({ field, table, existingFields }: CustomFieldActionsProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);

  // Create a compatible field object that merges both old and new properties
  const compatibleField: CustomField = {
    ...field,
    // Add properties for old CustomField type compatibility
    fieldType: field.fieldType || field.type || 'text',
    isRequired: field.isRequired !== undefined ? field.isRequired : field.required || false,
    placeholder: field.placeholder || '',
    entityType: field.entityType || table,
    defaultValue: field.defaultValue || null,
    options: field.options || null,
    // Add compatibility properties
    type: field.type || field.fieldType,
    required: field.required !== undefined ? field.required : field.isRequired || false,
    createdAt: field.createdAt || new Date().toISOString(),
    updatedAt: field.updatedAt || new Date().toISOString(),
    history: field.history || []
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCustomFieldDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        field={compatibleField}
        table={table}
      />

      <EditCustomFieldDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        field={compatibleField}
        table={table}
        existingFields={existingFields}
      />

      {isTestOpen && (
        <TestFieldDialog
          isOpen={isTestOpen}
          onClose={() => setIsTestOpen(false)}
          field={compatibleField}
        />
      )}
    </>
  );
};

export default CustomFieldActions;
