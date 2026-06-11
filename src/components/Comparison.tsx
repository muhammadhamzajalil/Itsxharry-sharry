import React from "react";
import { COMPARISON_ROWS } from "../data";
import { DynamicIcon } from "./DynamicIcon";

export const Comparison: React.FC = () => {
  return (
    <section id="compare" className="relative py-24 bg-white text-gray-900 overflow-hidden border-t border-gray-100">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-50/40 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-mono font-bold tracking-widest text-[#0B7A33] uppercase bg-emerald-50/60 border border-[#0B7A33]/15 px-3.5 py-1.5 rounded-full">
            The Advantage
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 uppercase">
            A Clean Comparison
          </h2>
          <div className="h-1 lg:h-1.5 w-20 bg-[#0B7A33] mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
            Why are thousands of ambitious individuals leaving corporate ladders and traditional networking companies to join our global network? Evaluate the difference.
          </p>
        </div>

        {/* Desktop Responsive Table Layout */}
        <div className="overflow-x-auto rounded-[20px] border border-gray-200 shadow-lg bg-white">
          <table className="w-full text-left border-collapse min-w-[800px]">
            
            {/* Table Header Header */}
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/75">
                <th className="p-6 text-xs font-mono font-bold uppercase tracking-wider text-gray-500 w-[24%]">
                  Operational Metric
                </th>
                <th className="p-6 text-xs font-mono font-bold uppercase tracking-wider text-gray-500 w-[24%]">
                  Traditional Jobs
                </th>
                <th className="p-6 text-xs font-mono font-bold uppercase tracking-wider text-gray-500 w-[24%]">
                  Traditional MLM
                </th>
                {/* Visual Highlight column */}
                <th className="p-6 text-xs font-mono font-extrabold tracking-wider text-[#0B7A33] w-[28%] bg-emerald-50/60 relative">
                  <div className="absolute inset-x-0 top-0 h-1 bg-[#0B7A33]" />
                  <div className="flex items-center gap-1.5">
                    <span>🌟</span>
                    <span>ECOM NETWORK ADVANTAGE</span>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Core Rows */}
            <tbody className="divide-y divide-gray-100">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                  
                  {/* Benefit Label Col */}
                  <td className="p-6 text-sm font-bold text-gray-950 font-display">
                    {row.benefit}
                  </td>

                  {/* Traditional Job Col */}
                  <td className="p-6 text-xs text-gray-600 font-medium leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 shrink-0 mt-0.5"><DynamicIcon name="X" size={12} /></span>
                      <span>{row.traditionalJob}</span>
                    </div>
                  </td>

                  {/* Traditional MLM Col */}
                  <td className="p-6 text-xs text-gray-600 font-medium leading-relaxed">
                    <div className="flex items-start gap-2">
                       <span className="text-amber-600 shrink-0 mt-0.5"><DynamicIcon name="X" size={12} /></span>
                      <span>{row.traditionalMLM}</span>
                    </div>
                  </td>

                  {/* Ecom Network Highlighted Col */}
                  <td className="p-6 text-xs font-semibold text-gray-900 bg-emerald-50/20 relative">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#0B7A33] p-0.5 rounded bg-emerald-100 shrink-0 shadow-xs">
                        <DynamicIcon name="Check" size={11} className="stroke-[3]" />
                      </span>
                      <span className="leading-relaxed font-sans font-bold text-[#0B7A33]">{row.ecomNetwork}</span>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Mobile Callout Summary */}
        <div className="mt-8 text-center text-xs text-gray-500 font-medium">
          * Data verified against major global employment statistics and classic legacy network agency commissions.
        </div>

      </div>
    </section>
  );
};
