"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 bg-white">
      <div className="w-full max-w-md">
        <div className="bg-navy-50 border border-navy-100 rounded-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <p className="text-gold-600 text-sm uppercase tracking-[0.25em] font-semibold mb-2">
              Welcome Back
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-900">
              Log In to Your Account
            </h1>
            <p className="text-sm text-navy-500 mt-2">
              Access your dashboard, manage bookings, and track services across all FBV subsidiaries.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-navy-500">
                <input
                  type="checkbox"
                  className="rounded border-navy-200 bg-white text-gold-500 focus:ring-gold-400"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm text-gold-600 hover:text-gold-700 transition-colors"
                onClick={() => alert("Password reset coming soon.")}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-navy-800 hover:bg-navy-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Log In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-navy-100 text-center">
            <p className="text-sm text-navy-500">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-gold-600 hover:text-gold-700 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
