
import { Logo } from "@/components/auth/Logo";
import { FeatureList } from "@/components/auth/FeatureList";
import { LoginForm } from "@/components/auth/LoginForm";

const SignIn = () => {
  return (
    <div className="min-h-screen w-full gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl auth-card grid md:grid-cols-2 gap-12">
        <div className="space-y-10">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-neutral-800">
              Transform Your Customer Support
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
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
