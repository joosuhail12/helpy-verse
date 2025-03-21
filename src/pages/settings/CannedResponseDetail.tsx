import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, History, Share2, Star, Copy } from 'lucide-react';
import type { CannedResponse, CannedResponseShare } from '@/mock/cannedResponses';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CannedResponseFormValues {
  title: string;
  content: string;
  shortcut: string;
  category: string;
  isShared: boolean;
  sharedWith?: Array<{
    teamId: string;
    teamName?: string;
    permissions: 'view' | 'edit';
  }>;
}

const CannedResponseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const response = useAppSelector(state => selectCannedResponseById(state, id ?? ''));
  const teams = useAppSelector(state => state.teams.teams);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<'view' | 'edit'>('view');

  const form = useForm<CannedResponseFormValues>({
    defaultValues: {
      title: '',
      content: '',
      shortcut: '',
      category: '',
      isShared: false,
      sharedWith: [],
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
        sharedWith: response.sharedWith?.map(share => ({
          teamId: share.sharedWith.teamId || '',
          teamName: share.sharedWith.teamName,
          permissions: share.permissions,
        })) || [],
      });
    }
  }, [response, form]);

  const handleAddShare = () => {
    if (!selectedTeam) return;

    const currentShares = form.getValues('sharedWith') || [];
    const team = teams.find(t => t.id === selectedTeam);

    form.setValue('sharedWith', [
      ...currentShares,
      {
        teamId: selectedTeam,
        teamName: team?.name,
        permissions: selectedPermission,
      }
    ]);

    setSelectedTeam('');
    setSelectedPermission('view');
  };

  const handleRemoveShare = (index: number) => {
    const currentShares = form.getValues('sharedWith') || [];
    form.setValue('sharedWith', currentShares.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CannedResponseFormValues) => {
    if (!response) return;

    try {
      setLoading(true);
      // Transform the form shared data to match CannedResponseShare interface
      const transformedSharedWith: CannedResponseShare[] = data.sharedWith?.map(share => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Generate a unique ID
        responseId: response.id,
        sharedWith: {
          teamId: share.teamId,
          teamName: share.teamName,
        },
        permissions: share.permissions,
        createdAt: new Date().toISOString(),
      })) || [];

      await dispatch(updateCannedResponse({
        ...response,
        title: data.title,
        content: data.content,
        shortcut: data.shortcut,
        category: data.category,
        isShared: data.isShared,
        sharedWith: transformedSharedWith,
        updatedAt: new Date().toISOString(),
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
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isShared"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Shared Response</FormLabel>
                          <FormDescription>
                            Make this response available to other team members
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

                  {form.watch('isShared') && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map(team => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select value={selectedPermission} onValueChange={(val: 'view' | 'edit') => setSelectedPermission(val)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Permissions" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">View only</SelectItem>
                            <SelectItem value="edit">Can edit</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button type="button" onClick={handleAddShare}>
                          Add
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {form.watch('sharedWith')?.map((share, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <span className="font-medium">
                                {teams.find(t => t.id === share.teamId)?.name}
                              </span>
                              <span className="ml-2 text-sm text-muted-foreground">
                                ({share.permissions === 'view' ? 'View only' : 'Can edit'})
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveShare(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
