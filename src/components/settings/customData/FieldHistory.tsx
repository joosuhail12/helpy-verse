
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import type { FieldHistoryEntry } from "@/types/customField";

interface FieldHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: FieldHistoryEntry[];
}

const FieldHistory = ({ isOpen, onClose, history }: FieldHistoryProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Field History</DialogTitle>
          <DialogDescription>
            View the complete history of changes made to this field
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    {entry.userName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(entry.timestamp), "PPpp")}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  {entry.action === "created" && "Created field"}
                  {entry.action === "updated" && "Updated field"}
                  {entry.action === "deleted" && "Deleted field"}
                </div>
                {entry.changes && entry.changes.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {entry.changes.map((change, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{change.field}:</span>{" "}
                        <span className="text-red-500 line-through">
                          {change.oldValue}
                        </span>{" "}
                        →{" "}
                        <span className="text-green-500">
                          {change.newValue}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FieldHistory;
