import { Check, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { 
  setStatusFilter, 
  setCategoryFilter, 
  setChatbotFilter,
  clearFilters,
} from '@/store/slices/content/contentSlice';
import type { ContentStatus } from '@/types/content';
import { mockContentCategories } from '@/mock/contentCategories';
import { mockChatbots } from '@/mock/chatbots';

export const ContentFilters = () => {
  const dispatch = useAppDispatch();
  const contentState = useAppSelector((state) => state.content);
  const filters = contentState?.filters || {};

  const statuses: ContentStatus[] = ['completed', 'processing', 'queued', 'failed', 'active', 'inactive', 'draft'];

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const renderFilterBadges = () => {
    const badges = [];

    if (filters.status) {
      badges.push(
        <Badge
          key="status"
          variant="secondary"
          className="gap-1"
        >
          Status: {filters.status}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => dispatch(setStatusFilter(null))}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.category) {
      badges.push(
        <Badge
          key="category"
          variant="secondary"
          className="gap-1"
        >
          Category: {filters.category}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => dispatch(setCategoryFilter(null))}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (filters.chatbot) {
      const chatbot = mockChatbots.find(c => c.id === filters.chatbot);
      badges.push(
        <Badge
          key="chatbot"
          variant="secondary"
          className="gap-1"
        >
          Chatbot: {chatbot?.name}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => dispatch(setChatbotFilter(null))}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    return badges;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Status <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => dispatch(setStatusFilter(status))}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    filters.status === status ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Category <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {mockContentCategories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => dispatch(setCategoryFilter(category.name))}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    filters.category === category.name ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Chatbot <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {mockChatbots.map((chatbot) => (
              <DropdownMenuItem
                key={chatbot.id}
                onClick={() => dispatch(setChatbotFilter(chatbot.id))}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    filters.chatbot === chatbot.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {chatbot.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {renderFilterBadges().length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {renderFilterBadges()}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};
