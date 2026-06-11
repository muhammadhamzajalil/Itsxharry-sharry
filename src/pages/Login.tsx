import React, { useState } from "react";
import { DynamicIcon } from "../components/DynamicIcon";

interface LoginProps {
  onLoginSuccess: (token: string, user: any, refreshToken?: string) => void;
  navigate: (page: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, navigate }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onLoginSuccess(data.token, data.user, data.refreshToken);
      if (data.user.role === "admin") {
        navigate("admin");
      } else {
        navigate("dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-white overflow-hidden text-gray-900">
      
      {/* Dynamic background glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-50/60 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-green-50/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Clickable Back Anchor */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-xs font-sans text-gray-500 hover:text-gray-900 border border-gray-200/80 bg-white hover:bg-gray-50/50 px-3.5 py-2 rounded-xl shadow-xs font-bold uppercase tracking-wider mb-8 cursor-pointer transition-colors"
        >
          <DynamicIcon name="ArrowLeft" size={13} />
          Back to Home
        </button>

        {/* Form Container Card */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-8 shadow-2xl relative text-left">
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-[30px] pointer-events-none" />

          {/* Headline branding */}
          <div className="text-center pb-8 border-b border-gray-150">
            <span className="text-[10px] font-mono font-extrabold tracking-widest text-[#0B7A33] uppercase px-3.5 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
              Co-Op Partner Auth Node
            </span>
            <h2 className="mt-4 font-sans text-[32px] font-bold text-gray-950 tracking-tight leading-tight">
              Partner Workspace Login
            </h2>
            <p className="mt-2 text-xs text-gray-500 font-medium">
              Input credential parameters to open affiliate counters
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700 flex items-start gap-2 font-mono">
              <DynamicIcon name="AlertCircle" size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Pre-seeded Credentials Tip */}
          <div className="mt-5 p-4 rounded-xl bg-emerald-50/80 border border-emerald-100 text-xs text-[#0B7A33] font-mono font-medium">
            💡 <strong className="font-bold">Playground Credentials:</strong>
            <div className="mt-1.5 flex flex-col gap-1 text-gray-700 font-sans font-medium">
              <div>• User: <span className="text-gray-950 font-bold">kamran</span> / password: <span className="text-gray-950 font-bold">password123</span></div>
              <div>• Admin: <span className="text-gray-950 font-bold">admin</span> / password: <span className="text-gray-950 font-bold">password123</span></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            
            {/* Input: Username or Email */}
            <div className="flex flex-col">
              <label className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider">Username or Email</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <DynamicIcon name="User" size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. kamran"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none font-sans text-[15px] text-gray-800 transition-all font-normal"
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono text-gray-500 uppercase font-bold tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => navigate("forgot-password")}
                  className="text-[10px] font-mono font-bold text-[#0B7A33] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <DynamicIcon name="Lock" size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none font-sans text-[15px] text-gray-800 transition-all font-normal"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 py-4 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white font-sans font-semibold text-[15px] tracking-[0.02em] shadow-md transition-all flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Resolving Keys...
                </>
              ) : (
                <>
                  Establish Connection
                  <DynamicIcon name="ShieldAlert" size={14} />
                </>
              )}
            </button>

          </form>

          {/* Toggle Footnote */}
          <div className="mt-8 pt-6 border-t border-gray-150 text-center">
            <span className="text-xs text-gray-600 font-semibold">
              Not yet registered in the co-op circle?{" "}
              <button
                onClick={() => navigate("register")}
                className="text-[#0B7A33] font-bold hover:underline font-mono"
              >
                Register Here
              </button>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
