
import { Logo } from "@/components/auth/Logo";
import { FeatureList } from "@/components/auth/FeatureList";
import { LoginForm } from "@/components/auth/LoginForm";

const SignIn = () => {
  return (
    <div className="min-h-screen w-full gradient-background flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-5xl auth-card grid md:grid-cols-2 gap-12">
        <div className="space-y-12">
          <Logo />
          <div className="space-y-5">
            <h1 className="text-3xl font-bold text-primary leading-[1.2]">
              Transform Your Customer Support
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Pullse helps businesses deliver exceptional customer experiences
              through AI-powered support solutions.
            </p>
          </div>
          <FeatureList />
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default SignIn;
