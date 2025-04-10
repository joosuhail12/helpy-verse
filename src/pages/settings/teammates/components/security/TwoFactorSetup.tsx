import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { enable2FA, verify2FA, disable2FA } from '@/store/slices/teammates/teammatesSlice';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, ShieldOff, QrCode } from 'lucide-react';
import type { RootState } from '@/store/store';

interface TwoFactorSetupProps {
  teammateId: string;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ teammateId }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [secret, setSecret] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabling, setIsEnabling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  
  const teammate = useAppSelector((state) => 
    state.teammates?.teammates?.find(t => t.id === teammateId) || null
  );
  const is2FAEnabled = teammate?.is2FAEnabled || false;

  const handleEnable2FA = async () => {
    setIsEnabling(true);
    try {
      const result = await dispatch(enable2FA(teammateId)).unwrap();
      setQrCode(result.qrCode);
      setSecret(result.secret);
      toast({
        title: '2FA Setup Initiated',
        description: 'Please scan the QR code with your authenticator app.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enable two-factor authentication.',
        variant: 'destructive',
      });
    } finally {
      setIsEnabling(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) return;
    
    setIsVerifying(true);
    try {
      await dispatch(verify2FA({ 
        teammateId, 
        code: verificationCode 
      })).unwrap();
      
      toast({
        title: '2FA Enabled',
        description: 'Two-factor authentication has been successfully enabled.',
      });
      
      setSecret(null);
      setQrCode(null);
      setVerificationCode('');
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'The verification code is invalid or has expired.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsDisabling(true);
    try {
      await dispatch(disable2FA(teammateId)).unwrap();
      toast({
        title: '2FA Disabled',
        description: 'Two-factor authentication has been disabled.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disable two-factor authentication.',
        variant: 'destructive',
      });
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
      </CardHeader>
      <CardContent>
        {is2FAEnabled ? (
          <div className="space-y-4">
            <div className="bg-green-50 text-green-800 p-4 rounded-md flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2" />
              <p>Two-factor authentication is currently enabled for this account.</p>
            </div>
            
            <Button
              variant="destructive"
              onClick={handleDisable2FA}
              disabled={isDisabling}
              className="w-full"
            >
              <ShieldOff className="mr-2 h-4 w-4" />
              {isDisabling ? 'Disabling...' : 'Disable 2FA'}
            </Button>
          </div>
        ) : secret && qrCode ? (
          <div className="space-y-4">
            <div className="border p-4 rounded-md">
              <div className="text-center mb-4">
                <QrCode className="h-8 w-8 mx-auto mb-2" />
                <p className="font-semibold">Scan the QR code with your authenticator app</p>
              </div>
              
              <div className="bg-gray-100 p-3 rounded text-center">
                <p className="font-mono text-sm break-all">{secret}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Or enter this code manually in your authenticator app
                </p>
              </div>
            </div>
            
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSecret(null);
                    setQrCode(null);
                  }}
                  disabled={isVerifying}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!verificationCode || isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to provide both your password and a code from your mobile device to sign in.
            </p>
            
            <Button
              onClick={handleEnable2FA}
              disabled={isEnabling}
              className="w-full"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              {isEnabling ? 'Setting up...' : 'Enable 2FA'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
