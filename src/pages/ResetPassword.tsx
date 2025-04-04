
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { confirmPasswordReset } from '@/store/slices/auth/authActions';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import { Logo } from '@/components/auth/Logo';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const rid = searchParams.get('rid');
  const tenantId = searchParams.get('tenantId');
  const [resetError, setResetError] = useState<string>('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      // Handle different error types by extracting the message string
      if (typeof error === 'string') {
        setResetError(error);
      } else if (error && typeof error === 'object' && 'message' in error) {
        setResetError(error.message);
      } else {
        setResetError('An error occurred while resetting your password.');
      }
    }
  }, [error]);

  const handleSubmit = async (password: string) => {
    if (!token) {
      setResetError('Missing reset token. Please check your reset link.');
      return;
    }

    try {
      await dispatch(confirmPasswordReset({
        token,
        password,
        rid,
        tenantId
      })).unwrap();
    } catch (err: any) {
      // Error will be handled by the useEffect above
      console.error('Password reset error:', err);
    }
  };

  return (
    <div className="min-h-screen w-full gradient-background flex items-center justify-center p-6">
      <div className="w-full max-w-md auth-card p-6 space-y-6">
        <div className="flex flex-col items-center gap-6">
          <Logo />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">Reset Your Password</h1>
            <p className="text-gray-600 text-sm mt-2">
              Enter your new password below
            </p>
          </div>
        </div>

        <PasswordResetForm
          onSubmit={handleSubmit}
          loading={loading}
          error={resetError}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
