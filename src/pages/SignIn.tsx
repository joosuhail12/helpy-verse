
import { memo, useEffect, useMemo } from "react";
import { Logo } from "@/components/auth/Logo";
import { FeatureList } from "@/components/auth/FeatureList";
import { LoginForm } from "@/components/auth/LoginForm";
import { Form } from "@/components/ui/form";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { isAuthenticated } from "@/utils/auth/tokenManager";

// Create a memoized selector to prevent unnecessary re-renders
const selectAuthState = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  error: state.auth.error
});

export const SignIn = memo(() => {
  console.log('SignIn component rendering'); // Debug log
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use memoized selector to only get needed parts of auth state
  const auth = useAppSelector(selectAuthState);
  
  // Get redirect path from location state or default to /home
  const from = useMemo(() => {
    return location.state?.from || '/home';
  }, [location.state]);
  
  const methods = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated - using tokenManager's isAuthenticated
  // With useEffect dependency on auth.isAuthenticated to prevent unnecessary checks
  useEffect(() => {
    // Single check on component mount or auth change
    const authStatus = isAuthenticated();
    
    if (authStatus) {
      console.log('User is authenticated, redirecting to:', from); // Debug log
      // Navigate to target location
      navigate(from, { replace: true });
    } else {
      console.log('User is NOT authenticated, staying on login page');
    }
  }, [from, navigate, auth.isAuthenticated]);

  return (
    <div className="min-h-screen w-full gradient-background flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-3xl auth-card grid md:grid-cols-2 gap-8">
        <div className="space-y-10">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-primary leading-[1.2]">
              Transform Your Customer Support
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Pullse helps businesses deliver exceptional customer experiences
              through AI-powered support solutions.
            </p>
          </div>
          <ErrorBoundary>
            <FeatureList />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <Form {...methods}>
            <FormProvider {...methods}>
              <LoginForm />
            </FormProvider>
          </Form>
        </ErrorBoundary>
      </div>
    </div>
  );
});

SignIn.displayName = 'SignIn';

export default SignIn;
