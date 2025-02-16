
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bot, Archive, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
      <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
              <Archive className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Content Found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery ? "Try adjusting your search terms." : "Start by adding some content for your chatbots."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredContent.map((content) => (
        <Card key={content.id} className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-lg font-semibold">{content.title}</CardTitle>
              </div>
              <Badge variant={content.status === 'active' ? 'default' : 'secondary'}>
                {content.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{content.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>{content.messageCount.toLocaleString()} messages</span>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-600">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
