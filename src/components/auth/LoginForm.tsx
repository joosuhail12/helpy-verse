import { ArrowRight } from "lucide-react";
import { useState, memo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { loginUser } from "../../store/slices/authSlice";
import { toast } from "../../components/ui/use-toast";
import { getCookie, handleSetToken, isAuthenticated } from "@/utils/helpers/helpers";
import { HttpClient } from "@/api/services/HttpClient";

export const LoginForm = memo(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); 
  const location = useLocation();
  const auth = useAppSelector((state) => state.auth);
  const loading = auth?.loading ?? false;
  
  // Get redirect path from location state or default to /home
  const from = location.state?.from || '/home';

  // Check for auth errors and show toast
  useEffect(() => {
    if (auth.error && !loading && !isSubmitting) {
      toast({
        title: "Error",
        description: auth.error || "Login failed. Please try again.",
        variant: "destructive",
      });
    }
  }, [auth.error, loading, isSubmitting]);

  // Auto-redirect if already authenticated
  useEffect(() => {
    // Check if user is authenticated by token
    if (isAuthenticated()) {
      console.log('Already authenticated, redirecting to:', from);
      
      // Ensure token is properly set in Axios headers
      HttpClient.setAxiosDefaultConfig();
      
      // Add a delay to ensure state is settled
      setTimeout(() => {
        // First try using navigate
        navigate(from, { replace: true });
        
        // As a fallback, use window.location for more reliable redirect
        setTimeout(() => {
          window.location.href = from;
        }, 300);
      }, 300);
    }
  }, [from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email || !password) return;
    
    try {
      setIsSubmitting(true);
      
      // Add mock login for development purposes
      if ((process.env.NODE_ENV === 'development' || import.meta.env.DEV) && 
          (email === 'test@example.com' && password === 'password')) {
        console.log("Using mock login for development");
        
        // Mock successful login
        const mockToken = 'mock-token-for-development';
        const tokenSet = handleSetToken(mockToken);
        
        if (tokenSet) {
          console.log("Development mode: mock token set successfully");
          HttpClient.setAxiosDefaultConfig();
          
          toast({
            title: "Development Mode",
            description: "Logged in with mock credentials",
          });
          
          // Short delay before redirect
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        } else {
          console.error("Development mode: Failed to set mock token");
          toast({
            title: "Error",
            description: "Development mode login failed - cookie issue",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
        return;
      }
      
      // Real login process
      console.log("Attempting real login");
      const result = await dispatch(loginUser({ email, password })).unwrap();
      
      // Handle successful login
      if (result && result.data && result.data.accessToken) {
        console.log("Login successful, verifying token setup");
        
        // Verify token was properly set
        const token = getCookie("customerToken");
        
        if (token) {
          console.log("Token verified in cookie after login");
          toast({
            title: "Success",
            description: "Logged in successfully",
          });
          
          // Ensure Axios is configured with the token
          HttpClient.setAxiosDefaultConfig();
          
          // Add a delay to ensure toast is visible before redirect
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        } else {
          console.error("Token not found in cookie after login");
          // Try to set token again
          handleSetToken(result.data.accessToken.token);
          
          // Verify again
          const retryToken = getCookie("customerToken");
          if (retryToken) {
            console.log("Token set on retry");
            setTimeout(() => {
              navigate(from, { replace: true });
            }, 1000);
          } else {
            throw new Error("Failed to set authentication token");
          }
        }
      } else {
        console.error("Login response missing token data", result);
        toast({
          title: "Error",
          description: "Invalid login response from server",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || "Login failed. Please check your network connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl bg-white/50 backdrop-blur-sm p-6 shadow-xl border border-white/20">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 transition-colors duration-300 hover:text-primary">
          Welcome back
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-300">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-gray-700 font-medium text-sm transition-colors duration-300">
            Email
          </label>
          <input
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
            disabled={loading || isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-gray-700 font-medium text-sm transition-colors duration-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/70 border border-gray-200 
                     focus:border-primary/30 focus:ring-2 focus:ring-primary/20 
                     hover:border-primary/30 transition-all duration-300 ease-in-out
                     placeholder:text-gray-400 text-gray-800"
            required
            disabled={loading || isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium 
                   py-2.5 px-4 rounded-lg transition-all duration-300 ease-in-out 
                   flex items-center justify-center gap-2 hover:shadow-lg 
                   active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? 'Signing in...' : 'Sign In'}
          {!loading && !isSubmitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <div className="flex items-center justify-between pt-2 text-sm">
        <Link
          to="/sign-up"
          className="text-primary hover:text-primary/80 font-medium transition-all duration-300 
                   ease-in-out hover:translate-x-0.5 transform flex items-center gap-1"
        >
          Create account
        </Link>
        <Link
          to="/forgot-password"
          className="text-primary hover:text-primary/80 font-medium transition-all duration-300 
                   ease-in-out hover:translate-x-0.5 transform flex items-center gap-1"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';
