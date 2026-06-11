import React from "react";
import { DynamicIcon } from "../components/DynamicIcon";

interface OpportunityProps {
  navigate: (page: string) => void;
}

export const Opportunity: React.FC<OpportunityProps> = ({ navigate }) => {
  return (
    <div className="relative min-h-screen py-24 bg-white text-gray-900 overflow-hidden">
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-50/50 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-50/50 rounded-full blur-[110px] pointer-events-none" />

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
            The Digital Frontier
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold text-gray-950 tracking-tight uppercase leading-none">
            Ecom Opportunity
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500 font-semibold max-w-xl">
            Uncapped active retail margins paired with a fully structured 3-tier overriding residual ledger. Learn why linear work is obsolete.
          </p>
        </div>

        {/* Leverage Comparison */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 select-none">
          
          <div className="p-8 rounded-[20px] bg-red-50/30 border border-red-150 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-mono text-red-700 uppercase tracking-wider font-extrabold block">Model A - Linear Overhead</span>
              <h3 className="mt-4 font-display text-xl sm:text-2xl font-extrabold text-gray-950 uppercase leading-snug">Employment & Solopreneurs</h3>
              <p className="mt-4 text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                Stuck on a stationary clock: you trade exact physical hours for fixed, indexed pay. If you take a vacation, get sick, or sleep, your monetization counter immediately stops. Solopreneur dropshippers leak extensive budgets trying to scale Facebook ads single-handedly.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-red-100 flex justify-between items-center text-xs font-mono text-red-700 font-extrabold">
              <span>ACTIVE EFFORT: 100%</span>
              <span>INCOME CAP: LOCKED</span>
            </div>
          </div>

          <div className="p-8 rounded-[20px] bg-emerald-50/30 border border-emerald-150 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-xs font-mono text-[#0B7A33] uppercase tracking-wider font-extrabold block">Model B - Leverage Protocol</span>
              <h3 className="mt-4 font-display text-xl sm:text-2xl font-extrabold text-gray-950 uppercase leading-snug">The Ecom Network Syndicate</h3>
              <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-semibold">
                By setting up pre-configured shops and onboarding other digital builders, you establish high-performance Level 1, Level 2, and Level 3 partner nodes. As they sell high-demand physical products or enroll more affiliates, you harvest overriding overrides 24/7.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-emerald-100 flex justify-between items-center text-xs font-mono text-[#0B7A33] font-bold">
              <span>ACTIVE EFFORT: DELEGATED</span>
              <span>INCOME CAP: UNLIMITED</span>
            </div>
          </div>

        </div>

        {/* Success Pathways */}
        <div className="mt-16 text-left">
          <h2 className="font-display text-2xl font-extrabold text-gray-950 uppercase tracking-tight select-none">Dual Revenue Pathways</h2>
          
          <div className="mt-6 space-y-6 select-none">
            
            <div className="p-6 rounded-[20px] bg-white border border-gray-200 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
              <span className="text-[#0B7A33] bg-emerald-50 p-2.5 px-3.5 text-xs font-mono font-black h-fit rounded-lg border border-emerald-100">01</span>
              <div>
                <h3 className="font-extrabold text-gray-950 text-base uppercase">Affiliate Drop-Shipping Margin</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 font-semibold leading-relaxed">
                  Recommend hot physical fashion, beauty, electronics, and digital licenses. Ecom Network fulfills globally and dropships to consumers instantly. You collect up to 40% retail markup.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[20px] bg-white border border-gray-200 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
              <span className="text-[#0B7A33] bg-emerald-50 p-2.5 px-3.5 text-xs font-mono font-black h-fit rounded-lg border border-emerald-100">02</span>
              <div>
                <h3 className="font-extrabold text-gray-950 text-base uppercase">Syndicate Level Royalties (MLM)</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 font-semibold leading-relaxed">
                  When other influencers register under your sponsor link, their store activations trigger automated points and recurring percentages. You leverage our pre-packaged team building tools to expand and advances your rank from Starter to Diamond and Crown.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Join CTA */}
        <div className="mt-16 text-center select-none">
          <button
            onClick={() => navigate("register")}
            className="px-8 py-4 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-bold tracking-widest uppercase text-xs shadow-md shadow-[#0B7A33]/15 transition-all cursor-pointer"
          >
            Claim Referral Code & Activate
          </button>
        </div>

      </div>
    </div>
  );
};
