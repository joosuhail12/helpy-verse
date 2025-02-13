
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { enable2FA, disable2FA, verify2FA } from '@/store/slices/securitySlice';

interface TwoFactorSetupProps {
  teammateId: string;
}

const TwoFactorSetup = ({ teammateId }: TwoFactorSetupProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { is2FAEnabled, qrCodeUrl } = useAppSelector(state => 
    state.security.teammateSettings[teammateId] || { is2FAEnabled: false, qrCodeUrl: '' }
  );

  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      await dispatch(enable2FA(teammateId)).unwrap();
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to enable 2FA. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);
    try {
      await dispatch(disable2FA(teammateId)).unwrap();
      toast({
        description: "Two-factor authentication has been disabled.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to disable 2FA. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) return;
    
    setIsLoading(true);
    try {
      await dispatch(verify2FA({ teammateId, code: verificationCode })).unwrap();
      setIsDialogOpen(false);
      toast({
        description: "Two-factor authentication has been enabled successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Invalid verification code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500">
            Add an extra layer of security to your account
          </p>
        </div>
        <Button
          onClick={is2FAEnabled ? handleDisable2FA : handleEnable2FA}
          variant={is2FAEnabled ? "destructive" : "default"}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </Button>
      </div>

      {is2FAEnabled && (
        <Alert>
          <AlertDescription>
            Two-factor authentication is currently enabled
          </AlertDescription>
        </Alert>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app, then enter the verification code below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {qrCodeUrl && (
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Input
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button onClick={handleVerify} className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TwoFactorSetup;
