"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    serviceInterest: "General Inquiry",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 bg-white">
      <div className="w-full max-w-lg">
        {step === "form" ? (
          <div className="bg-navy-50 border border-navy-100 rounded-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <p className="text-gold-600 text-sm uppercase tracking-[0.25em] font-semibold mb-2">
                Get Started
              </p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-900">
                Create Your Account
              </h1>
              <p className="text-sm text-navy-500 mt-2">
                Join Future Bright Ventures to access services across all our subsidiaries.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                  Company (Optional)
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                  Service Interest *
                </label>
                <select
                  name="serviceInterest"
                  required
                  value={formData.serviceInterest}
                  onChange={handleChange}
                  className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-sm text-navy-900 focus:outline-none focus:border-gold-400 transition-colors appearance-none"
                >
                  <option>General Inquiry</option>
                  <option>Future Bright Consultancy</option>
                  <option>Bright Academy</option>
                  <option>Bright Eco-Farms</option>
                  <option>Bright Tours and Travel</option>
                  <option>Bright Elite Tours & Travels</option>
                  <option>Bright Real Estate & Property</option>
                  <option>Bright Homes & Resort</option>
                  <option>Outdoor Events & Team Building</option>
                  <option>Bright Foundation</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white border border-navy-200 rounded-lg px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-navy-800 hover:bg-navy-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Create Account
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="text-center text-sm text-navy-500 mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-gold-600 hover:text-gold-700 font-medium transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        ) : (
          <div className="bg-navy-50 border border-navy-100 rounded-xl p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-gold-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">
              Welcome to Future Bright Ventures
            </h2>
            <p className="text-sm text-navy-600 mb-6">
              Your account has been created. Our team will reach out to you within 24 hours to finalize your onboarding.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Go to Home
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-navy-300 hover:border-gold-500 text-navy-900 font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
