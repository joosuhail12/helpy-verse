
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PasswordResetFormProps {
  onSubmit: (password: string) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (): boolean => {
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      await onSubmit(password);
      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/sign-in');
      }, 3000);
    } catch (err) {
      console.error('Error in password reset form:', err);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-2 rounded-full">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-green-800">Password Reset Successful</h3>
        <p className="text-green-600 mt-2">
          Your password has been successfully reset. You will be redirected to the login page shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your new password"
          required
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your new password"
          required
          autoComplete="new-password"
        />
      </div>

      {(validationError || error) && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{validationError || error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting...
          </>
        ) : (
          'Reset Password'
        )}
      </Button>
    </form>
  );
};

export default PasswordResetForm;
