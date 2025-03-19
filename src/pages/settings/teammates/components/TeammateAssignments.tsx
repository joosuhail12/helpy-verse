
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammateAssignments } from '@/store/slices/teammates/actions';
import { format } from 'date-fns';
import { Plus, Users, Briefcase, CalendarDays } from 'lucide-react';

interface TeammateAssignmentsProps {
  teammateId: string;
}

export const TeammateAssignments: React.FC<TeammateAssignmentsProps> = ({ teammateId }) => {
  const dispatch = useAppDispatch();
  // Create an empty array if assignments for this teammate don't exist yet
  const assignments = useAppSelector((state) => 
    state.teammates.assignments?.[teammateId] || []
  );

  useEffect(() => {
    dispatch(fetchTeammateAssignments(teammateId));
  }, [dispatch, teammateId]);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Assignments</CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center py-6">
            <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No team assignments</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This teammate is not assigned to any teams yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{assignment.teamName}</h4>
                      <Badge variant={getBadgeVariant(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      <Briefcase className="inline h-3 w-3 mr-1" />
                      {assignment.role}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                
                {(assignment.startDate || assignment.endDate) && (
                  <div className="mt-3 text-xs text-muted-foreground border-t pt-2">
                    <CalendarDays className="inline h-3 w-3 mr-1" />
                    {assignment.startDate && (
                      <span>
                        From {format(new Date(assignment.startDate), 'MMM d, yyyy')}
                      </span>
                    )}
                    {assignment.startDate && assignment.endDate && (
                      <span> to </span>
                    )}
                    {assignment.endDate && (
                      <span>
                        {format(new Date(assignment.endDate), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
