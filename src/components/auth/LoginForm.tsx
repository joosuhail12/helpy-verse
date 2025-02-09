
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
    <div className="space-y-8 animate-fade-in md:pl-8" style={{ animationDelay: "0.2s" }}>
      <div className="space-y-2">
        <h2 className="text-[1.75rem] font-semibold text-neutral-800">Welcome back</h2>
        <p className="text-gray-500 text-lg">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-gray-800 font-medium text-lg">
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
          <label htmlFor="password" className="block text-gray-800 font-medium text-lg">
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

      <div className="flex items-center justify-between pt-4 text-base">
        <Link
          to="/signup"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Create account
        </Link>
        <Link
          to="/forgot-password"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
};
