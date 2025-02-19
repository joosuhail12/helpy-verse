
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createChatbot } from '@/store/slices/chatbots/chatbotsSlice';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { BasicInformation } from './form/BasicInformation';
import { ToneSelection } from './form/ToneSelection';
import { MessageConfiguration } from './form/MessageConfiguration';
import { DataCollectionConfig } from './DataCollectionConfig';
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create New Chatbot</h2>
        <p className="text-muted-foreground">Fill in the details to create a new chatbot</p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <BasicInformation />
            <ToneSelection />
            <MessageConfiguration />
            <FormField
              control={form.control}
              name="dataCollection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Collection Form</FormLabel>
                  <FormControl>
                    <DataCollectionConfig
                      enabled={field.value.enabled}
                      fields={field.value.fields}
                      onEnableChange={(enabled) => 
                        form.setValue('dataCollection.enabled', enabled)
                      }
                      onFieldsChange={(fields) => 
                        form.setValue('dataCollection.fields', fields)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-end space-x-4">
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
