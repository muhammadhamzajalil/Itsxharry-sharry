import React, { useState } from "react";
import { HOW_IT_WORKS_STEPS } from "../data";
import { DynamicIcon } from "./DynamicIcon";

export const HowItWorks: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="relative py-24 bg-white text-gray-900 overflow-hidden">
      
      {/* Decorative Warm Radial Orbs */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-emerald-50/45 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-green-50/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-mono font-bold tracking-widest text-[#0B7A33] uppercase bg-emerald-50/60 border border-[#0B7A33]/15 px-3.5 py-1.5 rounded-full">
            The Blueprint
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 uppercase">
            How Ecom Network Works
          </h2>
          <div className="h-1 lg:h-1.5 w-20 bg-[#0B7A33] mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
            We have stripped away all the complexities of traditional online businesses. Our three-step automated pipeline launches your digital storefront and scales passive residuals.
          </p>
        </div>

        {/* Floating Steps Connector (Desktop only) */}
        <div className="relative mt-8">
          
          <div className="hidden lg:block absolute top-[43%] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-100 z-0">
            <div className="absolute inset-x-0 h-full bg-[linear-gradient(90deg,transparent,rgba(11,122,51,0.2),transparent)] animate-pulse-slow" style={{ backgroundSize: "200% 100%" }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step) => {
              const isHovered = hoveredCard === step.id;
              
              return (
                <div
                  key={step.id}
                  className="flex flex-col flex-1"
                  onMouseEnter={() => setHoveredCard(step.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className={`relative flex-1 p-6 sm:p-8 rounded-[20px] bg-white border transition-all duration-300 transform ${
                      isHovered
                        ? "border-[#0B7A33]/40 -translate-y-2.5 shadow-xl shadow-[#0B7A33]/5"
                        : "border-gray-200/80 shadow-xs"
                    }`}
                  >
                    
                    {/* Top Right Floating Step Counter Badge */}
                    <div className="absolute top-6 right-8 font-mono text-5xl font-extrabold text-gray-100/80 select-none transition-all group-hover:text-gray-200">
                      0{step.id}
                    </div>

                    {/* Step Icon Bubble */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isHovered 
                        ? "bg-[#0B7A33] text-white shadow-md shadow-[#0B7A33]/20" 
                        : "bg-emerald-50 text-[#0B7A33]"
                    }`}>
                      <DynamicIcon name={step.iconName} size={22} />
                    </div>

                    {/* Step Header */}
                    <h3 className="mt-6 font-display text-xl sm:text-2xl font-bold tracking-tight text-gray-950 leading-tight">
                      {step.title}
                    </h3>

                    {/* Step Primary Description */}
                    <p className="mt-3.5 text-xs sm:text-sm text-gray-600 leading-relaxed min-h-[56px] font-medium">
                      {step.description}
                    </p>

                    {/* Checklist details with smooth reveal toggle */}
                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-2.5">
                      {step.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                            isHovered ? "bg-emerald-50 text-[#0B7A33]" : "bg-gray-100 text-gray-500"
                          }`}>
                            <DynamicIcon name="Check" size={10} />
                          </span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Fast Action Tip */}
        <div className="mt-14 p-5 rounded-[20px] bg-emerald-50/50 border border-emerald-100 max-w-2xl mx-auto flex sm:items-center gap-4 text-center sm:text-left shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-100/60 flex items-center justify-center text-[#0B7A33] shrink-0 mx-auto sm:mx-0">
            <DynamicIcon name="Zap" size={18} className="animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-xs font-mono font-bold text-[#0B7A33] uppercase tracking-wider block">PRO TIP FOR AMBITIOUS PARTNERS</span>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed font-medium">
              Skip traditional business overhead. We handle licensing, payment checkouts, and customer packaging. Focus strictly on building connections and collecting commissions!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
