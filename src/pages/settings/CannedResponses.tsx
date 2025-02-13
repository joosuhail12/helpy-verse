
import { useState } from 'react';
import { mockCannedResponses, type CannedResponse } from '@/mock/cannedResponses';
import { CannedResponseList } from '@/components/settings/cannedResponses/CannedResponseList';
import { CreateResponseDialog } from '@/components/settings/cannedResponses/CreateResponseDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CannedResponses = () => {
  const [responses, setResponses] = useState<CannedResponse[]>(mockCannedResponses);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = (response: Omit<CannedResponse, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newResponse: CannedResponse = {
      ...response,
      id: String(responses.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setResponses([...responses, newResponse]);
    toast({
      title: "Success",
      description: "Canned response created successfully",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Canned Responses</h1>
          <p className="text-muted-foreground">
            Create and manage your team's canned responses for quick replies
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Response
        </Button>
      </div>

      <CannedResponseList responses={responses} setResponses={setResponses} />
      
      <CreateResponseDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default CannedResponses;
