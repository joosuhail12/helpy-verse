
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomObjectField } from "@/types/customObject";

interface TableHeaderProps {
  filteredFields: CustomObjectField[];
  selectedFields: CustomObjectField[];
  onSelectAll: (checked: boolean) => void;
}

const TableHeaderComponent = ({ filteredFields, selectedFields, onSelectAll }: TableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="bg-purple-50/50 hover:bg-purple-50">
        <TableHead className="w-[50px]">
          <Checkbox
            checked={selectedFields.length === filteredFields.length && filteredFields.length > 0}
            onCheckedChange={onSelectAll}
            aria-label="Select all"
          />
        </TableHead>
        <TableHead className="font-semibold text-purple-900">Field Name</TableHead>
        <TableHead className="font-semibold text-purple-900">Type</TableHead>
        <TableHead className="font-semibold text-purple-900">Required</TableHead>
        <TableHead className="font-semibold text-purple-900">Description</TableHead>
        <TableHead className="text-right font-semibold text-purple-900">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TableHeaderComponent;
