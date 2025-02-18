
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectChatbots, selectChatbotsLoading } from '@/store/slices/chatbots/chatbotsSlice';

export const ChatbotList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const chatbots = useAppSelector(selectChatbots);
  const isLoading = useAppSelector(selectChatbotsLoading);

  const filteredChatbots = chatbots.filter(chatbot =>
    chatbot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chatbot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chatbots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => navigate('/home/automation/ai/chatbot-profiles/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Chatbot
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading chatbots...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChatbots.map((chatbot) => (
              <TableRow
                key={chatbot.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/home/automation/ai/chatbot-profiles/${chatbot.id}`)}
              >
                <TableCell className="font-medium">{chatbot.name}</TableCell>
                <TableCell>{chatbot.description}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    chatbot.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {chatbot.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(chatbot.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

