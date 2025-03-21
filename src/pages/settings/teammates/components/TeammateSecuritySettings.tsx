
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, LogOut } from 'lucide-react';
import { TwoFactorSetup } from './security/TwoFactorSetup';
import { ActiveSessions } from './security/ActiveSessions';
import { PasswordReset } from './security/PasswordReset';

interface TeammateSecuritySettingsProps {
  teammateId: string;
  isEditing: boolean;
}

const TeammateSecuritySettings = ({ teammateId, isEditing }: TeammateSecuritySettingsProps) => {
  if (isEditing) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Shield className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl font-semibold">Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TwoFactorSetup teammateId={teammateId} />
        <ActiveSessions teammateId={teammateId} />
        <PasswordReset teammateId={teammateId} />
      </CardContent>
    </Card>
  );
};

export default TeammateSecuritySettings;
