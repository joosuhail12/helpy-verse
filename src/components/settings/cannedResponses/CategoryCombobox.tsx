
import * as React from "react";
import { CaretSortIcon, CheckIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { mockCategories } from "@/mock/categories";

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryCombobox({ value, onChange }: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState(mockCategories);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (currentValue: string) => {
    if (currentValue === "add-new" && inputValue) {
      const newCategory = {
        id: (categories.length + 1).toString(),
        name: inputValue,
      };
      setCategories([...categories, newCategory]);
      onChange(inputValue);
    } else {
      onChange(currentValue);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? categories.find((category) => category.name === value)?.name || value
            : "Select category..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search or add category..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty className="p-2">
            {inputValue && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSelect("add-new")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add "{inputValue}"
              </Button>
            )}
          </CommandEmpty>
          <CommandGroup>
            {categories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={handleSelect}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === category.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {category.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
