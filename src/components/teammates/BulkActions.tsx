
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { bulkDeactivateTeammates } from "@/store/slices/teammatesSlice";
import { useToast } from "@/hooks/use-toast";
import { UserMinus, Users } from "lucide-react";

interface BulkActionsProps {
  selectedTeammates: string[];
  onClearSelection: () => void;
}

const BulkActions = ({ selectedTeammates, onClearSelection }: BulkActionsProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleBulkDeactivate = async () => {
    try {
      await dispatch(bulkDeactivateTeammates(selectedTeammates)).unwrap();
      toast({
        title: "Success",
        description: `Successfully deactivated ${selectedTeammates.length} teammates.`,
      });
      onClearSelection();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate teammates. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (selectedTeammates.length === 0) return null;

  return (
    <div className="bg-secondary/20 p-4 rounded-lg mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <span className="text-sm font-medium">
          {selectedTeammates.length} teammate{selectedTeammates.length > 1 ? 's' : ''} selected
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleBulkDeactivate}
        >
          <UserMinus className="h-4 w-4 mr-2" />
          Deactivate Selected
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
