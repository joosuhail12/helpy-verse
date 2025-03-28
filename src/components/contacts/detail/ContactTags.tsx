
import { useState } from 'react';
import { Tag, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectAllTags } from '@/store/slices/tags/tagsSlice';

interface ContactTagsProps {
  contactTags: string[];
  onAddTag: (tagId: string) => void;
  onRemoveTag: (tagId: string) => void;
}

export const ContactTags = ({ contactTags, onAddTag, onRemoveTag }: ContactTagsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const tags = useAppSelector(selectAllTags) || [];
  
  // Filter tags that are not already assigned to the contact
  const availableTags = tags.filter(tag => !contactTags.includes(tag.id));
  
  // Filter available tags based on search query
  const filteredTags = searchQuery
    ? availableTags.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableTags;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tags</h3>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <h4 className="font-medium">Add Tags</h4>
              <p className="text-sm text-muted-foreground">
                Select tags to add to this contact.
              </p>
              <Input
                placeholder="Search tags..."
                className="mt-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-80 overflow-auto p-4">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between py-2 hover:bg-muted px-2 rounded cursor-pointer"
                    onClick={() => onAddTag(tag.id)}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span>{tag.name}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      Add
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No tags found
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-2">
        {contactTags.length > 0 ? (
          tags
            .filter(tag => contactTags.includes(tag.id))
            .map((tag) => (
              <Badge
                key={tag.id}
                className="flex items-center gap-1 px-3 py-1"
                style={{ backgroundColor: tag.color, color: '#fff' }}
              >
                <Tag className="h-3 w-3" />
                {tag.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 text-white hover:bg-transparent"
                  onClick={() => onRemoveTag(tag.id)}
                >
                  &times;
                </Button>
              </Badge>
            ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No tags assigned to this contact
          </div>
        )}
      </div>
    </div>
  );
};
