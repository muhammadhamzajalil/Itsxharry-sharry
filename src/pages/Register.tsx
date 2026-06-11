import React, { useState, useEffect } from "react";
import { DynamicIcon } from "../components/DynamicIcon";

interface RegisterProps {
  onLoginSuccess: (token: string, user: any, refreshToken?: string) => void;
  navigate: (page: string) => void;
}

export const Register: React.FC<RegisterProps> = ({ onLoginSuccess, navigate }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    country: "Pakistan",
    password: "",
    confirmPassword: "",
    referralCode: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto capture referral code from URL if present (e.g. ?ref=USER123)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setFormData((prev) => ({ ...prev, referralCode: ref }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Onboarding failed.");
      }

      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(data.token, data.user, data.refreshToken);
        navigate("dashboard");
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-24 px-4 bg-white overflow-hidden text-gray-900">
      
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-50/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-50/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Navigation back triggers */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-xs font-sans text-gray-500 hover:text-gray-900 border border-gray-200/80 bg-white hover:bg-gray-50/50 px-3.5 py-2 rounded-xl shadow-xs font-bold uppercase tracking-wider mb-8 cursor-pointer transition-colors"
        >
          <DynamicIcon name="ArrowLeft" size={13} />
          Back to Home
        </button>

        <div className="bg-white border border-gray-200 rounded-[20px] p-6 sm:p-10 shadow-2xl relative text-left">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-[40px] pointer-events-none" />

          {/* Title Node */}
          <div className="text-center pb-8 border-b border-gray-150">
            <span className="text-[10px] font-mono font-extrabold tracking-widest text-[#0B7A33] uppercase px-3.5 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
              verified system protocol
            </span>
            <h2 className="mt-4 font-sans text-[32px] font-bold text-gray-950 tracking-tight leading-tight">
              Join Ecom Network
            </h2>
            <p className="mt-2 text-xs text-gray-500 max-w-md mx-auto font-medium">
              Create a complimentary partner agency workspace loaded with physical drop-ship configurations & multi-tier tracking nodes.
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700 flex items-start gap-2 font-mono">
              <DynamicIcon name="AlertCircle" size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-[#0B7A33] flex items-start gap-2 font-mono font-bold">
              <DynamicIcon name="CheckCircle" size={16} className="shrink-0 mt-0.5 animate-bounce" />
              <span>ONBOARDING SUCCESS! Activating and pre-configuring affiliate counters...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Input Name */}
            <div className="flex flex-col">
              <label className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kamran Shah"
                className="px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none font-sans text-[15px] text-gray-800 transition-all font-normal"
              />
            </div>

            {/* Input Username */}
            <div className="flex flex-col">
              <label className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider mb-2">Username</label>
              <input
                type="text"
                required
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. kamran"
                className="px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none font-sans text-[15px] text-gray-800 transition-all font-normal"
              />
            </div>

            {/* Input Email */}
            <div className="flex flex-col">
              <label className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. kamran@gmail.com"
                className="px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none font-sans text-[15px] text-gray-800 transition-all font-normal"
              />
            </div>

            {/* Input Mobile */}
            <div className="flex flex-col">
              <label className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider mb-2">WhatsApp / Mobile Number</label>
              <input
                type="tel"
                required
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="e.g. 03241651892"
                className="px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none font-sans text-[15px] text-gray-800 transition-all font-normal"
              />
            </div>

            {/* Input Country */}
            <div className="flex flex-col">
              <label className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider mb-2">Country Territory</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:border-[#0B7A33]/50 font-sans text-[15px] font-normal"
              >
                <option value="Pakistan">Pakistan</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
              </select>
            </div>

            {/* Input Sponsor Referral Code (Optional) */}
            <div className="flex flex-col">
              <label className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider mb-2">Sponsor ID / Referral Code (Optional)</label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="e.g. HQNODE"
                className="px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none font-sans text-[15px] text-gray-800 transition-all font-normal"
              />
            </div>

            {/* Input Password */}
            <div className="flex flex-col">
              <label className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider mb-2">Password Parameters</label>
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none font-sans text-[15px] text-gray-800 transition-all font-normal"
              />
            </div>

            {/* Input Confirm Password */}
            <div className="flex flex-col">
              <label className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider mb-2">Confirm Password Parameters</label>
              <input
                type="password"
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none font-sans text-[15px] text-gray-800 transition-all font-normal"
              />
            </div>

            {/* Button */}
            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-4 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white font-sans font-semibold text-[15px] tracking-[0.02em] shadow-md transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin shrink-0" />
                    ACTIVATING BLOCKCHAIN CHAIN NODE...
                  </>
                ) : (
                  <>
                    Inbound Registration & Claim Storefront
                    <DynamicIcon name="Rocket" size={14} />
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Footnote */}
          <div className="mt-8 pt-6 border-t border-gray-150 text-center">
            <span className="text-xs text-gray-600 font-semibold">
              Already registered your partner coordinates?{" "}
              <button
                onClick={() => navigate("login")}
                className="text-[#0B7A33] font-bold hover:underline font-mono"
              >
                Log In Here
              </button>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
