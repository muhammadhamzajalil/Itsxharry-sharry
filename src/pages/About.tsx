import React from "react";
import { DynamicIcon } from "../components/DynamicIcon";

interface AboutProps {
  navigate: (page: string) => void;
}

export const About: React.FC<AboutProps> = ({ navigate }) => {
  return (
    <div className="relative min-h-screen py-24 bg-white text-gray-900 overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-left">
        
        {/* Back navigation */}
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
            Corporate Blueprint & Heritage
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold text-gray-950 tracking-tight uppercase leading-none">
            Ecom Network Story
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500 font-semibold max-w-xl">
            Established for contract-verified affiliate leverage, Ecom Network combines direct physical dropshipping fulfillment and 3-Tier marketing structures under one elegant console.
          </p>
        </div>

        {/* Detailed Description */}
        <div className="mt-12 space-y-8 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
          <p>
            Ecom Network International was founded under the core principle of <strong className="text-gray-950 font-bold">democratizing high-scale commerce</strong>. Traditional dropship operators face exhausting overheads: managing complex suppliers, handling dispute resolution, and bleeding massive ad spend budgets. Traditional multilevel sellers are forced to stash physically slow, expensive inventory under their bed, relying on calling close relatives.
          </p>

          <p>
            We engineered a better way. By linking high-quality global inventory directly with local payment cleared channels in Pakistan and worldwide, Ecom Network takes care of everything: complete warehouse custody, automated shipping, and responsive web store presets. Your focus is strictly local scaling—influencing circles, connecting other ambitious entrepreneurs, and tracking high-impact, contract-verified commission overrides.
          </p>

          {/* Pillars of success */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-gray-200/80 select-none">
            <div className="p-6 rounded-[20px] bg-white border border-gray-200 shadow-sm flex gap-4">
              <span className="text-[#0B7A33] shrink-0 bg-emerald-50 p-2.5 h-fit rounded-[12px] border border-emerald-100">
                <DynamicIcon name="ShieldCheck" size={20} />
              </span>
              <div>
                <h3 className="font-display font-extrabold text-gray-950 text-base uppercase">Clearance Desk</h3>
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  No delays, no missing invoices. Every direct retail margin and multilevel override is compiled in real-time and cleared direct to local bank lines automatically.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[20px] bg-white border border-gray-200 shadow-sm flex gap-4">
              <span className="text-[#0B7A33] shrink-0 bg-emerald-50 p-2.5 h-fit rounded-[12px] border border-emerald-100">
                <DynamicIcon name="Cpu" size={20} />
              </span>
              <div>
                <h3 className="font-display font-extrabold text-gray-950 text-base uppercase">Inbuilt AI Copywriting</h3>
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  Generate hyper-converting scripts for TikTok captions, WhatsApp broadcast templates, or Facebook campaigns instantly to maximize conversion velocities.
                </p>
              </div>
            </div>
          </div>

          {/* Stat block */}
          <div className="mt-12 bg-emerald-50/50 border border-emerald-100 p-8 rounded-[20px] grid grid-cols-3 gap-4 text-center font-mono font-bold shadow-xs select-none">
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-[#0B7A33]">50,000+</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1.5 block">Active Partners</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-[#0B7A33]">{`10M+`}</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1.5 block">Royalties (PKR)</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-[#0B7A33]">100%</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1.5 block">SLA Verified</span>
            </div>
          </div>

        </div>

        {/* Action Bottom */}
        <div className="mt-16 flex justify-center gap-4">
          <button
            onClick={() => navigate("register")}
            className="px-6 py-3 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-bold uppercase text-xs tracking-wider transition-all cursor-pointer shadow-md shadow-[#0B7A33]/15"
          >
            Create Agency Now
          </button>
          <button
            onClick={() => navigate("contact")}
            className="px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Support Coordinates
          </button>
        </div>

      </div>
    </div>
  );
};
