
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Shield, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TeammatePermissionsProps {
  teammateId: string;
  currentPermissions: string[];
}

const TeammatePermissions = ({ teammateId, currentPermissions = [] }: TeammatePermissionsProps) => {
  const dispatch = useAppDispatch();
  const [permissions, setPermissions] = useState(currentPermissions);
  const [isUpdating, setIsUpdating] = useState(false);

  const permissionsList = [
    { id: 'manage_tickets', label: 'Manage Tickets', description: 'Can create, update and delete tickets' },
    { id: 'view_reports', label: 'View Reports', description: 'Can view analytics and reports' },
    { id: 'manage_tags', label: 'Manage Tags', description: 'Can create and manage tags' },
    { id: 'manage_teammates', label: 'Manage Teammates', description: 'Can manage team members' },
  ];

  const handlePermissionToggle = async (permissionId: string) => {
    setIsUpdating(true);
    try {
      const newPermissions = permissions.includes(permissionId)
        ? permissions.filter(p => p !== permissionId)
        : [...permissions, permissionId];
      
      // await dispatch(updateTeammatePermissions({ teammateId, permissions: newPermissions })).unwrap();
      setPermissions(newPermissions);
      
      toast({
        description: "Permissions updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update permissions",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Shield className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl font-semibold">Permissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Changes to permissions will take effect immediately.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {permissionsList.map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="space-y-0.5">
                <div className="font-medium">{permission.label}</div>
                <div className="text-sm text-gray-500">
                  {permission.description}
                </div>
              </div>
              <Switch
                checked={permissions.includes(permission.id)}
                onCheckedChange={() => handlePermissionToggle(permission.id)}
                disabled={isUpdating}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeammatePermissions;
