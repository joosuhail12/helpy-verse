
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Smartphone, Key, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { enable2FA, verify2FA, disable2FA } from '@/store/slices/teammates/actions';

interface TwoFactorSetupProps {
  teammateId: string;
}

enum SetupStep {
  Initial,
  SetupQR,
  VerifyCode,
  Success
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ teammateId }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const teammate = useAppSelector(state => 
    state.teammates.teammates.find(t => t.id === teammateId)
  );
  
  const [isEnabled, setIsEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState<SetupStep>(SetupStep.Initial);
  const [qrCode, setQrCode] = useState<string>('');
  const [setupKey, setSetupKey] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (teammate) {
      setIsEnabled(teammate.is2FAEnabled || false);
    }
  }, [teammate]);

  const handleToggle = async () => {
    if (isEnabled) {
      // Disable 2FA
      try {
        setIsLoading(true);
        await dispatch(disable2FA(teammateId));
        setIsEnabled(false);
        toast({
          title: "2FA Disabled",
          description: "Two-factor authentication has been disabled successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to disable two-factor authentication.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Enable 2FA - start setup
      try {
        setIsLoading(true);
        const result = await dispatch(enable2FA(teammateId)).unwrap();
        setQrCode(result.qrCode);
        setSetupKey(result.setupKey);
        setSetupStep(SetupStep.SetupQR);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to start two-factor authentication setup.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(verify2FA({ 
        teammateId,
        verificationCode 
      })).unwrap();
      
      setIsEnabled(true);
      setSetupStep(SetupStep.Success);
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled successfully.",
      });
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "The verification code is incorrect or has expired.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copySetupKey = () => {
    navigator.clipboard.writeText(setupKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const renderContent = () => {
    switch (setupStep) {
      case SetupStep.Initial:
        return (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Two-Factor Authentication</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account by requiring a verification code.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{isEnabled ? 'Enabled' : 'Disabled'}</span>
              <Switch 
                checked={isEnabled} 
                onCheckedChange={handleToggle} 
                disabled={isLoading}
              />
            </div>
          </div>
        );
        
      case SetupStep.SetupQR:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Scan the QR code with your authenticator app, or enter the setup key manually.
              </p>
            </div>
            
            <Tabs defaultValue="qrcode">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                <TabsTrigger value="manual">Manual Setup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="qrcode" className="space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="border p-4 rounded-md">
                    <img src={qrCode} alt="QR Code for 2FA" className="w-48 h-48" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Setup Key</Label>
                  <div className="flex">
                    <Input value={setupKey} readOnly className="font-mono" />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="ml-2" 
                      onClick={copySetupKey}
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button onClick={() => setSetupStep(SetupStep.VerifyCode)} className="w-full">
              Continue
            </Button>
          </div>
        );
        
      case SetupStep.VerifyCode:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Verify Code</h3>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit verification code from your authenticator app.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <Input 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="text-center tracking-widest text-lg"
                maxLength={6}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setSetupStep(SetupStep.SetupQR)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleVerify} className="flex-1" disabled={isLoading || verificationCode.length !== 6}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </div>
        );
        
      case SetupStep.Success:
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="font-medium text-lg">Setup Complete</h3>
              <p className="text-sm text-muted-foreground">
                Two-factor authentication has been successfully enabled for your account.
              </p>
            </div>
            
            <Button onClick={() => setSetupStep(SetupStep.Initial)} className="w-full">
              Done
            </Button>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader className={setupStep !== SetupStep.Initial ? '' : 'pb-0'}>
        <CardTitle>Security</CardTitle>
        {setupStep !== SetupStep.Initial && (
          <CardDescription>
            Protect your account with two-factor authentication
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};
