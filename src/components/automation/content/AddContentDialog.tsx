
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddContentButton = () => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate('/home/automation/ai/content-center/create')}>
      <Plus className="h-4 w-4 mr-2" />
      Add Content
    </Button>
  );
};
