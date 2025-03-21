
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CannedResponseEditor } from '@/components/settings/cannedResponses/CannedResponseEditor';
import { ShortcutTester } from '@/components/settings/cannedResponses/ShortcutTester';
import { DeleteResponseDialog } from '@/components/settings/cannedResponses/DeleteResponseDialog';
import { ArrowLeft, Pencil, Trash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { fetchCannedResponses, deleteCannedResponse } from '@/store/slices/cannedResponses/actions';
import { selectCannedResponseById } from '@/store/slices/cannedResponses/selectors';

const CannedResponseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Use selectors to get data from the store
  const response = useAppSelector(state => selectCannedResponseById(state, id || ''));
  const loading = useAppSelector(state => state.cannedResponses.loading);
  const error = useAppSelector(state => state.cannedResponses.error);
  const teams = useAppSelector(state => state.teams.teams);
  
  useEffect(() => {
    // Fetch all responses instead of a specific one
    dispatch(fetchCannedResponses());
  }, [dispatch, id]);
  
  const handleDelete = async () => {
    try {
      if (id) {
        await dispatch(deleteCannedResponse(id)).unwrap();
        toast({
          title: 'Success',
          description: 'Canned response deleted successfully',
        });
        navigate('/home/settings/canned-responses');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete canned response',
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }
  
  if (!response) {
    return (
      <div className="p-6">
        <div className="bg-amber-50 text-amber-600 p-4 rounded-lg">
          Canned response not found
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/home/settings/canned-responses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{response.title}</h1>
            <p className="text-muted-foreground">
              {response.category || 'Uncategorized'} • Shortcut: {response.shortcut || 'None'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button 
            size="sm"
            onClick={() => navigate(`/home/settings/canned-responses/${id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Content</CardTitle>
              <CardDescription>
                Preview how this canned response will appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: response.content }}
              />
            </CardContent>
          </Card>
          
          {response.shortcut && (
            <Card>
              <CardHeader>
                <CardTitle>Test Shortcut</CardTitle>
                <CardDescription>
                  Type "{response.shortcut}" followed by space to test the shortcut
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShortcutTester 
                  shortcut={response.shortcut} 
                  content={response.content}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Title</h3>
                <p className="text-sm text-muted-foreground">{response.title}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Category</h3>
                <p className="text-sm text-muted-foreground">{response.category || 'Uncategorized'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Shortcut</h3>
                <p className="text-sm text-muted-foreground">{response.shortcut || 'None'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Created By</h3>
                <p className="text-sm text-muted-foreground">{response.createdBy}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  {response.isShared ? 'Shared with team' : 'Private'}
                </p>
              </div>
              
              {response.isShared && response.sharedWith && response.sharedWith.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium">Shared With</h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    {response.sharedWith.map((share, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span>
                          {teams.find(t => t.id === share.teamId)?.name || share.teamName} 
                          <span className="ml-2 text-xs">
                            ({share.permissions === 'view' ? 'View only' : 'Can edit'})
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>
                How often this canned response is used
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* This would have real statistics in a production app */}
              <div className="py-8 text-center text-muted-foreground">
                Usage statistics are not available in this demo
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <DeleteResponseDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        responseTitle={response.title}
      />
    </div>
  );
};

export default CannedResponseDetail;
