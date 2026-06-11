import React from "react";
import { DynamicIcon } from "../components/DynamicIcon";

interface PricingPageProps {
  navigate: (page: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ navigate }) => {
  const milestoneBonuses = [
    { level: 1, left: 10, right: 10, bonus: 500, rankStatus: "Star Bronze Partner" },
    { level: 2, left: 25, right: 25, bonus: 1000, rankStatus: "Silver Executive" },
    { level: 3, left: 50, right: 50, bonus: 2000, rankStatus: "Gold Leader" },
    { level: 4, left: 100, right: 100, bonus: 3000, rankStatus: "Ruby Director" },
    { level: 5, left: 250, right: 250, bonus: 5000, rankStatus: "Emerald Ambassador" },
    { level: 6, left: 500, right: 500, bonus: 25000, rankStatus: "Sapphire Elite" },
    { level: 7, left: 1000, right: 1000, bonus: 40000, rankStatus: "Diamond Legend" },
    { level: 8, left: 2500, right: 2500, bonus: 125005, rankStatus: "Double Diamond" },
    { level: 9, left: 5000, right: 5000, bonus: 250000, rankStatus: "Crown Ambassador" },
    { level: 10, left: 10000, right: 10000, bonus: 500000, rankStatus: "Vice President" },
    { level: 11, left: 20000, right: 20000, bonus: 800000, rankStatus: "Senior VP" },
    { level: 12, left: 35000, right: 35000, bonus: 1000000, rankStatus: "Director Board Member" },
    { level: 13, left: 50000, right: 50000, bonus: 1500000, rankStatus: "Global Apex Chairman" }
  ];

  return (
    <div className="relative min-h-screen py-24 bg-white text-gray-900 overflow-hidden">
      {/* Decorative Warm Accent Colors */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-green-50/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10 text-left">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-xs font-sans text-gray-500 hover:text-gray-950 border border-gray-200/80 bg-white hover:bg-gray-50 px-3.5 py-2 rounded-xl shadow-xs font-bold uppercase tracking-wider mb-12 cursor-pointer transition-colors"
        >
          <DynamicIcon name="ArrowLeft" size={13} />
          Back to Home
        </button>

        {/* Section Header */}
        <div className="text-center pb-12 border-b border-gray-100 max-w-3xl mx-auto select-none">
          <span className="text-xs font-mono tracking-widest text-[#0B7A33] uppercase font-extrabold px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            Professional Multi-Level Pricing Plan
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold text-gray-950 uppercase tracking-tight leading-none">
            Compensation & Price Plan
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500 font-semibold leading-relaxed">
            Acquire your lifetime verification key in Pakistan's premium binary dropshipping system. One straightforward ticket, endless structural overrides.
          </p>
        </div>

        {/* 1. Core Core Pricing Highlight Card */}
        <div className="mt-12 bg-gray-50 border border-gray-150 rounded-[32px] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-[10px] font-mono font-black text-[#0B7A33] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded border border-emerald-100">
              One-Time Lifetime Fee
            </span>
            <h2 className="text-3xl font-black text-gray-950 uppercase tracking-tight leading-none">
              Verification <br className="hidden md:block" /> Pin License
            </h2>
            <div className="flex items-baseline gap-2 font-mono mt-4">
              <span className="text-5xl font-black text-[#0B7A33] leading-none">Rs. 950</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">PKR / Lifetime</span>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              To trigger the e-commerce dropship storefront and participate in binary commissions, profiles require a verified registration pin code.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate("register")}
                className="w-full sm:w-auto px-8 py-4 bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl shadow-md shadow-[#0B7A33]/15 transition-all cursor-pointer"
              >
                Register & Activate Now
              </button>
            </div>
          </div>

          <div className="lg:col-span-1" />

          {/* Core commission channels */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Direct Referral", payout: "Rs. 200", detail: "Paid instantly as soon as someone activates their code with your sponsor referral key." },
              { title: "Binary Pair Income", payout: "Rs. 200", detail: "Paid when 1 active user on your Left leg matches 1 active user on your Right leg." },
              { title: "Level Up Bonuses", payout: "Up to Rs. 1.5M", detail: "Separate milestone rewards as the size of your binary team legs accumulate." },
              { title: "Retail Margin Store", payout: "Up to 40%", detail: "Earn clean direct sales markups on premium dropshipping catalog inventory." }
            ].map((channel, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-gray-150 hover:border-emerald-200 transition-colors text-left space-y-2">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest font-bold">Channel 0{i+1}</span>
                <h4 className="font-extrabold text-xs uppercase text-gray-950">{channel.title}</h4>
                <div className="text-lg font-mono font-black text-[#0B7A33]">{channel.payout}</div>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{channel.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Binary Structure Explanation & Business Presentation Grid */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-xs font-mono font-black uppercase tracking-widest text-[#0B7A33] px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full select-none">
              Network Engineering
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-950 uppercase tracking-tight">
              Symmetrical Binary Tree Model
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-semibold">
              Ecom Network utilizes a symmetric 2-leg (Left & Right) organizational hierarchy. Each registered partner sponsor can directly place two active children horizontally underneath them.
            </p>
            <p className="text-gray-500 text-xs leading-relaxed font-medium">
              Subsequent referrals are placed deeper on the left or right side (the spillover mechanism), benefiting your entire downline team. Every active node inside your subtree accumulates towards matching pairs.
            </p>
            
            <div className="p-5 rounded-2xl bg-[#0B7A33]/5 border border-emerald-100 space-y-3.5">
              <h4 className="font-bold text-xs uppercase text-[#0B7A33]">Symmetrical Match Example</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                If you have <strong className="text-gray-950">15 verified users</strong> on your Left leg and <strong className="text-gray-950">12 verified users</strong> on your Right leg:
              </p>
              <div className="p-3 bg-white border border-emerald-100 rounded-lg text-xs font-mono font-bold text-gray-800">
                • Pairs completed: <span className="text-[#0B7A33]">12 Pairs</span><br />
                • Pair Income: 12 Pairs × Rs. 200 = <span className="text-[#0B7A33]">Rs. 2,400</span><br />
                • Leftover Left side queue: <span className="text-amber-600">3 nodes</span> (preserved for next matches)
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Visual Binary Graph Mockup */}
            <div className="p-8 rounded-[32px] bg-gray-50 border border-gray-150 flex flex-col items-center">
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-gray-400 font-bold mb-8">Business Structure Presentation</span>
              
              <div className="relative w-full max-w-[380px] flex flex-col gap-8">
                {/* Level 0: You */}
                <div className="flex justify-center">
                  <div className="px-5 py-2.5 bg-[#0B7A33] text-white border-2 border-emerald-300 rounded-xl text-center shadow-md font-mono font-extrabold text-xs">
                    You
                  </div>
                </div>

                {/* Level 1: Left / Right */}
                <div className="flex justify-between relative px-8">
                  {/* Decorative connection line SVG */}
                  <svg className="absolute -top-6 left-1/2 -translate-x-1/2 w-full h-8 z-0 stroke-[#0B7A33]/25" strokeWidth="1.5" strokeDasharray="3 3">
                    <line x1="15%" y1="100%" x2="50%" y2="0" />
                    <line x1="85%" y1="100%" x2="50%" y2="0" strokeWidth="1.5" />
                  </svg>

                  <div className="px-4 py-2 bg-white border border-[#0B7A33]/30 rounded-lg text-center shadow-xs font-mono text-xs font-semibold z-10 text-gray-800">
                    Left Node (Sponsor L)
                    <span className="block text-[9px] text-[#0B7A33] font-bold">Active</span>
                  </div>
                  <div className="px-4 py-2 bg-white border border-[#0B7A33]/30 rounded-lg text-center shadow-xs font-mono text-xs font-semibold z-10 text-gray-800">
                    Right Node (Sponsor R)
                    <span className="block text-[9px] text-[#0B7A33] font-bold">Active</span>
                  </div>
                </div>

                {/* Level 2: Children */}
                <div className="flex justify-between relative">
                  {/* Connection lines */}
                  <svg className="absolute -top-6 left-0 w-full h-8 z-0 stroke-gray-350" strokeWidth="1" strokeDasharray="2 2">
                    <line x1="8%" y1="100%" x2="20%" y2="0" />
                    <line x1="32%" y1="100%" x2="20%" y2="0" />
                    <line x1="68%" y1="100%" x2="80%" y2="0" />
                    <line x1="92%" y1="100%" x2="80%" y2="0" />
                  </svg>

                  <div className="p-2 bg-white border border-gray-200 rounded text-[9.5px] font-mono z-10 text-gray-500">L-Child 1</div>
                  <div className="p-2 bg-white border border-gray-200 rounded text-[9.5px] font-mono z-10 text-gray-500">L-Child 2</div>
                  <div className="p-2 bg-white border border-gray-200 rounded text-[9.5px] font-mono z-10 text-gray-500">R-Child 1</div>
                  <div className="p-2 bg-white border border-gray-200 rounded text-[9.5px] font-mono z-10 text-gray-500">R-Child 2</div>
                </div>

                <div className="text-center pt-4 border-t border-gray-200 text-[11px] text-gray-500 font-medium">
                  Each Symmetric Pair matching Left & Right leg earns you <strong className="text-[#0B7A33]">Rs. 200</strong>, down infinite depth levels!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Milestone Achievement Bonus Table (1 to 13 Levels) */}
        <div className="mt-24">
          <div className="text-left border-l-4 border-[#0B7A33] pl-5 mb-10 select-none">
            <h3 className="font-display font-black text-2xl uppercase text-gray-950 tracking-tight">
              Milestone Achievement Ranks
            </h3>
            <p className="text-xs text-gray-500 mt-1 font-semibold leading-relaxed">
              Unlock cumulative, locked level bonuses as active nodes inside your left leg and right leg reach the thresholds.
            </p>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-3xl shadow-sm">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 uppercase text-[9.5px] font-mono font-bold text-gray-500 tracking-wider">
                  <th className="p-4 pl-6">Level</th>
                  <th className="p-4">Rank Designation</th>
                  <th className="p-4">Left Leg Nodes</th>
                  <th className="p-4">Right Leg Nodes</th>
                  <th className="p-4 text-emerald-800 text-right pr-6">Milestone Bonus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 font-medium text-gray-700">
                {milestoneBonuses.map((mb) => (
                  <tr key={mb.level} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-gray-400">0{mb.level}</td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900 uppercase tracking-tight block">{mb.rankStatus}</span>
                      <span className="text-[10px] text-gray-400 font-mono">Rank Milestone level {mb.level}</span>
                    </td>
                    <td className="p-4 font-mono">{mb.left} active</td>
                    <td className="p-4 font-mono">{mb.right} active</td>
                    <td className="p-4 text-right pr-6 font-mono font-black text-[#0B7A33] text-sm">
                      Rs. {mb.bonus.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
