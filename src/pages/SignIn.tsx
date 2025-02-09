
import { Logo } from "@/components/auth/Logo";
import { FeatureList } from "@/components/auth/FeatureList";
import { LoginForm } from "@/components/auth/LoginForm";

const SignIn = () => {
  return (
    <div className="min-h-screen w-full gradient-background flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-6xl auth-card grid md:grid-cols-2 gap-16">
        <div className="space-y-14">
          <Logo />
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-neutral-800 leading-[1.2]">
              Transform Your Customer Support
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed opacity-90">
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
