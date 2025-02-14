import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CannedResponse } from '@/mock/cannedResponses';
import { CategoryCombobox } from '@/components/settings/cannedResponses/CategoryCombobox';
import { CannedResponseEditor } from '@/components/settings/cannedResponses/CannedResponseEditor';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createCannedResponse } from '@/store/slices/cannedResponses/actions';
import { CollapsibleFormSection } from '@/components/settings/cannedResponses/form/CollapsibleFormSection';
import { ResponsePreview } from '@/components/settings/cannedResponses/form/ResponsePreview';
import { ShortcutTester } from '@/components/settings/cannedResponses/ShortcutTester';
import { validateShortcut, getSimilarShortcuts } from '@/utils/shortcutUtils';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(50, "Title must be 50 characters or less"),
  content: z.string()
    .min(1, "Content is required"),
  shortcut: z.string()
    .min(1, "Shortcut is required")
    .max(20, "Shortcut must be 20 characters or less")
    .regex(/^[a-zA-Z0-9-_]+$/, "Shortcut can only contain letters, numbers, hyphens, and underscores")
    .refine(val => validateShortcut(val) === null, {
      message: "This shortcut is already in use"
    }),
  category: z.string()
    .min(1, "Category is required"),
  isShared: z.boolean(),
  createdBy: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCannedResponse = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      shortcut: '',
      category: '',
      isShared: false,
      createdBy: 'Current User',
    },
  });

  const watchShortcut = form.watch('shortcut');
  const [similarShortcuts, setSimilarShortcuts] = useState<string[]>([]);

  useEffect(() => {
    setSimilarShortcuts(getSimilarShortcuts(watchShortcut));
  }, [watchShortcut]);

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(createCannedResponse(data as Omit<CannedResponse, 'id' | 'createdAt' | 'updatedAt'>)).unwrap();
      toast({
        title: "Success",
        description: "Canned response created successfully",
      });
      navigate('/home/settings/canned-responses');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create canned response",
        variant: "destructive",
      });
    }
  };

  const watchTitle = form.watch('title');
  const watchContent = form.watch('content');

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/home/settings/canned-responses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Canned Response</h1>
          <p className="text-muted-foreground">
            Create a new canned response for quick replies
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <CollapsibleFormSection title="Basic Information">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter a title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <CannedResponseEditor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleFormSection>

              <CollapsibleFormSection title="Organization">
                <FormField
                  control={form.control}
                  name="shortcut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shortcut</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input {...field} placeholder="/shortcut" />
                          {similarShortcuts.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              Similar shortcuts:
                              <div className="flex flex-wrap gap-2 mt-1">
                                {similarShortcuts.map((shortcut, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-muted rounded-md text-xs"
                                  >
                                    {shortcut}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                      {watchShortcut && <ShortcutTester shortcut={watchShortcut} />}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <CategoryCombobox {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleFormSection>

              <CollapsibleFormSection title="Sharing Settings">
                <FormField
                  control={form.control}
                  name="isShared"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Shared Response</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Make this response available to all team members
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CollapsibleFormSection>
            </div>

            <div className="space-y-6">
              <div className="sticky top-6">
                <ResponsePreview
                  title={watchTitle}
                  content={watchContent}
                />
              </div>
            </div>
          </div>

          <Button type="submit">Create Response</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCannedResponse;
