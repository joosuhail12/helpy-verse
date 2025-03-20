
import { TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import { CustomObjectField } from "@/types/customObject";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { getFieldTypeIcon } from "./components/FieldTypeIcon";
import { SortableTableRow } from "./components/SortableTableRow";
import { TableLoadingState } from "./components/TableLoadingState";
import { FieldActions } from "./components/FieldActions";

interface TableBodyProps {
  customObjectId: string;
  isLoading: boolean;
  filteredFields: CustomObjectField[];
  selectedFields: CustomObjectField[];
  searchQuery: string;
  fields: CustomObjectField[];
  onSelectField: (field: CustomObjectField, checked: boolean) => void;
  onHistoryClick: (field: CustomObjectField) => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

const TableBodyComponent = ({
  customObjectId,
  isLoading,
  filteredFields,
  selectedFields,
  searchQuery,
  fields,
  onSelectField,
  onHistoryClick,
  onReorder
}: TableBodyProps) => {
  const [previewField, setPreviewField] = useState<CustomObjectField | null>(null);

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

  return (
    <>
      <TableBody>
        {filteredFields.map((field) => (
          <SortableTableRow key={field.id} field={field}>
            <TableCell>
              <Checkbox
                checked={selectedFields.some((f) => f.id === field.id)}
                onCheckedChange={(checked) => onSelectField(field, checked as boolean)}
                aria-label={`Select ${field.name}`}
              />
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {field.name}
                {field.isRequired && (
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
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getFieldTypeIcon(field.fieldType)}
                <span className="text-sm text-gray-600">{field.fieldType}</span>
              </div>
            </TableCell>
            <TableCell>{field.isRequired ? "Yes" : "No"}</TableCell>
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
                customObjectId={customObjectId}
                field={field}
                fields={fields}
                onHistoryClick={onHistoryClick}
                onPreviewClick={setPreviewField}
              />
            </TableCell>
          </SortableTableRow>
        ))}
      </TableBody>
    </>
  );
};

export default TableBodyComponent;
