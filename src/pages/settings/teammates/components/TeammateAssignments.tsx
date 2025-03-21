
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeammateAssignments } from '@/store/slices/teammates/actions';
import { selectTeammateAssignments } from '@/store/slices/teammates/selectors';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeammateAssignmentsProps {
  teammateId: string;
}

export const TeammateAssignments = ({ teammateId }: TeammateAssignmentsProps) => {
  const dispatch = useAppDispatch();
  const assignments = useAppSelector(state => selectTeammateAssignments(state, teammateId));
  
  useEffect(() => {
    dispatch(fetchTeammateAssignments(teammateId));
  }, [dispatch, teammateId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Assignments</CardTitle>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No team assignments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="p-4 border rounded-md shadow-sm"
              >
                <h4 className="font-medium">{assignment.teamName}</h4>
                <p className="text-sm text-muted-foreground">
                  Role: {assignment.role || 'Member'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Joined: {new Date(assignment.startDate || new Date()).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeammateAssignments;
