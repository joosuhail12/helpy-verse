
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Team } from '@/types/team';
import type { CannedResponseShare } from '@/mock/cannedResponses';

interface DetailsTabProps {
  title: string;
  category?: string;
  shortcut?: string;
  createdBy?: string;
  isShared: boolean;
  sharedWith?: CannedResponseShare[];
  teams: Team[];
}

export const DetailsTab = ({ 
  title, 
  category, 
  shortcut, 
  createdBy, 
  isShared, 
  sharedWith,
  teams 
}: DetailsTabProps) => {
  return (
    <div className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Response Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Title</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Category</h3>
            <p className="text-sm text-muted-foreground">{category || 'Uncategorized'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Shortcut</h3>
            <p className="text-sm text-muted-foreground">{shortcut || 'None'}</p>
          </div>
          
          {createdBy && (
            <div>
              <h3 className="text-sm font-medium">Created By</h3>
              <p className="text-sm text-muted-foreground">{createdBy}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium">Sharing</h3>
            <p className="text-sm text-muted-foreground">
              {isShared ? 'Shared with team' : 'Private'}
            </p>
          </div>
          
          {isShared && sharedWith && sharedWith.length > 0 && (
            <div>
              <h3 className="text-sm font-medium">Shared With</h3>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                {sharedWith.map((share, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span>
                      {teams.find(t => t.id === share.sharedWith.teamId)?.name || share.sharedWith.teamName} 
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
    </div>
  );
};
