
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { loginUser } from "../../store/slices/authSlice";
import { toast } from "../../components/ui/use-toast";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-xl font-semibold text-neutral-800 transition-colors duration-300 hover:text-primary">Welcome back</h2>
        <p className="text-gray-500 text-sm transition-colors duration-300">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <label htmlFor="email" className="block text-gray-800 font-medium text-sm transition-colors duration-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@example.com"
            className="input-field hover:scale-[1.01] transition-all duration-300 ease-in-out"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <label htmlFor="password" className="block text-gray-800 font-medium text-sm transition-colors duration-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field hover:scale-[1.01] transition-all duration-300 ease-in-out"
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-in-out"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
          {!loading && <ArrowRight className="w-3.5 h-3.5 animate-slide-in-right" />}
        </button>
      </form>

      <div className="flex items-center justify-between pt-2 text-xs animate-fade-in" style={{ animationDelay: "0.6s" }}>
        <Link
          to="/signup"
          className="text-primary hover:text-primary/80 transition-all duration-300 ease-in-out hover:scale-105 transform"
        >
          Create account
        </Link>
        <Link
          to="/forgot-password"
          className="text-primary hover:text-primary/80 transition-all duration-300 ease-in-out hover:scale-105 transform"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
};
