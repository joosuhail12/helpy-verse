
import { useState, useEffect, useRef } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Search, Clock, X } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setSearchQuery, updateSearchSuggestions, clearSearch, clearSearchHistory } from '@/store/slices/content/contentSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { query, suggestions, history } = useAppSelector((state) => state.content.search);
  const filters = useAppSelector((state) => state.content.filters);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(updateSearchSuggestions());
    }
  }, [debouncedQuery, dispatch]);

  const handleSelect = (value: string) => {
    dispatch(setSearchQuery(value));
    setOpen(false);
  };

  const handleClear = () => {
    dispatch(clearSearch());
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleClearHistory = () => {
    dispatch(clearSearchHistory());
  };

  // Get active filters count
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="relative w-full max-w-xl">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white dark:bg-gray-950"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <span className="truncate">
                {query || "Search content..."}
              </span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                </Badge>
              )}
            </div>
            {query && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Type to search..."
              value={query}
              onValueChange={(value) => dispatch(setSearchQuery(value))}
            />
            <CommandList>
              <ScrollArea className="h-[300px]">
                <CommandEmpty>No results found.</CommandEmpty>
                {suggestions.length > 0 && (
                  <CommandGroup heading="Suggestions">
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        value={suggestion}
                        onSelect={() => handleSelect(suggestion)}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {history.length > 0 && (
                  <CommandGroup heading="Recent Searches">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-sm text-muted-foreground">Recent searches</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        onClick={handleClearHistory}
                      >
                        Clear history
                      </Button>
                    </div>
                    {history.map((item) => (
                      <CommandItem
                        key={item}
                        value={item}
                        onSelect={() => handleSelect(item)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {item}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

