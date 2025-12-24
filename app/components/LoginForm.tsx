"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      // Redirect is handled by the login page component
    } catch (err: any) {
      setError(
        err.code === "auth/invalid-credential" || err.code === "auth/invalid-email" || err.code === "auth/wrong-password"
          ? "Invalid email or password"
          : err.message || "Failed to login"
      );
      console.error("Login error: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-[#171718]/5">
      <h2 className="text-3xl font-serif font-semibold mb-6 text-[#171718]">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-[#171718]"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-3 border border-[#171718]/10 rounded-xl bg-white/50 backdrop-blur-sm text-[#171718] placeholder:text-[#171718]/40 focus:outline-none focus:ring-2 focus:ring-[#171718]/20 focus:border-[#171718]/20 transition-all duration-300"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 text-[#171718]"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-3 border border-[#171718]/10 rounded-xl bg-white/50 backdrop-blur-sm text-[#171718] placeholder:text-[#171718]/40 focus:outline-none focus:ring-2 focus:ring-[#171718]/20 focus:border-[#171718]/20 transition-all duration-300"
            placeholder="Enter your password"
          />
        </div>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-[#171718] hover:bg-[#171718]/90 disabled:bg-[#171718]/50 text-[#ECE7E1] font-medium rounded-full transition-all duration-300 disabled:cursor-not-allowed hover:shadow-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

