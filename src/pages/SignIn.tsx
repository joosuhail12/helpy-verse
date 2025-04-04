
import { memo, useEffect } from "react";
import { Logo } from "@/components/auth/Logo";
import { FeatureList } from "@/components/auth/FeatureList";
import { LoginForm } from "@/components/auth/LoginForm";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AuthService } from "@/services/authService";

export const SignIn = memo(() => {
  console.log('SignIn component rendering'); // Debug log
  
  // Redirect if already authenticated - using AuthService's isAuthenticated
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      console.log('User is authenticated, redirecting to home'); // Debug log
      window.location.href = '/home';
    } else {
      console.log('User is NOT authenticated, staying on login page');
    }
  }, []);

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
          <LoginForm />
        </ErrorBoundary>
      </div>
    </div>
  );
});

SignIn.displayName = 'SignIn';

export default SignIn;
