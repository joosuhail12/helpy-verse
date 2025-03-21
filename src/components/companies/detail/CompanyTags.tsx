
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Tag } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTags } from '@/hooks/useTags';
import { updateCompany } from '@/store/slices/companies/companiesSlice';
import { useToast } from '@/hooks/use-toast';

interface CompanyTagsProps {
  companyId: string;
  tags: string[] | { id: string; name: string; }[];
}

export const CompanyTags = ({ companyId, tags = [] }: CompanyTagsProps) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { data: allTags, isLoading } = useTags();
  const [isOpen, setIsOpen] = useState(false);

  // Normalize tags to handle both string[] and object[] formats
  const normalizedTags = tags.map(tag => 
    typeof tag === 'string' ? tag : tag.id
  );

  const handleTagToggle = async (tagId: string) => {
    const updatedTags = normalizedTags.includes(tagId)
      ? normalizedTags.filter(t => t !== tagId) 
      : [...normalizedTags, tagId];
    
    try {
      await dispatch(updateCompany({
        id: companyId,
        updates: { 
          tags: updatedTags 
        }
      }));
      
      toast({
        title: "Tags updated",
        description: "Company tags have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tags. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsOpen(false);
  };

  // Find tag names for display
  const displayTags = normalizedTags
    .map(tagId => allTags?.find(t => t.id === tagId))
    .filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">Tags</h3>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <PlusCircle className="h-3.5 w-3.5 text-gray-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="end">
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <p className="text-sm text-center py-2 text-gray-500">Loading tags...</p>
              ) : allTags?.length ? (
                allTags.map(tag => (
                  <Button
                    key={tag.id}
                    variant="ghost"
                    className={`w-full justify-start text-left h-8 px-2 ${
                      normalizedTags.includes(tag.id) ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    <Tag className={`h-3.5 w-3.5 mr-2 ${
                      normalizedTags.includes(tag.id) ? 'text-primary' : 'text-gray-400'
                    }`} />
                    <span className="truncate">{tag.name}</span>
                  </Button>
                ))
              ) : (
                <p className="text-sm text-center py-2 text-gray-500">No tags available</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {displayTags.length > 0 ? (
          displayTags.map(tag => tag && (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No tags assigned</p>
        )}
      </div>
    </div>
  );
};
