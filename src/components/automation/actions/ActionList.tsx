
import React from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ActionListItem } from './ActionListItem';
import { RootState } from '@/store/store';

export function ActionList() {
  const actions = useAppSelector((state: RootState) => state.actions.items || []);

  if (actions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No actions yet</h3>
        <p className="text-muted-foreground mt-1">
          Create your first custom action to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <ActionListItem key={action.id} action={action} />
      ))}
    </div>
  );
}
