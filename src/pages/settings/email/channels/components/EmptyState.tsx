
import { Mail, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateClick: () => void;
  hasDomainVerified: boolean;
}

export function EmptyState({ onCreateClick, hasDomainVerified }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">No custom email channels</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        {hasDomainVerified 
          ? 'Add your first custom email channel to start sending and receiving emails'
          : 'Please verify a domain before adding custom email channels'}
      </p>
      <Button
        onClick={onCreateClick}
        disabled={!hasDomainVerified}
        className="mt-6 gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Custom Channel
      </Button>
    </div>
  );
}
