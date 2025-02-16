
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { mockChatbots } from '@/mock/chatbots';
import { ContentCategory } from '@/mock/contentCategories';
import { CreateCategoryDialog } from '../CreateCategoryDialog';
import { DropZone } from './DropZone';
import { UploadedFile } from './UploadedFile';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  chatbotId: z.string().min(1, 'Please select a chatbot'),
  categoryId: z.string().min(1, 'Please select a category'),
});

interface FileUploadFormProps {
  onSuccess: () => void;
  categories: ContentCategory[];
  onCategoryCreated: (category: ContentCategory) => void;
}

export const FileUploadForm = ({ onSuccess, categories, onCategoryCreated }: FileUploadFormProps) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      chatbotId: '',
      categoryId: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
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
          <FormField
            control={form.control}
            name="chatbotId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connect to Chatbot</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a chatbot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockChatbots.map((chatbot) => (
                      <SelectItem key={chatbot.id} value={chatbot.id}>
                        {chatbot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose which chatbot will use this content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <div className="flex gap-2">
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setCreateCategoryOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <FormDescription>
                  Choose or create a category for this content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DropZone onFilesSelected={setFiles} disabled={isUploading} />

        {files.length > 0 && (
          <div className="space-y-4">
            <UploadedFile 
              file={files[0]} 
              onRemove={() => {
                setFiles([]);
                setUploadProgress(0);
              }}
              disabled={isUploading}
            />

            {uploadProgress > 0 && (
              <Progress value={uploadProgress} className="h-1" />
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={isUploading || files.length === 0}
          className="w-full"
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </form>

      <CreateCategoryDialog
        open={createCategoryOpen}
        onOpenChange={setCreateCategoryOpen}
        onSuccess={onCategoryCreated}
      />
    </Form>
  );
};

