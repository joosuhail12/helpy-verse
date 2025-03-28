import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Logo } from "@/components/auth/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Check } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { confirmPasswordReset } from '@/store/slices/authSlice';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const rid = searchParams.get('rid');
  const tenantId = searchParams.get('tenantId');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      setError('Invalid password reset link. Please request a new one.');
    }
  }, [token]);

  useEffect(() => {
    if (authState.error) {
      setError(authState.error);
      setLoading(false);
    }
  }, [authState.error]);

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setLoading(true);
    try {
      await dispatch(confirmPasswordReset({
        token: token as string,
        password,
        rid: rid || '',
        tenantId: tenantId || ''
      })).unwrap();
      
      setSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now sign in with your new password.",
      });
      
      // Redirect to login after a brief delay
      setTimeout(() => {
        navigate('/sign-in');
      }, 3000);
    } catch (error) {
      // Error is handled by the useEffect that watches authState.error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full gradient-background flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-md auth-card p-8">
        <div className="mb-8">
          <Logo />
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Reset your password</h1>
        
        {!token ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 text-red-800 rounded-md">
              {error}
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/forgot-password">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to forgot password
              </Link>
            </Button>
          </div>
        ) : success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 text-green-800 rounded-md flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Password reset successful! Redirecting to login page...
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/sign-in">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 text-red-800 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
            
            <div className="text-center">
              <Button variant="link" asChild>
                <Link to="/sign-in">Back to Sign In</Link>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
