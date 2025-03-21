
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, History, Share2, Star, Copy, Loader2 } from 'lucide-react';
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
import { cannedResponseService, GetCannedResponseDetail } from '@/api/services/cannedResponse.service';
import { teamsService } from '@/api/services/teamService.service';
import { CannedResponse, UpdateCannedResponse } from '@/types/cannedResponse';
import { Team } from '@/types/team';

interface CannedResponseFormValues {
  id: string;
  name: string;
  message: string;
  shortcut: string;
  category: string;
  isShared: boolean;
  sharedTeams?: Array<{
    teamId: string;
    name?: string;
    typeOfSharing: 'view' | 'edit';
  }>;
}

const CannedResponseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const [response, setResponse] = useState<CannedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<'view' | 'edit'>('view');
  const [responseLoading, setResponseLoading] = useState(true);

  const form = useForm<CannedResponseFormValues>({
    defaultValues: {
      id: id,
      name: '',
      message: '',
      shortcut: '',
      category: '',
      isShared: false,
      sharedTeams: [],
    },
  });

  useEffect(() => {
    if (response) {
      form.reset({
        id: response.id,
        name: response.name,
        message: response.message,
        shortcut: response.shortcut,
        category: response.category,
        isShared: response.isShared,
        sharedTeams: response.sharedTeams?.map(share => ({
          teamId: share.teamId || '',
          name: share.name,
          typeOfSharing: share.typeOfSharing,
        })) || [],
      });
    }
  }, [response, form]);


  useEffect(() => {
    const getCannedResponseDetails = async () => {
      await cannedResponseService.getCannedResponseDetails(id).then((response) => {
        setResponse(response.data);
        form.reset({
          id: response.data.id,
          name: response.data.name,
          message: response.data.message,
          shortcut: response.data.shortcut,
          category: response.data.category,
          isShared: response.data.isShared,
          sharedTeams: response.data.sharedTeams?.map(share => ({
            teamId: share.teamId || '',
            name: share.name,
            typeOfSharing: share.typeOfSharing,
          })) || [],
        });
      }).catch((error) => {
        console.error('Error fetching canned response:', error.data);
        toast({
          title: "Error",
          description: "Failed to fetch canned response: " + error?.message,
          variant: "destructive",
        });
      }).finally(() => {
        setResponseLoading(false);
      });
    };

    const getAllTeams = async () => {
      try {
        const teams = await teamsService.getAllTeams();

        setTeams(teams.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch teams",
          variant: "destructive",
        });
      }
    }

    getAllTeams();
    getCannedResponseDetails();
  }, []);

  const handleAddShare = () => {
    if (!selectedTeam) return;

    const currentShares = form.getValues('sharedTeams') || [];
    const team = teams.find(t => t.id === selectedTeam);

    if (currentShares.some(t => t.teamId === selectedTeam)) {
      toast({
        title: "Error",
        description: "Team already shared",
        variant: "destructive",
      });

      return;
    }

    form.setValue('sharedTeams', [
      ...currentShares,
      {
        teamId: selectedTeam,
        name: team?.name,
        typeOfSharing: selectedPermission,
      }
    ]);
    console.log(form.getValues('sharedTeams'))
    setSelectedTeam('');
    setSelectedPermission('view');
  };

  const handleRemoveShare = (index: number) => {
    const currentShares = form.getValues('sharedTeams') || [];
    form.setValue('sharedTeams', currentShares.filter((_, i) => i !== index));
  };

  const createUpdatedCannedResponseObject = (currentData: CannedResponse, submittedData: CannedResponseFormValues) => {
    // Create an object to hold the updated fields
    const updatedData: { [key: string]: any } = { id: currentData.id };

    // Compare and add the fields that have changed
    if (currentData.name !== submittedData.name) {
      updatedData.name = submittedData.name;
    }

    if (currentData.message !== submittedData.message) {
      updatedData.message = submittedData.message;
    }

    if (currentData.shortcut !== submittedData.shortcut) {
      updatedData.shortcut = submittedData.shortcut;
    }

    if (currentData.category !== submittedData.category) {
      updatedData.category = submittedData.category;
    }

    if (currentData.isShared !== submittedData.isShared) {
      updatedData.isShared = submittedData.isShared;
    }

    // Check for changes in shared teams
    const currentSharedTeams = currentData.sharedTeams || [];
    const submittedSharedTeams = submittedData.sharedTeams || [];

    // Check if shared teams are different
    const addedTeams = submittedSharedTeams.filter(
      (submittedTeam) => !currentSharedTeams.some((currentTeam) => {
        if (!currentTeam || typeof currentTeam === 'string') return false;
        return currentTeam.teamId === submittedTeam.teamId;
      })
    );

    const removedTeams = currentSharedTeams.filter(
      (currentTeam) => {
        if (!currentTeam || typeof currentTeam === 'string') return false;
        return !submittedSharedTeams.some((submittedTeam) => submittedTeam.teamId === currentTeam.teamId);
      }
    );

    const updatedTeams = submittedSharedTeams.filter(
      (submittedTeam) => currentSharedTeams.some((currentTeam) => {
        if (!currentTeam || typeof currentTeam === 'string') return false;
        return currentTeam.teamId === submittedTeam.teamId;
      })
    );

    console.log(addedTeams, removedTeams, updatedTeams);

    if (addedTeams.length > 0) {
      const addedTeamsData = addedTeams.map((team) => ({
        teamId: team.teamId,
        typeOfSharing: team.typeOfSharing,
        action: 'add',
      }));

      updatedData.sharedTeams = [
        ...(updatedData.sharedTeams || []),
        ...addedTeamsData
      ];
    }

    if (removedTeams.length > 0) {
      const removedTeamsData = removedTeams.map((team) => ({
        teamId: team.teamId,
        typeOfSharing: team.typeOfSharing,
        action: 'remove',
      }));

      updatedData.sharedTeams = [
        ...(updatedData.sharedTeams || []),
        ...removedTeamsData
      ];
    }

    if (updatedTeams.length > 0) {
      const updatedTeamsData = updatedTeams.map((team) => ({
        teamId: team.teamId,
        typeOfSharing: team.typeOfSharing,
        action: 'update',
      }));

      updatedData.sharedTeams = [
        ...(updatedData.sharedTeams || []),
        ...updatedTeamsData
      ];
    }

    if (updatedData.sharedTeams?.length === 0) {
      updatedData.isShared = false;
      delete updatedData.sharedTeams;
    }

    return updatedData;
  };


  const onSubmit = async (data: CannedResponseFormValues) => {
    if (!response) return;

    try {
      setLoading(true);

      // Create the object with the updated fields
      const updatedCannedResponse = createUpdatedCannedResponseObject(response, data);
      console.log(data);

      console.log(updatedCannedResponse);

      if (Object.keys(updatedCannedResponse).length === 1) {
        // If no fields other than 'id' are present, it means no updates were made
        toast({
          title: "No changes",
          description: "No changes were made to the canned response.",
        });
        return;
      }

      await cannedResponseService.updateCannedResponse(updatedCannedResponse as UpdateCannedResponse);

      toast({
        title: "Success",
        description: "Canned response updated successfully",
      });

      navigate('/home/settings/canned-responses');
    } catch (error) {
      console.error(error);
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
    navigator.clipboard.writeText(response?.message || '');
    toast({
      title: "Copied",
      description: "Response content copied to clipboard",
    });
  };

  if (!responseLoading && !response) {
    return (
      <div className="p-6">
        <div className="text-red-500">Response not found</div>
      </div>
    );
  }

  if (responseLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
          {/* <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              History
            </Button> */}
          {/* <Button variant="outline" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Favorite
          </Button> */}
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter a name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
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
                        {form.watch('sharedTeams')?.map((share, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <span className="font-medium">
                                {teams?.find(t => t.id === share.teamId)?.name}
                              </span>
                              <span className="ml-2 text-sm text-muted-foreground">
                                ({share.typeOfSharing === 'view' ? 'View only' : 'Can edit'})
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
                <div className="text-2xl font-bold">{response.numberOfTimesUsed || 0}</div>
              </div>
              {/* <Separator /> */}
              <div>
                {/* <div className="text-sm font-medium">Last Used</div> */}
                {/* <div className="text-muted-foreground">
                  {response.usageStats?.lastUsed ? new Date(response.).toLocaleDateString() : 'Never'}
                </div>
                          TODO: Implement last used date
                */}
              </div>
              {/* <Separator />
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
                    // TODO: Implement used by users
              
              */}
            </CardContent>
          </Card>

          {/* <Card>
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
          
                    /// TODO: Implement version history
          */}
        </div>
      </div>
    </div>
  );
};

export default CannedResponseDetail;
