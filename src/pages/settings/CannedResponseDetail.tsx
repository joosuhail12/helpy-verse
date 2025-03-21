
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeleteResponseDialog } from '@/components/settings/cannedResponses/DeleteResponseDialog';
import { toast } from '@/components/ui/use-toast';
import { fetchCannedResponses, deleteCannedResponse } from '@/store/slices/cannedResponses/actions';
import { selectCannedResponseById } from '@/store/slices/cannedResponses/selectors';

// Import the new component files
import { ResponseHeader } from '@/components/settings/cannedResponses/detail/ResponseHeader';
import { PreviewTab } from '@/components/settings/cannedResponses/detail/PreviewTab';
import { DetailsTab } from '@/components/settings/cannedResponses/detail/DetailsTab';
import { UsageTab } from '@/components/settings/cannedResponses/detail/UsageTab';
import { ResponseLoading } from '@/components/settings/cannedResponses/detail/ResponseLoading';
import { ResponseError } from '@/components/settings/cannedResponses/detail/ResponseError';
import { ResponseNotFound } from '@/components/settings/cannedResponses/detail/ResponseNotFound';

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
    return <ResponseLoading />;
  }
  
  if (error) {
    return <ResponseError error={error} />;
  }
  
  if (!response) {
    return <ResponseNotFound />;
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <ResponseHeader 
        title={response.title}
        category={response.category}
        shortcut={response.shortcut}
        id={response.id}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
      />
      
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          <PreviewTab 
            content={response.content} 
            shortcut={response.shortcut} 
          />
        </TabsContent>
        
        <TabsContent value="details">
          <DetailsTab 
            title={response.title}
            category={response.category}
            shortcut={response.shortcut}
            createdBy={response.createdBy}
            isShared={response.isShared}
            sharedWith={response.sharedWith}
            teams={teams}
          />
        </TabsContent>
        
        <TabsContent value="usage">
          <UsageTab />
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
