
import { TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import { CustomField } from "@/types/customData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import FieldPreview from "../FieldPreview";
import { getFieldTypeIcon } from "./components/FieldTypeIcon";
import { SortableTableRow } from "./components/SortableTableRow";
import { TableLoadingState } from "./components/TableLoadingState";
import { FieldActions } from "./components/FieldActions";

interface TableBodyProps {
  isLoading: boolean;
  filteredFields: CustomField[];
  selectedFields: CustomField[];
  duplicateFields: string[];
  searchQuery: string;
  table: 'ticket' | 'customer' | 'company';
  fields: CustomField[];
  onSelectField: (field: CustomField, checked: boolean) => void;
  onHistoryClick: (field: CustomField) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
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
  onHistoryClick,
  onReorder
}: TableBodyProps) => {
  const [previewField, setPreviewField] = useState<CustomField | null>(null);

  if (isLoading) {
    return <TableLoadingState />;
  }

  if (filteredFields.length === 0) {
    return (
      <TableBody>
        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
          {searchQuery ? "No fields match your search criteria." : "No custom fields found. Click the Add Field button to create one."}
        </TableCell>
      </TableBody>
    );
  }

  // Function to create compatible field objects
  const createCompatibleField = (field: CustomField): CustomField => {
    return {
      ...field,
      // Ensure both old and new properties are present
      fieldType: field.fieldType || field.type || 'text',
      isRequired: field.isRequired !== undefined ? field.isRequired : field.required || false,
      placeholder: field.placeholder || '',
      entityType: field.entityType || table,
      defaultValue: field.defaultValue || null,
      options: field.options || null,
      // Add backward compatibility properties
      type: field.type || field.fieldType,
      required: field.required !== undefined ? field.required : field.isRequired || false,
      createdAt: field.createdAt || new Date().toISOString(),
      updatedAt: field.updatedAt || new Date().toISOString(),
      history: field.history || []
    };
  };

  return (
    <>
      <TableBody>
        {filteredFields.map((field) => {
          const compatibleField = createCompatibleField(field);
          
          return (
            <SortableTableRow key={field.id} field={compatibleField}>
              <TableCell>
                <Checkbox
                  checked={selectedFields.some((f) => f.id === field.id)}
                  onCheckedChange={(checked) => onSelectField(compatibleField, checked as boolean)}
                  aria-label={`Select ${field.name}`}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {field.name}
                  {(field.isRequired || field.required) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Star className="h-3 w-3 text-purple-500 fill-purple-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Required Field</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {duplicateFields.includes(field.name.toLowerCase()) && (
                    <span className="ml-2 text-yellow-600 text-sm">(Duplicate)</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFieldTypeIcon(field.fieldType || field.type)}
                  <span className="text-sm text-gray-600">{field.fieldType || field.type}</span>
                </div>
              </TableCell>
              <TableCell>{(field.isRequired || field.required) ? "Yes" : "No"}</TableCell>
              <TableCell>
                {field.description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-left">
                        <span className="line-clamp-1 text-sm text-gray-600">
                          {field.description}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px]">
                        <p>{field.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell className="text-right">
                <FieldActions
                  field={compatibleField}
                  table={table}
                  fields={fields.map(createCompatibleField)}
                  onHistoryClick={onHistoryClick}
                  onPreviewClick={setPreviewField}
                />
              </TableCell>
            </SortableTableRow>
          );
        })}
      </TableBody>
      {previewField && (
        <FieldPreview
          isOpen={true}
          onClose={() => setPreviewField(null)}
          field={previewField}
        />
      )}
    </>
  );
};

export default TableBodyComponent;
