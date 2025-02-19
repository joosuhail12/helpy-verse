
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createChatbot } from '@/store/slices/chatbots/chatbotsSlice';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { IconSelection } from './IconSelection';

interface CreateChatbotFormValues {
  name: string;
  persona: string;
  icon: string;
}

export const CreateChatbotForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateChatbotFormValues>({
    defaultValues: {
      name: '',
      persona: '',
      icon: '',
    },
  });

  const onSubmit = async (data: CreateChatbotFormValues) => {
    setIsSubmitting(true);
    try {
      await dispatch(createChatbot({
        name: data.name,
        description: `A chatbot with ${data.persona} persona`,
        status: 'inactive',
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <IconSelection 
                      selectedIcon={field.value}
                      onSelectIcon={(icon) => field.onChange(icon)}
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

