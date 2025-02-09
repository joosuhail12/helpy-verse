
import { Logo } from "@/components/auth/Logo";
import { FeatureList } from "@/components/auth/FeatureList";
import { SignUpForm } from "@/components/auth/SignUpForm";

const SignUp = () => {
  return (
    <div className="min-h-screen w-full gradient-background flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-3xl auth-card grid md:grid-cols-2 gap-8">
        <div className="space-y-10">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-primary leading-[1.2]">
              Join Pullse Today
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Create your account and start delivering exceptional customer experiences
              with our AI-powered support solutions.
            </p>
          </div>
          <FeatureList />
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
