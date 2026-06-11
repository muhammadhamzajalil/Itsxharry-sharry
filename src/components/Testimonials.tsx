import React, { useState } from "react";
import { TESTIMONIALS_DATA } from "../data";
import { DynamicIcon } from "./DynamicIcon";

export const Testimonials: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const nextSlide = () => {
    setActiveIdx((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIdx((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const current = TESTIMONIALS_DATA[activeIdx];

  return (
    <section id="testimonials" className="relative py-24 bg-white text-gray-900 overflow-hidden border-t border-gray-100">
      
      {/* Background radial soft glows */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-50/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/2 right-0 w-80 h-80 bg-green-50/35 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-mono font-bold tracking-widest text-[#0B7A33] uppercase bg-emerald-50/60 border border-[#0B7A33]/15 px-3.5 py-1.5 rounded-full">
            Success Stories
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 uppercase">
            Proof of Duplication
          </h2>
          <div className="h-1 lg:h-1.5 w-20 bg-[#0B7A33] mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
            Real stories from digital partners who launched storefronts and constructed organizations using our templates. Read verified metric growths below.
          </p>
        </div>

        {/* Testimonial Active Display Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-gray-200 shadow-lg rounded-[20px] p-6 sm:p-10 md:p-12 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50/40 rounded-full blur-[50px] pointer-events-none" />

          {/* Column A: Left side graphics / Photos & Verified labels */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8">
            
            {/* User profile image outline */}
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[#0B7A33] to-[#1EC95B] opacity-70 animate-pulse-slow" />
              <img
                src={current.avatarUrl}
                alt={current.name}
                referrerPolicy="no-referrer"
                className="relative w-28 h-28 rounded-full border-4 border-white object-cover shadow-md"
              />
              {/* Dynamic verified badge */}
              <span className="absolute bottom-0 right-1 bg-[#0B7A33] text-white p-1.5 rounded-full shadow-md border-2 border-white flex items-center justify-center">
                <DynamicIcon name="ShieldCheck" size={14} />
              </span>
            </div>

            {/* Profile info block */}
            <div>
              <h3 className="font-display text-xl font-bold text-gray-950 tracking-tight leading-tight">{current.name}</h3>
              <p className="text-xs text-[#0B7A33] font-mono font-bold mt-1 leading-none">{current.role}</p>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold block mt-1">{current.location}</span>
            </div>

            {/* Metric Growth highlight badges */}
            <div className="w-full bg-[#F8FAFC] rounded-2xl border border-gray-200/80 p-4 text-center">
              <span className="text-[9px] font-mono tracking-widest text-[#0B7A33] uppercase font-bold block">VERIFIED GROWTH STORY</span>
              <span className="text-2xl font-mono font-extrabold text-[#0B7A33] mt-1.5 block leading-none">{current.metricValue}</span>
              <span className="text-xs text-gray-700 mt-1 block font-semibold">{current.metricLabel}</span>
            </div>

          </div>

          {/* Column B: Right side quote, play demo, controllers */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full relative select-none text-left">
            
            {/* Quote icon banner background */}
            <span className="absolute -top-6 -left-2 text-7xl font-sans text-emerald-500/10 select-none pointer-events-none">“</span>

            <div className="relative z-10 flex-1">
              {/* Star ratings */}
              <div className="flex gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <span key={i} className="text-amber-500 text-sm">★</span>
                ))}
              </div>

              {/* Story Blockquote */}
              <blockquote className="mt-5 text-gray-800 text-sm sm:text-base md:text-lg tracking-tight font-medium leading-relaxed italic">
                "{current.quote}"
              </blockquote>

              {/* Video Testimonial Preview Block */}
              <div className="group mt-8 p-3 rounded-2xl bg-gray-50 border border-gray-200 hover:border-[#0B7A33]/20 transition-all flex flex-col sm:flex-row gap-4 items-center">
                
                {/* Simulated Thumbnail circle */}
                <div className="relative w-28 sm:w-32 h-16 rounded-xl bg-gray-200 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-cover bg-center opacity-70 filter blur-[1px]" style={{ backgroundImage: `url(${current.avatarUrl})` }} />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-black/30" />
                  
                  {/* Floating click indicator */}
                  <div className="absolute z-10 w-8 h-8 rounded-full bg-[#0B7A33] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform cursor-pointer">
                    <DynamicIcon name="Play" size={10} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <span className="text-[9px] font-mono tracking-widest text-[#0B7A33] uppercase font-bold flex items-center justify-center sm:justify-start gap-1">
                    <DynamicIcon name="CheckCircle2" size={8} /> SECURE VERIFIED INTERVIEW
                  </span>
                  <h4 className="font-display font-bold text-xs text-gray-900 mt-1">Watch video explaining store optimization strategy</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Video transcript synced & certified with SSL validation logs.</p>
                </div>

              </div>

            </div>

            {/* Slider control vectors at footer */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
              
              <div className="flex gap-1.5">
                {TESTIMONIALS_DATA.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`h-1.5 transition-all outline-none cursor-pointer ${
                      idx === activeIdx ? "w-6 bg-[#0B7A33] rounded-full" : "w-1.5 bg-gray-300 hover:bg-gray-400 rounded-full"
                    }`}
                    aria-label={`Go to success story ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-2 text-gray-400">
                <button
                  onClick={prevSlide}
                  className="p-2 sm:p-2.5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer shadow-xs"
                  aria-label="Previous Success Story"
                >
                  <DynamicIcon name="ChevronRight" size={14} className="rotate-180" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 sm:p-2.5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer shadow-xs"
                  aria-label="Next Success Story"
                >
                  <DynamicIcon name="ChevronRight" size={14} />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
