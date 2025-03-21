
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Bot, RefreshCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContentStatus, reassignChatbot, deleteContent, clearSelection } from '@/store/slices/content/contentSlice';
import type { ContentStatus } from '@/types/content';

interface ContentBatchActionsProps {
  selectedIds: string[];
}

export const ContentBatchActions = ({ selectedIds }: ContentBatchActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ContentStatus>('queued');
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleDelete = useCallback(() => {
    dispatch(deleteContent(selectedIds));
    setShowDeleteDialog(false);
    dispatch(clearSelection());
    toast({
      title: "Content deleted",
      description: `Successfully deleted ${selectedIds.length} content items`,
    });
  }, [selectedIds, dispatch, toast]);

  const handleStatusChange = useCallback(() => {
    dispatch(updateContentStatus({ ids: selectedIds, status: newStatus }));
    setShowStatusDialog(false);
    dispatch(clearSelection());
    toast({
      title: "Status updated",
      description: `Updated status for ${selectedIds.length} content items`,
    });
  }, [selectedIds, newStatus, dispatch, toast]);

  const handleReassign = useCallback((chatbotId: string, chatbotName: string) => {
    dispatch(reassignChatbot({ ids: selectedIds, chatbotId, chatbotName }));
    setShowReassignDialog(false);
    dispatch(clearSelection());
    toast({
      title: "Chatbot reassigned",
      description: `Reassigned ${selectedIds.length} content items`,
    });
  }, [selectedIds, dispatch, toast]);

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-950 shadow-lg rounded-lg px-6 py-4 border flex items-center gap-4 z-50">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {selectedIds.length} items selected
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowStatusDialog(true)}
      >
        <RefreshCcw className="h-4 w-4 mr-2" />
        Change Status
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowReassignDialog(true)}
      >
        <Bot className="h-4 w-4 mr-2" />
        Reassign Chatbot
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Selected
      </Button>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIds.length} content items? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Content Status</DialogTitle>
            <DialogDescription>
              Select a new status for the {selectedIds.length} selected content items.
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={(value: ContentStatus) => setNewStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="queued">Queued</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reassign Dialog */}
      <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign to Chatbot</DialogTitle>
            <DialogDescription>
              Select a chatbot to reassign the {selectedIds.length} selected content items.
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={(value) => {
            const [id, name] = value.split('|');
            handleReassign(id, name);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select chatbot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chatbot1|General Assistant">General Assistant</SelectItem>
              <SelectItem value="chatbot2|Sales Bot">Sales Bot</SelectItem>
              <SelectItem value="chatbot3|Support Agent">Support Agent</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReassignDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

