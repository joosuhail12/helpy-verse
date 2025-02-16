
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { mockContentCategories, ContentCategory } from '@/mock/contentCategories';
import { ChatbotSelect } from './scraper/ChatbotSelect';
import { CategorySelect } from './scraper/CategorySelect';
import { scraperFormSchema, type ScraperFormValues } from './scraper/types';

interface WebScraperProps {
  onSuccess: () => void;
}

export const WebScraper = ({ onSuccess }: WebScraperProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState<ContentCategory[]>(mockContentCategories);

  const form = useForm<ScraperFormValues>({
    resolver: zodResolver(scraperFormSchema),
    defaultValues: {
      url: '',
      title: '',
      description: '',
      chatbotId: '',
      categoryId: '',
    },
  });

  const onSubmit = async (values: ScraperFormValues) => {
    setIsSubmitting(true);
    setProgress(0);

    try {
      // Simulate scraping progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      toast({
        title: "Success",
        description: "Website content scraped successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scrape website",
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
    <Card className="p-6 h-full overflow-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com" 
                    {...field} 
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Enter the URL of the website you want to scrape content from.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {isSubmitting && (
            <div className="space-y-2">
              <Progress value={progress} className="h-1" />
              <p className="text-sm text-muted-foreground text-center">
                Scraping content... {progress}%
              </p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Scraping..." : "Start Scraping"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
