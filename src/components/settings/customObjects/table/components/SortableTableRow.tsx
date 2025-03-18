
import { TableRow, TableCell } from "@/components/ui/table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { CustomObjectField } from "@/types/customObject";

interface SortableTableRowProps {
  field: CustomObjectField;
  children: React.ReactNode;
}

export const SortableTableRow = ({ field, children }: SortableTableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      {/* <TableCell className="w-[40px] cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-gray-400" />
      </TableCell> */}
      {children}
    </TableRow>
  );
};
