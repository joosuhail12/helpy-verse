
import * as React from "react";
import { ArrowDown, ArrowUp, CheckIcon, PlusCircle } from "lucide-react";
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
import type { Category } from "@/mock/categories";

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryCombobox({ value = "", onChange }: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [categories] = React.useState<Category[]>(mockCategories);
  const [search, setSearch] = React.useState("");
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const filteredCategories = React.useMemo(() => {
    const searchTerm = search.toLowerCase();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm)
    );
  }, [categories, search]);

  const handleSelect = React.useCallback((selectedValue: string) => {
    if (selectedValue === "add-new" && search.trim()) {
      const newValue = search.trim();
      setInternalValue(newValue);
      onChange(newValue);
    } else {
      setInternalValue(selectedValue);
      onChange(selectedValue);
    }
    setOpen(false);
  }, [search, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {internalValue || "Select category..."}
          <div className="flex ml-2 h-4 w-4 shrink-0 opacity-50">
            {open ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command value={internalValue} onValueChange={handleSelect}>
          <CommandInput
            placeholder="Search or add category..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty className="py-2">
            {search.trim() && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSelect("add-new")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add "{search.trim()}"
              </Button>
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {filteredCategories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={handleSelect}
                className="cursor-pointer"
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    internalValue === category.name ? "opacity-100" : "opacity-0"
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

