
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomField } from "@/types/customField";
import CustomFieldActions from "./CustomFieldActions";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomDataTableProps {
  fields: CustomField[];
  isLoading: boolean;
  error: any;
  table: 'tickets' | 'contacts' | 'companies';
}

const CustomDataTable = ({ fields, isLoading, error, table }: CustomDataTableProps) => {
  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg">
        Failed to load custom fields. Please try again later.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              </TableRow>
            ))
          ) : fields.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No custom fields found. Click the Add Field button to create one.
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field) => (
              <TableRow key={field.id}>
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
  );
};

export default CustomDataTable;
