
import { memo, useEffect } from "react";
import { Logo } from "@/components/auth/Logo";
import { FeatureList } from "@/components/auth/FeatureList";
import { LoginForm } from "@/components/auth/LoginForm";
import { Form } from "@/components/ui/form";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export const SignIn = memo(() => {
  console.log('SignIn component rendering'); // Debug log
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  
  const methods = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (auth?.isAuthenticated) {
      console.log('User is authenticated, redirecting to home'); // Debug log
      navigate('/home');
    }
  }, [auth?.isAuthenticated, navigate]);

  console.log('Auth state:', auth); // Debug log

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
