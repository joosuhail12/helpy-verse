
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomField } from "@/types/customField";

interface TableHeaderProps {
  filteredFields: CustomField[];
  selectedFields: CustomField[];
  onSelectAll: (checked: boolean) => void;
}

const TableHeaderComponent = ({ filteredFields, selectedFields, onSelectAll }: TableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <Checkbox
            checked={selectedFields.length === filteredFields.length && filteredFields.length > 0}
            onCheckedChange={onSelectAll}
            aria-label="Select all"
          />
        </TableHead>
        <TableHead>Field Name</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Required</TableHead>
        <TableHead>Description</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TableHeaderComponent;
