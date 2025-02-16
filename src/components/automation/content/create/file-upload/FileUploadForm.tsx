
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';
import { ContentCategory } from '@/mock/contentCategories';
import { CreateCategoryDialog } from '../CreateCategoryDialog';
import { DropZone } from './DropZone';
import { UploadedFile } from './UploadedFile';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ChatbotSelect } from './ChatbotSelect';
import { CategorySelect } from './CategorySelect';
import { fileUploadFormSchema, FileUploadFormValues } from './types';

interface FileUploadFormProps {
  onSuccess: () => void;
  categories: ContentCategory[];
  onCategoryCreated: (category: ContentCategory) => void;
}

export const FileUploadForm = ({ 
  onSuccess, 
  categories, 
  onCategoryCreated,
}: FileUploadFormProps) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);

  const form = useForm<FileUploadFormValues>({
    resolver: zodResolver(fileUploadFormSchema),
    defaultValues: {
      title: '',
      description: '',
      chatbotId: '',
      categoryId: '',
    },
  });

  const onSubmit = async (values: FileUploadFormValues) => {
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
                <Input 
                  placeholder="Enter title" 
                  {...field} 
                  className="bg-gray-50 dark:bg-gray-900"
                />
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
                  className="resize-none h-20 bg-gray-50 dark:bg-gray-900"
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
            onCategoryCreated={onCategoryCreated}
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
          className="w-full bg-purple-600 hover:bg-purple-700"
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
