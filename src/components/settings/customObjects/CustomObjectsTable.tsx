import { Table } from "@/components/ui/table";
import { useState, useEffect } from "react";
import TableHeaderComponent from "./table/TableHeader";
import TableBodyComponent from "./table/TableBody";
// import DuplicateFieldsWarning from "./DuplicateFieldsWarning";
import { filterFields } from "./utils/customObjectUtils";
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
import { CustomObjectField } from "@/types/customObject";
import SearchField from "./SearchField";

interface CustomObjectsTableProps {
    customObjectId: string;
    currentFields?: CustomObjectField[];
    isLoading?: boolean;
    error?: any;
}

export const CustomObjectsTable = ({ customObjectId, currentFields = [], isLoading = false, error }: CustomObjectsTableProps) => {
    const [selectedFields, setSelectedFields] = useState<CustomObjectField[]>([]);
    const [selectedHistory, setSelectedHistory] = useState<CustomObjectField | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [items, setItems] = useState<CustomObjectField[]>(currentFields || []);
    const { toast } = useToast();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Update items when fields change
    useEffect(() => {
        setItems(currentFields);
    }, [currentFields]);

    // const duplicateFields = getDuplicateFields(currentFields);
    const filteredFields = filterFields(items, searchQuery);

    const handleSelectAll = (checked: boolean) => {
        setSelectedFields(checked ? filteredFields : []);
    };

    const handleSelectField = (field: CustomObjectField, checked: boolean) => {
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
        onCreateField: () => { }, // This is handled at the parent level
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
                {/* <BulkCustomFieldActions
          selectedFields={selectedFields}
          table={table}
          onSelectionChange={setSelectedFields}
        />
          TODO: Implement BulkCustomFieldActions component
        */}
            </div>

            {/* <DuplicateFieldsWarning duplicateFields={duplicateFields} /> */}

            <div className="rounded-md border relative">
                {(isLoading) && (
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
                                customObjectId={customObjectId}
                                isLoading={isLoading}
                                filteredFields={filteredFields}
                                selectedFields={selectedFields}
                                searchQuery={searchQuery}
                                fields={currentFields}
                                onSelectField={handleSelectField}
                                onHistoryClick={setSelectedHistory}
                                onReorder={handleDragEnd}
                            />
                        </SortableContext>
                    </Table>
                </DndContext>
            </div>

            {/* {selectedHistory && (
        <FieldHistory
          isOpen={true}
          onClose={() => setSelectedHistory(null)}
          history={selectedHistory.history}
        />
      )}
        TODO: Implement FieldHistory component
      */}
        </div>
    );
};

export default CustomObjectsTable;
