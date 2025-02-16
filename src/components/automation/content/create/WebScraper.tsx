
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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

const formSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

interface WebScraperProps {
  onSuccess: () => void;
}

export const WebScraper = ({ onSuccess }: WebScraperProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
