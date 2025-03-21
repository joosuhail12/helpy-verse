import { Table } from "@/components/ui/table";
import { CustomField } from "@/types/customField";
import BulkCustomFieldActions from "./BulkCustomFieldActions";
import { useState, useEffect } from "react";
import FieldHistory from "./FieldHistory";
import SearchField from "./SearchField";
import TableHeaderComponent from "./table/TableHeader";
import TableBodyComponent from "./table/TableBody";
import DuplicateFieldsWarning from "./DuplicateFieldsWarning";
import { getDuplicateFields, filterFields } from "./utils/fieldUtils";
import { useCustomFieldShortcuts } from "@/hooks/useCustomFieldShortcuts";
import { useFieldCache } from "@/hooks/useFieldCache";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CustomDataTableProps {
  table: 'tickets' | 'contacts' | 'companies';
  currentFields?: CustomField[];
  isLoading?: boolean;
  error?: any;
}

export const CustomDataTable = ({ table, currentFields = [], isLoading = false, error }: CustomDataTableProps) => {
  const [selectedFields, setSelectedFields] = useState<CustomField[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<CustomField | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { fields, isLoading: fieldLoading, error: fieldError, updateField, isUpdating } = useFieldCache(table);
  const [items, setItems] = useState<CustomField[]>(currentFields || []);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update items when fields change
  useEffect(() => {
    setItems(fields);
  }, [fields]);

  const duplicateFields = getDuplicateFields(fields);
  const filteredFields = filterFields(items, searchQuery);

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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Notify about the reorder
        toast({
          title: "Fields reordered",
          description: "The field order has been updated.",
          duration: 2000,
        });
        
        return newItems;
      });
    }
  };

  useCustomFieldShortcuts({
    onCreateField: () => {}, // This is handled at the parent level
    hasSelection: selectedFields.length > 0
  });

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

      <DuplicateFieldsWarning duplicateFields={duplicateFields} />

      <div className="rounded-md border relative">
        {(isLoading || isUpdating) && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeaderComponent
              filteredFields={filteredFields}
              selectedFields={selectedFields}
              onSelectAll={handleSelectAll}
            />
            <SortableContext
              items={filteredFields}
              strategy={verticalListSortingStrategy}
            >
              <TableBodyComponent
                isLoading={isLoading}
                filteredFields={filteredFields}
                selectedFields={selectedFields}
                duplicateFields={duplicateFields}
                searchQuery={searchQuery}
                table={table}
                fields={fields}
                onSelectField={handleSelectField}
                onHistoryClick={setSelectedHistory}
                onReorder={handleDragEnd}
              />
            </SortableContext>
          </Table>
        </DndContext>
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
