
import { Logo } from "@/components/auth/Logo";
import { FeatureList } from "@/components/auth/FeatureList";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen w-full gradient-background flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-3xl auth-card grid md:grid-cols-2 gap-8">
        <div className="space-y-10">
          <Logo />
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-primary leading-[1.2]">
              Recover Your Account
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              We'll help you get back into your account safely and securely.
            </p>
          </div>
          <FeatureList />
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
