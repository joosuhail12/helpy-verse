
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { CustomField } from "@/types/customField";
import DeleteCustomFieldDialog from "./DeleteCustomFieldDialog";
import EditCustomFieldDialog from "./EditCustomFieldDialog";

interface CustomFieldActionsProps {
  field: CustomField;
  table: 'tickets' | 'contacts' | 'companies';
}

const CustomFieldActions = ({ field, table }: CustomFieldActionsProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

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
        field={field}
        table={table}
      />
      
      <EditCustomFieldDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        field={field}
        table={table}
      />
    </>
  );
};

export default CustomFieldActions;
