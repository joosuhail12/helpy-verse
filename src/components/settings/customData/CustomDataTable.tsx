
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomField } from "@/types/customField";
import CustomFieldActions from "./CustomFieldActions";
import BulkCustomFieldActions from "./BulkCustomFieldActions";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface CustomDataTableProps {
  fields: CustomField[];
  isLoading: boolean;
  error: any;
  table: 'tickets' | 'contacts' | 'companies';
}

const CustomDataTable = ({ fields, isLoading, error, table }: CustomDataTableProps) => {
  const [selectedFields, setSelectedFields] = useState<CustomField[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedFields(checked ? fields : []);
  };

  const handleSelectField = (field: CustomField, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, field]);
    } else {
      setSelectedFields(selectedFields.filter((f) => f.id !== field.id));
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        Failed to load custom fields. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <BulkCustomFieldActions
          selectedFields={selectedFields}
          table={table}
          onSelectionChange={setSelectedFields}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedFields.length === fields.length && fields.length > 0}
                  onCheckedChange={handleSelectAll}
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
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[20px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                </TableRow>
              ))
            ) : fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No custom fields found. Click the Add Field button to create one.
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedFields.some((f) => f.id === field.id)}
                      onCheckedChange={(checked) => handleSelectField(field, checked as boolean)}
                      aria-label={`Select ${field.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>{field.type}</TableCell>
                  <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                  <TableCell>{field.description}</TableCell>
                  <TableCell className="text-right">
                    <CustomFieldActions field={field} table={table} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomDataTable;
