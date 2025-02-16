
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockContentCategories, ContentCategory } from '@/mock/contentCategories';
import { ChatbotSelect } from './snippet/ChatbotSelect';
import { CategorySelect } from './snippet/CategorySelect';
import { snippetFormSchema, type SnippetFormValues } from './snippet/types';
import { CreateCategoryDialog } from './CreateCategoryDialog';

interface CreateSnippetProps {
  onSuccess: () => void;
}

export const CreateSnippet = ({ onSuccess }: CreateSnippetProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<ContentCategory[]>(mockContentCategories);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);

  const form = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetFormSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      chatbotId: '',
      categoryId: '',
    },
  });

  const onSubmit = async (values: SnippetFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Content created successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryCreated = (newCategory: ContentCategory) => {
    setCategories([...categories, newCategory]);
    form.setValue('categoryId', newCategory.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter a brief description of this content"
                    className="resize-none h-20"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a short description to help identify this content's purpose
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <ChatbotSelect form={form} />
            <CategorySelect 
              form={form}
              categories={categories}
              onCategoryCreated={handleCategoryCreated}
            />
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your content here"
                    className="min-h-[200px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write or paste your content here. This will be used for training the AI.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-6">
          {isSubmitting ? "Creating..." : "Create Content"}
        </Button>
      </form>

      <CreateCategoryDialog
        open={createCategoryOpen}
        onOpenChange={setCreateCategoryOpen}
        onSuccess={handleCategoryCreated}
      />
    </Form>
  );
};
