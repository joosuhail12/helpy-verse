
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Tag } from '@/types/tag';

interface TagPreviewItemsProps {
  items: Tag['preview'];
}

const TagPreviewItems = ({ items }: TagPreviewItemsProps) => {
  if (items.length === 0) return null;

  return (
    <div className="flex gap-2">
      {items.map((item) => (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={`px-2 py-1 rounded text-xs
                  ${item.type === 'ticket' ? 'bg-blue-100 text-blue-800' : 
                    item.type === 'contact' ? 'bg-purple-100 text-purple-800' : 
                    'bg-green-100 text-green-800'}`}
              >
                {item.title}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default TagPreviewItems;

