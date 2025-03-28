
import React, { useState } from 'react';
import { contactAuth } from '@/utils/auth/contactAuth';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useThemeContext } from '@/context/ThemeContext';

interface ContactVerificationProps {
  onVerified: () => void;
}

const ContactVerification: React.FC<ContactVerificationProps> = ({ onVerified }) => {
  const { colors } = useThemeContext();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const success = await contactAuth.requestVerificationCode(email);
      if (success) {
        setStep('code');
      } else {
        setError('Could not send verification code. Please check your email address.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const success = await contactAuth.verifyContact(email, verificationCode);
      if (success) {
        onVerified();
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col p-6 space-y-4"
      style={{ background: colors.background, color: colors.foreground }}
    >
      <h2 className="text-xl font-semibold mb-4">Verify Your Identity</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}
      
      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Your Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              style={{ 
                borderColor: colors.border, 
                background: colors.inputBackground,
                color: colors.foreground
              }}
            />
            <p className="text-sm text-gray-500">
              We'll send a verification code to this email address.
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || !email} 
            className="w-full"
            style={{ background: colors.primary, color: colors.primaryForeground }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Code...
              </>
            ) : (
              'Get Verification Code'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              required
              style={{ 
                borderColor: colors.border, 
                background: colors.inputBackground,
                color: colors.foreground
              }}
            />
            <p className="text-sm text-gray-500">
              Enter the verification code sent to {email}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep('email')}
              className="flex-1"
              style={{ 
                borderColor: colors.border, 
                color: colors.foreground 
              }}
            >
              Back
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading || !verificationCode} 
              className="flex-1"
              style={{ background: colors.primary, color: colors.primaryForeground }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactVerification;
