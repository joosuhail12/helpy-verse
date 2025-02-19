
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createChatbot } from '@/store/slices/chatbots/chatbotsSlice';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { AvatarUpload } from './AvatarUpload';
import type { ChatbotTone } from '@/types/chatbot';

interface CreateChatbotFormValues {
  name: string;
  persona: string;
  avatarUrl: string;
  tone: ChatbotTone;
  customInstructions: string;
  welcomeMessage: string;
  humanHandoffMessage: string;
}

const TONE_OPTIONS: { value: ChatbotTone; label: string }[] = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'helpful', label: 'Helpful' },
  { value: 'custom', label: 'Custom' },
];

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

  const showCustomInstructions = form.watch('tone') === 'custom';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create New Chatbot</h2>
        <p className="text-muted-foreground">Fill in the details to create a new chatbot</p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <AvatarUpload 
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter chatbot name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="persona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter persona name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      {TONE_OPTIONS.map((tone) => (
                        <FormItem key={tone.value}>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={tone.value} id={tone.value} />
                              <FormLabel htmlFor={tone.value} className="font-normal">
                                {tone.label}
                              </FormLabel>
                            </div>
                          </FormControl>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showCustomInstructions && (
              <FormField
                control={form.control}
                name="customInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter custom instructions for the chatbot's behavior and tone" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="welcomeMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the first message the chatbot will send" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This message will be sent when a user starts a new conversation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="humanHandoffMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Human Handoff Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the message to be sent when transferring to a human agent" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This message will be sent when the chatbot transfers the conversation to a human agent
                  </FormDescription>
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

