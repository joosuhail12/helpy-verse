
import { ArrowRight } from "lucide-react";
import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { registerUser } from "../../store/slices/authSlice";
import { toast } from "../../components/ui/use-toast";

export const SignUpForm = memo(() => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ fullName, email, password, companyName })).unwrap();
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 rounded-2xl bg-white/50 backdrop-blur-sm p-8 shadow-xl border border-white/20">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-primary">
          Create Account
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-300">
          Fill in your details to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label htmlFor="fullName" className="input-label">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="input-field"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="input-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@example.com"
            className="input-field"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="input-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field"
            required
            disabled={loading}
            minLength={8}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="companyName" className="input-label">
            Company Name
          </label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Inc."
            className="input-field"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <div className="flex items-center justify-center pt-2 text-sm">
        <Link
          to="/sign-in"
          className="text-primary hover:text-primary/80 font-medium transition-all duration-300 
                   ease-in-out hover:translate-x-0.5 transform flex items-center gap-1"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
});

SignUpForm.displayName = 'SignUpForm';
