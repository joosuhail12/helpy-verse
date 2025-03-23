
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { SortingControls } from "@/components/inbox/SortingControls";

interface TagListControlsProps {
  onCreateTag: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const TagListControls = ({ onCreateTag, searchQuery, onSearchChange }: TagListControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between">
      <div className="flex flex-1 items-center">
        <Input 
          placeholder="Search tags..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="flex gap-2">
        <SortingControls />
        <Button onClick={onCreateTag}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tag
        </Button>
      </div>
    </div>
  );
};

export default TagListControls;
