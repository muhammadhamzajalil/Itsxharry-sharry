import React, { useState } from "react";
import { FAQ_DATA } from "../data";
import { DynamicIcon } from "./DynamicIcon";

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("faq1"); // Default opens first FAQ

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="relative py-24 bg-white text-gray-900 overflow-hidden border-t border-gray-100">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-50/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-green-50/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-[#0B7A33] uppercase bg-emerald-50/60 border border-[#0B7A33]/15 px-3.5 py-1.5 rounded-full">
            Knowledge Hub
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950 uppercase">
            Frequently Asked Queries
          </h2>
          <div className="h-1 lg:h-1.5 w-20 bg-[#0B7A33] mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-gray-600 text-sm leading-relaxed font-medium">
            Have questions about commission clearances, digital shop allocations, or organization builders? Read our direct breakdowns.
          </p>
        </div>

        {/* Categorized Accordion System */}
        <div className="flex flex-col gap-4 text-left">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`transition-all duration-300 rounded-[16px] border ${
                  isOpen
                    ? "border-[#0B7A33]/30 bg-emerald-50/20 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 shadow-xs"
                }`}
              >
                {/* Accordion Lever Trigger */}
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    {/* Category Label */}
                    <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest uppercase font-bold py-1 px-2.5 rounded bg-emerald-50 text-[#0B7A33] border border-emerald-100">
                      {item.category}
                    </span>
                    <h3 className={`font-display font-bold text-sm sm:text-base tracking-tight transition-colors ${
                      isOpen ? "text-[#0B7A33]" : "text-gray-900"
                    }`}>
                      {item.question}
                    </h3>
                  </div>

                  {/* Toggle icon block */}
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen ? "rotate-180 text-[#0B7A33] bg-emerald-100" : "bg-gray-100 text-gray-400"
                  }`}>
                    <DynamicIcon name="ChevronDown" size={14} />
                  </span>
                </button>

                {/* Collapsible Panel details */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[220px] opacity-100 border-t border-gray-100 bg-white/40" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="p-5 sm:p-6 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                    {item.answer}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Support Hotline Tagline */}
        <div className="mt-14 p-6 rounded-[20px] bg-gray-50 border border-gray-200 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
          <div>
            <h4 className="font-display font-bold text-sm text-gray-950">Still have unresolved concerns?</h4>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">Reach out direct. Our operator team has a 2-minute response rate.</p>
          </div>
          <a
            href="https://wa.me/923241651892?text=Hello%20Ecom%20Network!%20I%20have%20an%20FAQ%20question%20and%20want%2520to%2520learn%2520how%2520to%2520turn%2520my%2520connections%2520into%2520commissions."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-[#0B7A33]/30 text-[#0B7A33] hover:bg-[#0B7A33]/5 text-xs font-bold tracking-wider uppercase cursor-pointer transition-colors"
          >
            <DynamicIcon name="Headphones" size={12} className="animate-pulse text-[#0B7A33]" />
            Contact Operator Support
          </a>
        </div>

      </div>
    </section>
  );
};
