
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createChatbot } from '@/store/slices/chatbots/chatbotsSlice';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { BasicInformation } from './form/BasicInformation';
import { ToneSelection } from './form/ToneSelection';
import { MessageConfiguration } from './form/MessageConfiguration';
import { BehaviorSettings } from './form/BehaviorSettings';
import type { ChatbotTone, DataCollectionField } from '@/types/chatbot';

interface CreateChatbotFormValues {
  name: string;
  persona: string;
  avatarUrl: string;
  tone: ChatbotTone;
  customInstructions: string;
  welcomeMessage: string;
  humanHandoffMessage: string;
  dataCollection: {
    enabled: boolean;
    fields: DataCollectionField[];
  };
  behavior: {
    queryHandling: 'single' | 'continuous';
    postAnswerAction: 'continue' | 'close' | 'handoff';
    inactivityTimeout: number;
    inactivityAction: 'close' | 'handoff' | 'prompt';
    enableHumanHandoff: boolean;
  };
}

export const CreateChatbotForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateChatbotFormValues>({
    defaultValues: {
      name: '',
      persona: '',
      avatarUrl: '',
      tone: 'friendly',
      customInstructions: '',
      welcomeMessage: 'Hi! How can I help you today?',
      humanHandoffMessage: "I'll connect you with a human agent who can better assist you with this.",
      dataCollection: {
        enabled: false,
        fields: [],
      },
      behavior: {
        queryHandling: 'continuous',
        postAnswerAction: 'continue',
        inactivityTimeout: 15,
        inactivityAction: 'prompt',
        enableHumanHandoff: true,
      },
    },
  });

  const onSubmit = async (data: CreateChatbotFormValues) => {
    setIsSubmitting(true);
    try {
      await dispatch(createChatbot({
        name: data.name,
        description: `A ${data.tone} chatbot with ${data.persona} persona`,
        status: 'inactive',
        avatarUrl: data.avatarUrl,
        tone: data.tone,
        customInstructions: data.customInstructions,
        welcomeMessage: data.welcomeMessage,
        humanHandoffMessage: data.humanHandoffMessage,
        dataCollection: data.dataCollection,
        behavior: data.behavior,
      })).unwrap();

      toast({
        title: "Success",
        description: "Chatbot created successfully",
      });
      navigate('/home/automation/ai/chatbot-profiles');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chatbot",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
      <CardHeader className="space-y-2 pb-6">
        <h2 className="text-3xl font-bold tracking-tight">Create New Chatbot</h2>
        <p className="text-muted-foreground">Configure your AI assistant by filling in the details below</p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <BasicInformation />
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Personality Configuration</h3>
              <ToneSelection />
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Message Settings</h3>
              <MessageConfiguration />
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Behavior Settings</h3>
              <BehaviorSettings />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/home/automation/ai/chatbot-profiles')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Chatbot'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
