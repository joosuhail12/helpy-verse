
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActionDetailHeader = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate('/home/automation/ai/action-center')}
      className="mb-4"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Action Center
    </Button>
  );
};

export default ActionDetailHeader;

