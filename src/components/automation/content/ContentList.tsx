
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

// Mock data for chatbot content
const mockContent = [
  {
    id: '1',
    title: 'Customer Support Bot',
    description: 'Handles basic customer inquiries and support tickets',
    category: 'support',
    status: 'active',
    lastUpdated: '2024-03-15T10:00:00Z',
    messageCount: 1250,
  },
  {
    id: '2',
    title: 'Sales Assistant',
    description: 'Helps with product recommendations and sales inquiries',
    category: 'sales',
    status: 'draft',
    lastUpdated: '2024-03-14T15:30:00Z',
    messageCount: 850,
  },
  {
    id: '3',
    title: 'Onboarding Guide',
    description: 'Assists new users with platform navigation and setup',
    category: 'onboarding',
    status: 'active',
    lastUpdated: '2024-03-13T09:15:00Z',
    messageCount: 2100,
  },
];

interface ContentListProps {
  searchQuery: string;
}

export const ContentList = ({ searchQuery }: ContentListProps) => {
  const filteredContent = mockContent.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredContent.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
            <Archive className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No Content Found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? "Try adjusting your search terms." : "Start by adding some content for your chatbots."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Content</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Messages</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContent.map((content) => (
            <TableRow key={content.id}>
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
                <Badge variant={content.status === 'active' ? 'default' : 'secondary'}>
                  {content.status}
                </Badge>
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
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
