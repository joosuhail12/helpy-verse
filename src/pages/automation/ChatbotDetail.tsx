
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectChatbots } from '@/store/slices/chatbots/chatbotsSlice';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ChatbotDetail = () => {
  const { id } = useParams();
  const chatbots = useAppSelector(selectChatbots);
  const chatbot = chatbots.find(bot => bot.id === id);

  if (!chatbot) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Chatbot not found</h1>
        <Link to="/home/automation/ai/chatbot-profiles">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chatbots
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">{chatbot.name}</h1>
          <p className="text-muted-foreground">{chatbot.description}</p>
        </div>
        <Link to="/home/automation/ai/chatbot-profiles">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chatbots
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="text-lg font-semibold">Basic Information</CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={chatbot.status === 'active' ? 'success' : 'secondary'}>
                {chatbot.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tone</p>
              <p>{chatbot.tone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p>{new Date(chatbot.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-lg font-semibold">Messages</CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Welcome Message</p>
              <p>{chatbot.welcomeMessage}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Human Handoff Message</p>
              <p>{chatbot.humanHandoffMessage}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-lg font-semibold">Behavior Settings</CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Query Handling</p>
              <p className="capitalize">{chatbot.behavior.queryHandling}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Post Answer Action</p>
              <p className="capitalize">{chatbot.behavior.postAnswerAction}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactivity Timeout</p>
              <p>{chatbot.behavior.inactivityTimeout} minutes</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactivity Action</p>
              <p className="capitalize">{chatbot.behavior.inactivityAction}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-lg font-semibold">Data Collection</CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={chatbot.dataCollection.enabled ? 'success' : 'secondary'}>
                {chatbot.dataCollection.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            {chatbot.dataCollection.enabled && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Required Fields</p>
                <ul className="list-disc pl-4 space-y-1">
                  {chatbot.dataCollection.fields.map((field) => (
                    <li key={field.id}>
                      {field.label} ({field.type})
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotDetail;
