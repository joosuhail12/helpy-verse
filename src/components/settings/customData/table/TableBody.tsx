
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomField } from "@/types/customField";
import CustomFieldActions from "../CustomFieldActions";

interface TableBodyProps {
  isLoading: boolean;
  filteredFields: CustomField[];
  selectedFields: CustomField[];
  duplicateFields: string[];
  searchQuery: string;
  table: 'tickets' | 'contacts' | 'companies';
  fields: CustomField[];
  onSelectField: (field: CustomField, checked: boolean) => void;
  onHistoryClick: (field: CustomField) => void;
}

const TableBodyComponent = ({
  isLoading,
  filteredFields,
  selectedFields,
  duplicateFields,
  searchQuery,
  table,
  fields,
  onSelectField,
  onHistoryClick
}: TableBodyProps) => {
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 3 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className="h-4 w-[20px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (filteredFields.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
            {searchQuery ? "No fields match your search criteria." : "No custom fields found. Click the Add Field button to create one."}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {filteredFields.map((field) => (
        <TableRow 
          key={field.id}
          className={duplicateFields.includes(field.name.toLowerCase()) ? "bg-yellow-50" : ""}
        >
          <TableCell>
            <Checkbox
              checked={selectedFields.some((f) => f.id === field.id)}
              onCheckedChange={(checked) => onSelectField(field, checked as boolean)}
              aria-label={`Select ${field.name}`}
            />
          </TableCell>
          <TableCell className="font-medium">
            {field.name}
            {duplicateFields.includes(field.name.toLowerCase()) && (
              <span className="ml-2 text-yellow-600 text-sm">(Duplicate)</span>
            )}
          </TableCell>
          <TableCell>{field.type}</TableCell>
          <TableCell>{field.required ? "Yes" : "No"}</TableCell>
          <TableCell>{field.description}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onHistoryClick(field)}
              >
                <History className="h-4 w-4" />
              </Button>
              <CustomFieldActions 
                field={field} 
                table={table} 
                existingFields={fields}
              />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TableBodyComponent;
