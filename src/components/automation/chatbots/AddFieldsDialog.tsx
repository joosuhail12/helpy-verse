
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DataCollectionField } from '@/types/chatbot';

interface AddFieldsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tables: { id: string; name: string }[];
  availableFields: { id: string; name: string; type: string; object: string }[];
  onAddFields: (fields: DataCollectionField[]) => void;
  existingFieldIds: string[];
}

export const AddFieldsDialog = ({
  isOpen,
  onClose,
  tables,
  availableFields,
  onAddFields,
  existingFieldIds,
}: AddFieldsDialogProps) => {
  const [selectedTable, setSelectedTable] = useState(tables[0]?.id || '');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // Filter available fields based on selected table
  const availableFieldsForTable = availableFields.filter(
    field => field.object === selectedTable
  );
  
  // Filter out fields that are already selected in the main component
  const selectableFields = availableFieldsForTable.filter(
    field => !existingFieldIds.includes(field.id)
  );

  const handleTableChange = (tableId: string) => {
    setSelectedTable(tableId);
    setSelectedFields([]); // Reset selected fields when table changes
  };

  const toggleFieldSelection = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleAddFields = () => {
    const fieldsToAdd = availableFields
      .filter(field => selectedFields.includes(field.id))
      .map(field => ({
        id: field.id,
        label: field.name,
        type: field.type as any,
        required: false
      }));
    
    onAddFields(fieldsToAdd);
    setSelectedFields([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setSelectedFields([]);
      onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Data Collection Fields</DialogTitle>
          <DialogDescription>
            Select fields to collect from visitors before starting a chat.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="table-select">Select Table</Label>
            <Select 
              value={selectedTable}
              onValueChange={handleTableChange}
            >
              <SelectTrigger id="table-select">
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {tables.map(table => (
                  <SelectItem key={table.id} value={table.id}>
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      {table.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Available Fields</Label>
            {selectableFields.length === 0 ? (
              <div className="text-sm text-gray-500 p-4 text-center border rounded-md">
                No available fields for this table
              </div>
            ) : (
              <ScrollArea className="h-[240px] rounded-md border">
                <div className="p-2">
                  {selectableFields.map(field => (
                    <div
                      key={field.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer mb-1 ${
                        selectedFields.includes(field.id)
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => toggleFieldSelection(field.id)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{field.name}</span>
                        <Badge variant="outline" className="text-xs w-fit mt-1">
                          {field.type}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        {selectedFields.includes(field.id) ? (
                          <Badge className="h-6">Selected</Badge>
                        ) : (
                          <Plus className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="text-sm text-gray-500">
            {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddFields}
              disabled={selectedFields.length === 0}
            >
              Add Selected Fields
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
