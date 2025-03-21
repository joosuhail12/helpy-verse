
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeleteResponseDialog } from '@/components/settings/cannedResponses/DeleteResponseDialog';

// Import the new custom hook
import { useCannedResponseDetail } from '@/hooks/useCannedResponseDetail';

// Import the new component files
import { ResponseHeader } from '@/components/settings/cannedResponses/detail/ResponseHeader';
import { PreviewTab } from '@/components/settings/cannedResponses/detail/PreviewTab';
import { DetailsTab } from '@/components/settings/cannedResponses/detail/DetailsTab';
import { UsageTab } from '@/components/settings/cannedResponses/detail/UsageTab';
import { ResponseLoading } from '@/components/settings/cannedResponses/detail/ResponseLoading';
import { ResponseError } from '@/components/settings/cannedResponses/detail/ResponseError';
import { ResponseNotFound } from '@/components/settings/cannedResponses/detail/ResponseNotFound';

const CannedResponseDetail = () => {
  // Use the custom hook to get all the state and handlers
  const {
    response,
    loading,
    error,
    teams,
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete
  } = useCannedResponseDetail();
  
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
        onDeleteClick={openDeleteDialog}
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
        onOpenChange={closeDeleteDialog}
        onDelete={handleDelete}
        responseTitle={response.title}
      />
    </div>
  );
};

export default CannedResponseDetail;
