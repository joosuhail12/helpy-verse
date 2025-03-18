
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { selectContent, toggleContentSelection } from '@/store/slices/content/contentSlice';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { Content } from '@/types/content';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns';

interface ContentListProps {
  searchQuery: string;
}

export const ContentList = ({ searchQuery }: ContentListProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.content.items);
  const selectedIds = useAppSelector((state) => state.content.selectedIds);
  const filters = useAppSelector((state) => state.content.filters);
  const sort = useAppSelector((state) => state.content.sort);

  const handleSelect = (id: string) => {
    dispatch(toggleContentSelection(id));
  };

  const handleRowClick = (content: Content, event: React.MouseEvent) => {
    // If clicking the checkbox, don't navigate
    if ((event.target as HTMLElement).closest('.checkbox-wrapper')) {
      return;
    }
    dispatch(selectContent(content.id));
    navigate(`/home/automation/ai/content-center/${content.id}`);
  };

  const filteredItems = items.filter(item => {
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    if (filters.chatbot && !item.chatbots?.some(bot => bot.id === filters.chatbot)) {
      return false;
    }
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const sortField = sort.field;
    const sortDirection = sort.direction;

    let comparison = 0;

    if (sortField === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === 'lastUpdated') {
      const dateA = new Date(a.lastUpdated).getTime();
      const dateB = new Date(b.lastUpdated).getTime();
      comparison = dateA - dateB;
    } else if (sortField === 'messageCount') {
      comparison = a.messageCount - b.messageCount;
    } else {
      // Default to lastUpdated
      const dateA = new Date(a.lastUpdated).getTime();
      const dateB = new Date(b.lastUpdated).getTime();
      comparison = dateA - dateB;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="divide-y">
      {sortedItems.map((content) => (
        <div
          key={content.id}
          className="flex items-center gap-4 p-4 hover:bg-accent cursor-pointer"
          onClick={(e) => handleRowClick(content, e)}
        >
          <div className="checkbox-wrapper">
            <Checkbox
              checked={selectedIds.includes(content.id)}
              onCheckedChange={() => handleSelect(content.id)}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold">{content.title}</p>
            <p className="text-sm text-muted-foreground">{content.description}</p>
          </div>
          <div className="text-sm text-muted-foreground w-32 text-right">
            {format(new Date(content.lastUpdated), 'MMM dd, yyyy')}
          </div>
        </div>
      ))}
    </div>
  );
};
