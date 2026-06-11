import React from "react";
import { DynamicIcon } from "../components/DynamicIcon";

interface CompensationPlanProps {
  navigate: (page: string) => void;
}

export const CompensationPlan: React.FC<CompensationPlanProps> = ({ navigate }) => {
  const levels = [
    { level: "Level 1: Direct Network Customers", rate: "10%", description: "Earned instantly when a retail customer purchases physical products using your unique shop link or store QR code.", examples: "E.g., 1,000 PKR commission on a 10,000 PKR checkout." },
    { level: "Level 2: Secondary Customer Downline", rate: "5%", description: "Earned on checkout sales transactions completed by customers introduced by your first-generation partners.", examples: "E.g., 500 PKR passive override from Level 2 sales." },
    { level: "Level 3: Tertiary Sales referrals", rate: "2%", description: "Residual payout distributed automatically when third-level buyers complete checkouts inside the team stream.", examples: "E.g., 200 PKR override without direct operational involvement." },
  ];

  const ranks = [
    { name: "Starter", requirement: "Automatic Onboarding", bonus: "Dashboard active access & social scripts bundle" },
    { name: "Bronze & Silver", requirement: "2 - 4 Direct Referrals", bonus: "Unlock Level 2 override access and mentoring channels" },
    { name: "Gold", requirement: "6 Directs + 12 Total Team Members", bonus: "Unlock Level 3 override access + eligibility for retail pools" },
    { name: "Diamond", requirement: "15 Directs + 50 Total Team Members", bonus: "10% global leadership pool allocation override" },
    { name: "Crown Ambassador", requirement: "50 Directs + 200 Total Team Members", bonus: "Fully covered international summit ticket + custom allowances" },
  ];

  return (
    <div className="relative min-h-screen py-24 bg-white text-gray-900 overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-left">
        
        {/* Back Link */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-xs font-sans text-gray-500 hover:text-gray-900 border border-gray-200/80 bg-white hover:bg-gray-50/50 px-3.5 py-2 rounded-xl shadow-xs font-bold uppercase tracking-wider mb-12 cursor-pointer transition-colors"
        >
          <DynamicIcon name="ArrowLeft" size={13} />
          Back to Home
        </button>

        {/* Section Header */}
        <div className="text-left border-l-4 border-[#0B7A33] pl-6 pb-2 select-none">
          <span className="text-xs font-mono tracking-widest text-[#0B7A33] uppercase font-extrabold px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            The Royalty Ledger
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold text-gray-950 tracking-tight uppercase leading-none">
            Compensation Plan
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500 font-semibold max-w-xl">
            Contract-verified product commission splits. Fully automated calculations processed on the fly by our smart ledger.
          </p>
        </div>

        {/* Level Split List */}
        <div className="mt-12 text-left space-y-6">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-gray-950 tracking-wider">3-Level Override Tree</h2>
          
          <div className="grid grid-cols-1 gap-6 select-none">
            {levels.map((lvl, index) => (
              <div key={index} className="p-6 rounded-[20px] bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                <div>
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-wider font-extrabold block">{lvl.level}</span>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl leading-relaxed font-semibold">{lvl.description}</p>
                  <span className="text-[11px] font-mono text-[#0B7A33] mt-2 block font-bold">{lvl.examples}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl sm:text-4xl font-black text-[#0B7A33] font-mono block leading-none">{lvl.rate}</span>
                  <span className="text-[9px] font-mono tracking-widest text-[#0B7A33] uppercase block mt-2 font-black">Split override</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career progressions */}
        <div className="mt-16 text-left">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-gray-950 tracking-wider">Rank Advancements Pathways</h2>
          <p className="text-xs text-gray-500 mt-1 font-medium">Auto promotions triggered on the fly by real active referrers</p>

          {/* Table styling */}
          <div className="mt-6 border border-gray-200 rounded-[16px] overflow-hidden shadow-xs font-mono text-xs">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex text-[10px] tracking-widest text-gray-400 uppercase font-extrabold">
              <div className="w-1/3">Target Rank</div>
              <div className="w-1/3 text-center sm:text-left">Requirements</div>
              <div className="w-1/3 text-right">Perks & Allowances</div>
            </div>
            
            <div className="divide-y divide-gray-150 font-bold select-none">
              {ranks.map((rnk, i) => (
                <div key={i} className="px-4 py-3.5 flex items-center hover:bg-gray-50/50 transition-colors">
                  <div className="w-1/3 font-black text-gray-950 uppercase">{rnk.name}</div>
                  <div className="w-1/3 text-gray-600 text-[11px] font-medium">{rnk.requirement}</div>
                  <div className="w-1/3 text-right text-[#0B7A33] text-[11px]">{rnk.bonus}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => navigate("register")}
            className="px-8 py-3.5 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-bold uppercase text-xs tracking-wider transition-all cursor-pointer shadow-md shadow-[#0B7A33]/15"
          >
            Activate Partnership
          </button>
        </div>

      </div>
    </div>
  );
};
