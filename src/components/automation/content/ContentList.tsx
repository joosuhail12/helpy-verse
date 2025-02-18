import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Bot, MessageSquare, Settings, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { type Content } from '@/types/content';
import { useAppSelector } from '@/hooks/useAppSelector';

interface ContentListProps {
  searchQuery: string;
}

const getStatusColor = (status: Content['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'processing':
      return 'bg-blue-500';
    case 'queued':
      return 'bg-yellow-500';
    case 'failed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const ContentList = ({ searchQuery }: ContentListProps) => {
  const { items, filters, sort } = useAppSelector((state) => state.content);

  const filteredContent = items
    .filter(content => {
      const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !filters.status || content.status === filters.status;
      const matchesCategory = !filters.category || content.category === filters.category;
      const matchesChatbot = !filters.chatbotId || content.chatbot?.id === filters.chatbotId;

      return matchesSearch && matchesStatus && matchesCategory && matchesChatbot;
    })
    .sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      switch (sort.field) {
        case 'lastUpdated':
          return direction * (new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());
        case 'messageCount':
          return direction * (a.messageCount - b.messageCount);
        case 'title':
          return direction * a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  if (filteredContent.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
            <Archive className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No Content Found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery || Object.values(filters).some(Boolean)
              ? "Try adjusting your search terms or filters."
              : "Start by adding some content for your chatbots."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Content</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Chatbot</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Messages</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredContent.map((content) => (
          <TableRow key={content.id} className="group hover:bg-muted/50">
            <TableCell>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Bot className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="font-medium">{content.title}</div>
                  <div className="text-sm text-gray-500">{content.description}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="capitalize">
                {content.category}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-600">{content.chatbot?.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(content.status)}`} />
                  <span className="text-sm capitalize">{content.status}</span>
                </div>
                {content.status === 'processing' && content.progress && (
                  <Progress value={content.progress} className="h-1" />
                )}
                {content.status === 'failed' && content.errorMessage && (
                  <p className="text-xs text-red-500">{content.errorMessage}</p>
                )}
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(content.lastUpdated), 'MMM d, yyyy')}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>{content.messageCount.toLocaleString()}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
