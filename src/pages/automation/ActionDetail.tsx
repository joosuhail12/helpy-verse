
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ActionDetailHeader } from '@/components/automation/actions/ActionDetailHeader';
import { ActionDetailContent } from '@/components/automation/actions/ActionDetailContent';

const ActionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const action = useAppSelector((state) => 
    state.actions.items.find(action => action.id === id)
  );

  if (!action) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Button 
            variant="outline" 
            onClick={() => navigate('/home/automation/ai/action-center')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Actions
          </Button>
          <Card className="p-6">
            <p className="text-center text-muted-foreground">Action not found</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/home/automation/ai/action-center')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Actions
        </Button>
        
        <ActionDetailHeader action={action} />
        <ActionDetailContent action={action} />
      </div>
    </div>
  );
};

export default ActionDetail;
