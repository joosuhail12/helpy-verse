
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });
  };

  return (
    <div className="space-y-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-neutral-800">Welcome back</h2>
        <p className="text-gray-500">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-gray-700 font-medium">
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
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Sign In
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="flex items-center justify-between pt-4">
        <Link
          to="/signup"
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Create account
        </Link>
        <Link
          to="/forgot-password"
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
};
