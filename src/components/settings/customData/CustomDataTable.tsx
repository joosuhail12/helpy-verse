
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomField } from "@/types/customField";
import CustomFieldActions from "./CustomFieldActions";
import BulkCustomFieldActions from "./BulkCustomFieldActions";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { History } from "lucide-react";
import FieldHistory from "./FieldHistory";
import SearchField from "./SearchField";

interface CustomDataTableProps {
  fields: CustomField[];
  isLoading: boolean;
  error: any;
  table: 'tickets' | 'contacts' | 'companies';
}

const CustomDataTable = ({ fields, isLoading, error, table }: CustomDataTableProps) => {
  const [selectedFields, setSelectedFields] = useState<CustomField[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<CustomField | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectAll = (checked: boolean) => {
    setSelectedFields(checked ? filteredFields : []);
  };

  const handleSelectField = (field: CustomField, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, field]);
    } else {
      setSelectedFields(selectedFields.filter((f) => f.id !== field.id));
    }
  };

  // Function to check for duplicate field names
  const getDuplicateFields = (fields: CustomField[]): string[] => {
    const fieldNames = fields.map(f => f.name.toLowerCase());
    return fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
  };

  const duplicateFields = getDuplicateFields(fields);

  // Filter fields based on search query
  const filteredFields = fields.filter(field => 
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        <p className="font-medium">Failed to load custom fields</p>
        <p className="text-sm mt-1">Please try again later. If the problem persists, contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <SearchField value={searchQuery} onChange={setSearchQuery} />
        <BulkCustomFieldActions
          selectedFields={selectedFields}
          table={table}
          onSelectionChange={setSelectedFields}
        />
      </div>

      {duplicateFields.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Duplicate field names detected. Please ensure all field names are unique:
                {duplicateFields.map((name, index) => (
                  <span key={index} className="font-medium"> "{name}"{index < duplicateFields.length - 1 ? "," : ""}</span>
                ))}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedFields.length === filteredFields.length && filteredFields.length > 0}
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
            ) : filteredFields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {searchQuery ? "No fields match your search criteria." : "No custom fields found. Click the Add Field button to create one."}
                </TableCell>
              </TableRow>
            ) : (
              filteredFields.map((field) => (
                <TableRow 
                  key={field.id}
                  className={duplicateFields.includes(field.name.toLowerCase()) ? "bg-yellow-50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedFields.some((f) => f.id === field.id)}
                      onCheckedChange={(checked) => handleSelectField(field, checked as boolean)}
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
                        onClick={() => setSelectedHistory(field)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedHistory && (
        <FieldHistory 
          isOpen={true}
          onClose={() => setSelectedHistory(null)}
          history={selectedHistory.history}
        />
      )}
    </div>
  );
};

export default CustomDataTable;
