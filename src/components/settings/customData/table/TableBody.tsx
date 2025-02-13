import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { History, AtSign, CalendarDays, Link2, Phone, Mail, DollarSign, Text, ToggleLeft, FileText, ListFilter, Files, Star, Eye, GripVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomField } from "@/types/customField";
import CustomFieldActions from "../CustomFieldActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import FieldPreview from "../FieldPreview";

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
  onReorder: (oldIndex: number, newIndex: number) => void;
}

const getFieldTypeIcon = (type: CustomField['type']) => {
  switch (type) {
    case 'email':
      return <Mail className="h-4 w-4 text-purple-500" />;
    case 'phone':
      return <Phone className="h-4 w-4 text-indigo-500" />;
    case 'date':
      return <CalendarDays className="h-4 w-4 text-blue-500" />;
    case 'url':
      return <Link2 className="h-4 w-4 text-cyan-500" />;
    case 'currency':
      return <DollarSign className="h-4 w-4 text-emerald-500" />;
    case 'text':
      return <Text className="h-4 w-4 text-teal-500" />;
    case 'boolean':
      return <ToggleLeft className="h-4 w-4 text-green-500" />;
    case 'rich-text':
      return <FileText className="h-4 w-4 text-lime-500" />;
    case 'select':
      return <ListFilter className="h-4 w-4 text-yellow-500" />;
    case 'multi-select':
      return <Files className="h-4 w-4 text-amber-500" />;
    default:
      return <Text className="h-4 w-4 text-slate-500" />;
  }
};

const SortableTableRow = ({ field, index, children, onReorder }: any) => {
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
      <TableCell className="w-[40px] cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-gray-400" />
      </TableCell>
      {children}
    </TableRow>
  );
};

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
    return (
      <TableBody>
        {Array.from({ length: 3 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton className="h-4 w-[20px]" /></TableCell>
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
          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
            {searchQuery ? "No fields match your search criteria." : "No custom fields found. Click the Add Field button to create one."}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody>
        {filteredFields.map((field, index) => (
          <SortableTableRow key={field.id} field={field} index={index} onReorder={onReorder}>
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
                {field.required && (
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
                {getFieldTypeIcon(field.type)}
                <span className="text-sm text-gray-600">{field.type}</span>
              </div>
            </TableCell>
            <TableCell>{field.required ? "Yes" : "No"}</TableCell>
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
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-purple-100/50"
                  onClick={() => setPreviewField(field)}
                >
                  <Eye className="h-4 w-4 text-purple-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-purple-100/50"
                  onClick={() => onHistoryClick(field)}
                >
                  <History className="h-4 w-4 text-purple-500" />
                </Button>
                <CustomFieldActions 
                  field={field} 
                  table={table} 
                  existingFields={fields}
                />
              </div>
            </TableCell>
          </SortableTableRow>
        ))}
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
