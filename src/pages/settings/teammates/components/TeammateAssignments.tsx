
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";

interface TeammateAssignmentsProps {
  teammateId: string;
}

const TeammateAssignments = ({ teammateId }: TeammateAssignmentsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const assignments = useAppSelector(state => 
    state.teammates.assignments.filter(a => a.teammateId === teammateId)
  );

  const handleAddAssignment = () => {
    // TODO: Implement add assignment functionality
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <GitBranch className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">Team Assignments</CardTitle>
        </div>
        <Button size="sm" onClick={handleAddAssignment} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No team assignments yet
            </p>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{assignment.teamName}</p>
                    <p className="text-sm text-gray-500">{assignment.role}</p>
                  </div>
                  <Badge>
                    {assignment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TeammateAssignments;
