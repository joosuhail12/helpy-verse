
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ChannelHeaderProps {
  hasDomainVerified: boolean;
}

export function ChannelHeader({ hasDomainVerified }: ChannelHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateClick = () => {
    if (!hasDomainVerified) {
      toast({
        title: "Domain verification required",
        description: "Please verify a domain before adding custom email channels.",
        variant: "destructive",
      });
      return;
    }
    navigate('create');
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-xl p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Email Channels
          </h2>
          <p className="text-muted-foreground">
            Manage your email channels for sending and receiving messages
          </p>
        </div>
        <Button onClick={handleCreateClick} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Custom Channel
        </Button>
      </div>
    </div>
  );
}
