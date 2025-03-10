
import * as React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryCombobox({ value, onChange }: CategoryComboboxProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");

  const categories = [
    {
      id: "1",
      name: "greeting",
    },
    {
      id: "2",
      name: "support",
    },
    {
      id: "3",
      name: "closing",
    },
    {
      id: "4",
      name: "technical",
    },
  ]

  const handleCreateCategory = () => {
    if (newCategory.trim()) {
      onChange(newCategory.trim());
      setNewCategory("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateCategory();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            {/* <Button onClick={handleCreateCategory}>
              Add Category
            </Button> 
            // TODO: Uncomment this line after implementing handleCreateCategory function
            */}


          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
