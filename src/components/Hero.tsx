import React, { useState } from "react";
import { DynamicIcon } from "./DynamicIcon";

interface HeroProps {
  navigate?: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ navigate }) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [phoneText, setPhoneText] = useState("+ Rs. 2,500");
  const [phoneSource, setPhoneSource] = useState("Direct Commission");

  const highlightNodes = [
    { id: "store", label: "Smart Store", icon: "ShoppingBag", value: "+ Rs. 500", source: "E-com Retail Sale" },
    { id: "network", label: "Team Override", icon: "GitMerge", value: "+ Rs. 2,500", source: "Multi-tier Loyalty Overwrite" },
    { id: "affiliate", label: "Viral Affiliates", icon: "Link2", value: "+ Rs. 1,000", source: "TikTok Link Conversion" },
    { id: "passive", label: "Residual Royalty", icon: "Sparkles", value: "+ Rs. 5,000", source: "Software License Upgrade" }
  ];

  const handleNodeHover = (node: typeof highlightNodes[0]) => {
    setActiveNode(node.id);
    setPhoneText(node.value);
    setPhoneSource(node.source);
  };

  return (
    <section id="overview" className="relative pt-32 pb-24 md:pt-40 md:pb-36 bg-white text-gray-900 overflow-hidden">
      
      {/* Background Gradient Radial Orbs (Corporate Soft Highlights) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-green-50/50 rounded-full blur-[130px] pointer-events-none" />
      
      {/* High-End Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(11, 122, 51, 0.08)" strokeWidth="0.8" />
            <circle cx="40" cy="0" r="1" fill="rgba(11, 122, 51, 0.15)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Context Left */}
          <div className="col-span-1 lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
            
            {/* Live Indicator Corporate Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0B7A33]/20 bg-emerald-50/60 text-[#0B7A33] text-xs font-mono font-bold tracking-wide w-fit mx-auto lg:mx-0 mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#12A84A] animate-ping" />
              <span>THE FUTURE OF E-COMMERCE & MLM</span>
            </div>

            <h1 className="font-sans text-[40px] md:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[110%] text-gray-950 uppercase">
              Turn Connections <br className="hidden sm:inline" />
              Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B7A33] via-[#12A84A] to-[#1EC95B]">Commissions</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Build your network, grow your e-commerce business, and earn recurring commissions through the next generation of digital entrepreneurship. Leverage our automated logistics and ready-made funnel systems.
            </p>

            {/* Direct CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              
              <button
                onClick={() => navigate ? navigate("register") : undefined}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white font-bold tracking-wide uppercase shadow-[0_8px_30px_rgb(11,122,51,0.18)] hover:shadow-[0_12px_40px_rgb(11,122,51,0.28)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Start Your Journey
                <DynamicIcon name="ArrowRight" size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-gray-200 hover:border-[#0B7A33]/30 bg-white hover:bg-gray-50 font-bold tracking-wide uppercase text-gray-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0B7A33]/10 text-[#0B7A33]">
                  <DynamicIcon name="Play" size={10} fill="currentColor" className="ml-0.5" />
                </span>
                Watch Demo
              </button>

            </div>

            {/* Micro Proof Line */}
            <div className="mt-8 py-4 border-t border-gray-100 flex items-center justify-center lg:justify-start gap-6">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80" alt="member" referrerPolicy="no-referrer" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=64&q=80" alt="member" referrerPolicy="no-referrer" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&q=80" alt="member" referrerPolicy="no-referrer" />
              </div>
              <p className="text-xs text-gray-500 font-medium">
                ⭐ <span className="font-bold text-gray-900">50,000+ members</span> joined & generating recurring residuals.
              </p>
            </div>

          </div>

          {/* Interactive Illustration Area Right */}
          <div className="col-span-1 lg:col-span-6 relative flex justify-center py-10">
            
            {/* Soft Pulsing Core Radar Background */}
            <div className="absolute w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full border border-emerald-100 animate-pulse-slow pointer-events-none" />
            <div className="absolute w-[200px] sm:w-[280px] h-[200px] sm:h-[280px] rounded-full border border-emerald-50/60 pointer-events-none" />

            {/* Glowing Connection Nodes Layout */}
            <div className="relative w-[340px] sm:w-[400px] h-[440px] flex items-center justify-center">
              
              {/* Premium Silver iPhone Device Layer */}
              <div className="relative z-20 w-[190px] h-[380px] rounded-[38px] bg-white border-[6px] border-gray-100 p-2.5 shadow-[0_24px_50px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                {/* Speaker pill */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-100 rounded-b-xl z-30 flex items-center justify-center">
                  <div className="w-10 h-0.5 bg-gray-300 rounded-full" />
                </div>
                
                {/* Simulated Screen Inner Container */}
                <div className="relative h-full w-full bg-gray-50/75 rounded-[28px] flex flex-col justify-between py-6 px-3.5 text-center overflow-hidden border border-gray-200/50">
                  
                  {/* Subtle Grid on Phone */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(11,122,51,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(11,122,51,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                  
                  {/* Digital Header */}
                  <div className="relative z-10 pt-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#0B7A33] uppercase font-bold">ECOSYSTEM WALLET</span>
                    <h4 className="text-[10px] text-gray-500 mt-0.5 font-medium">Live Account Clearance</h4>
                  </div>

                  {/* Interactive Dynamic text */}
                  <div className="relative z-10 my-auto flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-[#0B7A33] mb-2 shadow-sm">
                      <DynamicIcon name="Sparkles" size={18} className="animate-spin-slow" />
                    </div>
                    {/* Glowing ledger entry display */}
                    <span className="font-mono text-xl font-bold text-gray-900 tracking-tight">
                      {phoneText}
                    </span>
                    <span className="text-[9px] text-[#0B7A33] font-mono mt-1 border border-[#0B7A33]/20 px-2 py-0.5 rounded-full bg-[#0B7A33]/5 font-bold">
                      {phoneSource}
                    </span>
                  </div>

                  {/* Micro dashboard mock lines */}
                  <div className="relative z-10 w-full bg-white rounded-xl p-2.5 flex flex-col gap-1.5 border border-gray-200/60 shadow-sm">
                    <div className="flex justify-between text-[8px] text-gray-500 font-bold">
                      <span>Network Reach</span>
                      <span className="text-gray-900">+ 238 Active</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#0B7A33] h-full w-4/5 animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[7px] text-gray-400 pt-0.5">
                      <span>Conversion Power</span>
                      <span className="text-[#0B7A33] font-bold">94.8% Active</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Connected Global Mesh Dynamic Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 400">
                <g stroke="#0B7A33" strokeWidth="1.2" strokeDasharray="4 4" className="opacity-25">
                  <line x1="200" y1="200" x2="60" y2="100" />
                  <line x1="200" y1="200" x2="340" y2="100" />
                  <line x1="200" y1="200" x2="60" y2="300" />
                  <line x1="200" y1="200" x2="340" y2="300" />
                </g>
              </svg>

              {/* Interactive Node 1: Smart Store */}
              <div 
                className={`absolute -top-4 sm:-top-8 left-0 z-30 cursor-pointer group transition-all duration-300 ${
                  activeNode === "store" ? "scale-110" : "scale-100"
                }`}
                onMouseEnter={() => handleNodeHover(highlightNodes[0])}
              >
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-gray-200 hover:border-[#0B7A33]/40 shadow-md text-xs font-semibold">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-[#0B7A33] flex items-center justify-center">
                    <DynamicIcon name="ShoppingBag" size={14} />
                  </span>
                  <div className="text-left">
                    <h5 className="text-[9px] text-[#0B7A33] leading-none font-bold">LAUNCH</h5>
                    <span className="text-gray-900 font-bold">Smart Store</span>
                  </div>
                </div>
              </div>

              {/* Interactive Node 2: Team Override */}
              <div 
                className={`absolute top-1/4 -right-10 sm:-right-16 z-30 cursor-pointer group transition-all duration-300 ${
                  activeNode === "network" ? "scale-110" : "scale-100"
                }`}
                onMouseEnter={() => handleNodeHover(highlightNodes[1])}
              >
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-gray-200 hover:border-[#0B7A33]/40 shadow-md text-xs font-semibold">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-[#0B7A33] flex items-center justify-center">
                    <DynamicIcon name="GitMerge" size={14} />
                  </span>
                  <div className="text-left">
                    <h5 className="text-[9px] text-[#0B7A33] leading-none font-bold">BUILD</h5>
                    <span className="text-gray-900 font-bold">Team Override</span>
                  </div>
                </div>
              </div>

              {/* Interactive Node 3: Viral Affiliates */}
              <div 
                className={`absolute -bottom-6 sm:-bottom-10 left-4 z-30 cursor-pointer group transition-all duration-300 ${
                  activeNode === "affiliate" ? "scale-110" : "scale-100"
                }`}
                onMouseEnter={() => handleNodeHover(highlightNodes[2])}
              >
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-gray-200 hover:border-[#0B7A33]/40 shadow-md text-xs font-semibold">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-[#0B7A33] flex items-center justify-center">
                    <DynamicIcon name="Link2" size={14} />
                  </span>
                  <div className="text-left">
                    <h5 className="text-[9px] text-[#0B7A33] leading-none font-bold">SHARE</h5>
                    <span className="text-gray-900 font-bold">TikTok Affiliate</span>
                  </div>
                </div>
              </div>

              {/* Interactive Node 4: Residual Royalty */}
              <div 
                className={`absolute top-2/3 -left-12 sm:-left-20 z-30 cursor-pointer group transition-all duration-300 ${
                  activeNode === "passive" ? "scale-110" : "scale-100"
                }`}
                onMouseEnter={() => handleNodeHover(highlightNodes[3])}
              >
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-gray-200 hover:border-[#0B7A33]/40 shadow-md text-xs font-semibold">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-[#0B7A33] flex items-center justify-center">
                    <DynamicIcon name="Sparkles" size={14} />
                  </span>
                  <div className="text-left">
                    <h5 className="text-[9px] text-[#0B7A33] leading-none font-bold">MULTIPLY</h5>
                    <span className="text-gray-900 font-bold">Royalties</span>
                  </div>
                </div>
              </div>

              {/* FLOATING GREEN COMMISSIONS CARDS */}
              
              {/* +$500 Card */}
              <div className="absolute top-2 sm:top-4 right-1/4 z-10 animate-float">
                <div className="px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-[#0B7A33] font-mono font-bold text-xs tracking-wide shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12A84A] animate-pulse" />
                  +Rs. 500
                </div>
              </div>

              {/* +$1000 Card */}
              <div className="absolute bottom-1/3 -right-6 sm:-right-12 z-10 animate-float-delayed" style={{ animationDelay: "1s" }}>
                <div className="px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-[#0B7A33] font-mono font-extrabold text-sm tracking-wide shadow-md flex items-center gap-1.5">
                  <DynamicIcon name="TrendingUp" size={12} />
                  +Rs. 1000
                </div>
              </div>

              {/* +$2500 Card */}
              <div className="absolute top-1/2 left-0 sm:-left-8 z-10 animate-float" style={{ animationDelay: "3s" }}>
                <div className="px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-[#0B7A33] font-mono font-bold text-xs tracking-wide shadow-md flex items-center gap-1">
                  <span>💎</span>
                  +Rs. 2500
                </div>
              </div>

              {/* +$5000 Card */}
              <div className="absolute -bottom-8 right-10 sm:right-16 z-10 animate-float-delayed" style={{ animationDelay: "2s" }}>
                <div className="px-4 py-2 rounded-2xl bg-white border border-emerald-200 text-[#0B7A33] font-mono font-extrabold text-base tracking-widest shadow-lg flex items-center gap-2">
                  <DynamicIcon name="TrendingUp" size={14} />
                  +Rs. 5000
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* POPUP WATCH DEMO MODAL SIMULATOR */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <h3 className="font-display font-bold text-lg tracking-tight">Ecom Network platform demonstration</h3>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
              >
                <DynamicIcon name="X" size={20} />
              </button>
            </div>

            {/* Simulated Live Pitch Demonstration Frame */}
            <div className="flex-1 overflow-y-auto py-6 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[300px]">
              
              {/* Virtual Speaker Pitch Overlay details */}
              <div className="md:col-span-4 flex flex-col gap-4 text-left">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="text-xs text-[#0B7A33] font-mono font-bold uppercase">Topic 1: Smart Store Payouts</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Every member receives a fully customized global e-store equipped with trending items. When sales complete, our drop-shipping center fulfills.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="text-xs text-indigo-700 font-mono font-bold uppercase">Topic 2: Automation System</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Deploy social media templates containing pre-baked referral triggers. Watch commissions flow in automatically as user levels duplicate.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <h4 className="text-xs text-[#0B7A33] font-mono font-bold uppercase">Average Member Income</h4>
                  <div className="mt-2 text-2xl font-mono font-bold text-gray-900">Rs. 45,000<span className="text-xs text-gray-500 font-normal">/mo</span></div>
                  <p className="text-[10px] text-gray-500">Based on active members at month 3.</p>
                </div>
              </div>

              {/* Animated Interactive Diagram inside demo */}
              <div className="md:col-span-8 bg-gray-50 rounded-xl border border-gray-200/60 p-4 flex flex-col justify-between overflow-hidden relative min-h-[300px]">
                
                {/* Simulated playback visual */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-100 text-red-600 text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  LIVE DEMO PLAYER
                </div>

                {/* Dashboard Ledger simulation looping */}
                <div className="flex-1 flex flex-col justify-center items-center gap-4 py-4 text-center">
                  <div className="relative w-16 h-16 rounded-full border border-emerald-200 flex items-center justify-center bg-emerald-50">
                    <DynamicIcon name="TrendingUp" size={28} className="text-[#0B7A33] animate-bounce" />
                    <span className="absolute inset-0 rounded-full border border-[#0B7A33] animate-ping opacity-25" />
                  </div>
                  <div>
                    <h5 className="font-display font-medium text-gray-950 text-base font-bold">Ecom Network Commission Engine</h5>
                    <p className="text-xs text-gray-500 max-w-sm mt-1 mx-auto">
                      Simulated payout workflow: Viral Traffic → Store Checkout → Automation clearance → Instantly into Your Wallet.
                    </p>
                  </div>

                  {/* Flow pipeline */}
                  <div className="flex gap-2 items-center w-full max-w-xs justify-center font-mono text-[9px] text-gray-500 mt-2">
                    <span className="px-1.5 py-0.5 rounded bg-white border border-gray-200 shadow-xs">Consumer</span>
                    <DynamicIcon name="ChevronRight" size={10} />
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[#0B7A33] border border-emerald-200/50 font-bold">Smart Store</span>
                    <DynamicIcon name="ChevronRight" size={10} />
                    <span className="px-1.5 py-0.5 rounded bg-white border border-gray-200 shadow-xs select-none">You (+Rs.)</span>
                  </div>
                </div>

                {/* Simulated Payout Success notification bar */}
                <div className="w-full bg-emerald-500/5 rounded-lg border border-emerald-500/10 p-3 flex justify-between items-center bg-white shadow-xs">
                  <div className="flex items-center gap-2 text-left">
                    <span className="p-1 rounded bg-[#0B7A33] text-white"><DynamicIcon name="Check" size={10} /></span>
                    <div>
                      <h6 className="text-[10px] font-bold text-gray-900">Direct Transfer Complete</h6>
                      <p className="text-[8px] text-gray-500">Withdrawal cleared instantly to Bank Account</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#0B7A33]">+Rs. 500</span>
                </div>

              </div>

            </div>

            {/* Modal actions */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
              <span className="text-[11px] text-gray-500">Ready to start earning commissions? No complex setups required.</span>
              <div className="flex gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => { setShowDemoModal(false); }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 text-xs text-gray-600 hover:text-gray-950 font-medium cursor-pointer"
                >
                  Close Demo
                </button>
                <button
                  onClick={() => {
                    setShowDemoModal(false);
                    if (navigate) navigate("register");
                  }}
                  className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-bold tracking-wide uppercase text-center cursor-pointer"
                >
                  Join Ecom Network Now
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
