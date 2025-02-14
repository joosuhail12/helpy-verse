
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, History, Share2, Star, Copy } from 'lucide-react';
import type { CannedResponse } from '@/mock/cannedResponses';
import { Link } from 'react-router-dom';
import { CategoryCombobox } from '@/components/settings/cannedResponses/CategoryCombobox';
import { CannedResponseEditor } from '@/components/settings/cannedResponses/CannedResponseEditor';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectCannedResponseById } from '@/store/slices/cannedResponses/selectors';
import { updateCannedResponse } from '@/store/slices/cannedResponses/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface CannedResponseFormValues {
  title: string;
  content: string;
  shortcut: string;
  category: string;
  isShared: boolean;
}

const CannedResponseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const response = useAppSelector(state => selectCannedResponseById(state, id ?? ''));
  const [loading, setLoading] = useState(false);

  const form = useForm<CannedResponseFormValues>({
    defaultValues: {
      title: '',
      content: '',
      shortcut: '',
      category: '',
      isShared: false,
    },
  });

  useEffect(() => {
    if (response) {
      form.reset({
        title: response.title,
        content: response.content,
        shortcut: response.shortcut,
        category: response.category,
        isShared: response.isShared,
      });
    }
  }, [response, form]);

  const onSubmit = async (data: CannedResponseFormValues) => {
    if (!response) return;

    try {
      setLoading(true);
      await dispatch(updateCannedResponse({
        ...response,
        ...data,
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Canned response updated successfully",
      });
      
      navigate('/home/settings/canned-responses');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update canned response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response?.content || '');
    toast({
      title: "Copied",
      description: "Response content copied to clipboard",
    });
  };

  if (!response) {
    return (
      <div className="p-6">
        <div className="text-red-500">Response not found</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/home/settings/canned-responses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Canned Response</h1>
            <p className="text-muted-foreground">
              Update your canned response details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Favorite
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter a title" />
                        </FormControl>
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
                            disabled={loading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shortcut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shortcut</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/shortcut" />
                        </FormControl>
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
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sharing Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="isShared"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Shared Response</FormLabel>
                          <FormDescription>
                            Make this response available to all team members
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={loading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Total Uses</div>
                <div className="text-2xl font-bold">{response.usageStats?.totalUses || 0}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium">Last Used</div>
                <div className="text-muted-foreground">
                  {response.usageStats?.lastUsed ? new Date(response.usageStats.lastUsed).toLocaleDateString() : 'Never'}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium">Used By</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {response.usageStats?.usedBy.map((user) => (
                    <Badge key={user.userId} variant="secondary">
                      {user.userName} ({user.useCount})
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {response.versions?.map((version) => (
                <div key={version.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{version.createdBy}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(version.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {version.changes.map((change, index) => (
                    <div key={index} className="text-sm">
                      Changed <span className="font-medium">{change.field}</span>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CannedResponseDetail;

