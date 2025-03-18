
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, TestTube } from "lucide-react";
import { useState } from "react";
import DeleteCustomObjectsFieldDialog from "./DeleteCustomObjectsFieldDialog";
import EditCustomObjectsFieldDialog from "./EditCustomObjectsFieldDialog";
import { CustomObjectField } from "@/types/customObject";
interface CustomObjectsFieldActionsProps {
  customObjectId: string;
  field: CustomObjectField;
  existingFields: CustomObjectField[];
}

const CustomObjectsFieldsActions = ({ customObjectId, field, existingFields }: CustomObjectsFieldActionsProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);

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

      <DeleteCustomObjectsFieldDialog
        customObjectId={customObjectId}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        field={field}
      />

      <EditCustomObjectsFieldDialog
        customObjectId={customObjectId}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        field={field}
        existingFields={existingFields}
      />
    </>
  );
};

export default CustomObjectsFieldsActions;
