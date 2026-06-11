import React from "react";
import { FEATURES_DATA } from "../data";
import { DynamicIcon } from "./DynamicIcon";

export const Features: React.FC = () => {
  return (
    <section id="features" className="relative py-24 bg-white text-gray-900 overflow-hidden border-t border-gray-100">
      
      {/* Decorative Warm Radial Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-50/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F8FAFC] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-mono font-bold tracking-widest text-[#0B7A33] uppercase bg-emerald-50/60 border border-[#0B7A33]/15 px-3.5 py-1.5 rounded-full">
            The Infrastructure
          </span>
          <h2 className="mt-4 font-sans text-[28px] md:text-[34px] lg:text-[40px] font-bold leading-[120%] text-gray-950 uppercase">
            Everything You Need To Scale
          </h2>
          <div className="h-1 lg:h-1.5 w-20 bg-[#0B7A33] mx-auto mt-4 rounded-full" />
          <p className="mt-5 font-sans text-[16px] leading-[170%] text-[#6B7280] font-normal">
            Ecom Network equips you with enterprise-grade business utilities, live tracking matrices, and continuous masterclasses. We supply the machinery; you capture the growth.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {FEATURES_DATA.map((feat) => (
            <div
              key={feat.id}
              className="group relative p-6 rounded-[20px] bg-white border border-gray-200/80 hover:border-[#0B7A33]/40 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between text-left"
            >
              
              {/* Backside Subtle Glow */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-emerald-50/30 to-transparent rounded-b-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                {/* Icon & Optional Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#0B7A33] flex items-center justify-center border border-emerald-100 group-hover:bg-[#0B7A33] group-hover:text-white transition-all duration-300">
                    <DynamicIcon name={feat.iconName} size={20} />
                  </div>

                  {feat.badge && (
                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase py-0.5 px-2.5 rounded-full bg-emerald-50 text-[#0B7A33] border border-emerald-100">
                      {feat.badge}
                    </span>
                  )}
                </div>

                {/* Feature Title */}
                <h3 className="mt-5 font-sans text-[20px] font-semibold leading-[130%] tracking-tight text-gray-950 group-hover:text-[#0B7A33] transition-colors">
                  {feat.title}
                </h3>

                {/* Feature Description */}
                <p className="mt-2.5 text-xs text-gray-500 leading-relaxed min-h-[58px] font-medium">
                  {feat.description}
                </p>
              </div>

              {/* Action Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold group-hover:text-[#0B7A33] transition-colors">
                <span>Enterprise Tool</span>
                <DynamicIcon name="ArrowUpRight" size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

            </div>
          ))}
        </div>

        {/* Highlight Highlight Box */}
        <div className="mt-16 p-8 rounded-[20px] bg-[#F8FAFC] border border-gray-200/80 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center text-left">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex -space-x-3 shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#0B7A33] flex items-center justify-center shadow-md border border-emerald-200"><DynamicIcon name="Cpu" size={24} /></div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#12A84A] flex items-center justify-center shadow-md border border-emerald-100"><DynamicIcon name="LineChart" size={24} /></div>
            <div className="w-14 h-14 rounded-2xl bg-white text-gray-700 flex items-center justify-center shadow-md border border-gray-200"><DynamicIcon name="Globe" size={24} /></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h4 className="font-display font-bold text-lg text-gray-950">Unlock Unlimited E-Commerce Logistics</h4>
            <p className="text-xs text-gray-600 mt-1 max-w-xl font-medium">
              You won't require developer skills to build high-converting websites. Ecom Network includes pre-integrated checkouts, domain mapping, real-time pixel attribution, and instant dropshipping out-of-the-box.
            </p>
          </div>

          <a
            href="#final-cta"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 font-bold tracking-wide uppercase text-xs text-gray-800 hover:text-gray-950 transition-colors shadow-xs"
          >
            Explore Dashboard
          </a>
        </div>

      </div>
    </section>
  );
};
