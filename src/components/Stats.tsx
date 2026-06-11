import React, { useState, useEffect, useRef } from "react";
import { STATS_DATA } from "../data";

export const Stats: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({
    members: 0,
    countries: 0,
    commissions: 0,
    satisfaction: 0
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const animationStarted = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || animationStarted.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom >= 0;

      if (inView) {
        animationStarted.current = true;
        triggerCounterAnimations();
      }
    };

    const triggerCounterAnimations = () => {
      const duration = 2000; // 2 seconds
      const steps = 40;
      const stepTime = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        
        setCounts({
          members: Math.floor((50000 / steps) * currentStep),
          countries: Math.floor((100 / steps) * currentStep),
          commissions: parseFloat(((10 / steps) * currentStep).toFixed(1)),
          satisfaction: Math.floor((95 / steps) * currentStep)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          // Set final exact values
          setCounts({
            members: 50000,
            countries: 100,
            commissions: 10,
            satisfaction: 95
          });
        }
      }, stepTime);
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once in case it starts inside viewport
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatNumber = (id: string, num: number) => {
    if (id === "members") {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <section ref={sectionRef} className="relative py-16 bg-white border-y border-gray-100 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-32 bg-emerald-50/40 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center text-center">
          
          {STATS_DATA.map((item, idx) => {
            const currentVal = counts[item.id];
            
            return (
              <div 
                key={item.id} 
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-gray-100 shadow-md transition-all duration-300 hover:border-[#0B7A33]/20 hover:shadow-lg"
              >
                
                {/* Numeric Metric Value */}
                <div className="flex items-baseline justify-center font-mono text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B7A33] tracking-tight">
                  {item.prefix && <span className="text-[#12A84A] text-2xl sm:text-3xl lg:text-4xl mr-1">{item.prefix}</span>}
                  <span>{formatNumber(item.id, currentVal)}</span>
                  {item.suffix && <span className="text-[#12A84A] text-2xl sm:text-3xl lg:text-4xl ml-1">{item.suffix}</span>}
                </div>

                {/* Metric Title Label */}
                <h3 className="mt-2.5 text-sm sm:text-base font-display font-bold text-gray-950 tracking-tight leading-tight">
                  {item.label}
                </h3>
                
                {/* Short descriptive subtext */}
                <p className="mt-1 text-xs text-gray-500 max-w-[170px] leading-relaxed select-none">
                  {item.desc}
                </p>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};
