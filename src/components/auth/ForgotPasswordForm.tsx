
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { requestPasswordReset } from "../../store/slices/authSlice";
import { toast } from "../../components/ui/use-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(requestPasswordReset({ email })).unwrap();
      toast({
        title: "Success",
        description: "Password reset instructions have been sent to your email",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset instructions. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in rounded-2xl bg-white/50 backdrop-blur-sm p-6 shadow-xl border border-white/20" style={{ animationDelay: "0.2s" }}>
      <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-primary">
          Reset Password
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-300">
          Enter your email address and we'll send you instructions to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Label htmlFor="email" className="block text-gray-700 font-medium text-sm transition-colors duration-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@example.com"
            className="w-full px-4 py-2.5 rounded-lg bg-white/70 border border-gray-200 
                     focus:border-primary/30 focus:ring-2 focus:ring-primary/20 
                     hover:border-primary/30 transition-all duration-300 ease-in-out
                     placeholder:text-gray-400 text-gray-800"
            required
            disabled={loading}
          />
        </div>

        <Button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Instructions'}
          {!loading && <ArrowRight className="w-4 h-4 animate-slide-in-right" />}
        </Button>
      </form>

      <div className="flex items-center justify-center pt-2 text-sm animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <Link
          to="/sign-in"
          className="text-primary hover:text-primary/80 font-medium transition-all duration-300 
                   ease-in-out hover:translate-x-0.5 transform flex items-center gap-1"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
