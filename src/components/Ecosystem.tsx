import React, { useState } from "react";
import { ECOSYSTEM_NODES } from "../data";
import { DynamicIcon } from "./DynamicIcon";

export const Ecosystem: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState(ECOSYSTEM_NODES[6]); // Defaults to Personal Branding (central hub)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  return (
    <section id="ecosystem" className="relative py-24 bg-white text-gray-900 overflow-hidden border-t border-gray-100">
      
      {/* Decorative Radial Warm Glows */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-50/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-50/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs font-mono font-bold tracking-widest text-[#0B7A33] uppercase bg-emerald-50/60 border border-[#0B7A33]/15 px-3.5 py-1.5 rounded-full">
            The Ecosystem
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 uppercase">
            A Multi-Dimensional Model
          </h2>
          <div className="h-1 lg:h-1.5 w-20 bg-[#0B7A33] mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
            Ecom Network is not a simple single-commission funnel. We combine 6 different high-margin digital business pipelines into a combined residual matrix. Hover or click over nodes to analyze each cash flow.
          </p>
        </div>

        {/* Master Ecosystem Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Interactive Graphic Diagram Node Map: Column 1-7 */}
          <div className="lg:col-span-7 flex justify-center items-center h-[360px] sm:h-[460px] relative bg-gray-50/50 rounded-[20px] border border-gray-100 p-4 overflow-hidden shadow-inner">
            
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(11,122,51,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(11,122,51,0.015)_1px,transparent_1px)] bg-[size:15px_15px] opacity-100" />

            {/* Glowing Vectors Mapping Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0B7A33" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#12A84A" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#1EC95B" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Lines from center to all other 6 nodes */}
              {ECOSYSTEM_NODES.slice(0, 6).map((node) => {
                const isFocused = selectedNode.id === node.id || hoveredNodeId === node.id;
                return (
                  <line
                    key={`line-${node.id}`}
                    x1="50"
                    y1="50"
                    x2={node.x}
                    y2={node.y}
                    stroke={isFocused ? "url(#glow-grad)" : "rgba(11, 122, 51, 0.08)"}
                    strokeWidth={isFocused ? "1.5" : "0.75"}
                    strokeDasharray={isFocused ? "none" : "3 3"}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>

            {/* Mobile Layout Fallback Header */}
            <div className="absolute top-3 left-4 text-[9px] font-mono text-gray-400 uppercase tracking-widest sm:hidden font-bold">
              CONSTELLATION MAP
            </div>

            {/* Interactive Grid of Nodes */}
            <div className="relative w-full h-full max-w-[420px] max-h-[420px]">
              
              {ECOSYSTEM_NODES.map((node) => {
                const isSelected = selectedNode.id === node.id;
                
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                    className={`absolute z-10 p-3 sm:p-4 rounded-full transition-all duration-300 group cursor-pointer flex flex-col items-center gap-1 min-w-[75px] sm:min-w-[90px] ${
                      isSelected
                        ? "bg-[#0B7A33] border-[3px] border-emerald-300 text-white shadow-lg shadow-[#0B7A33]/25 scale-110"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-[#12A84A]/40 hover:text-[#0B7A33] hover:scale-105 shadow-sm"
                    }`}
                  >
                    <DynamicIcon name={node.iconName} size={isSelected ? 20 : 16} />
                    
                    {/* Node floating text labels */}
                    <span className="text-[8px] sm:text-[9.5px] font-bold text-center leading-none mt-1 select-none w-max block">
                      {node.title.split(" ")[0]}
                    </span>

                    {/* Outer glow ring */}
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-25" />
                    )}
                  </button>
                );
              })}

            </div>

          </div>

          {/* Interactive Detail Box: Column 8-12 */}
          <div className="lg:col-span-5 flex flex-col">
            
            {/* Node description card */}
            <div className="p-6 sm:p-8 rounded-[20px] bg-white border border-gray-200/80 hover:border-[#0B7A33]/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden text-left">
              
              {/* Backside soft glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-[40px] pointer-events-none" />

              {/* Card Label Header */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B7A33] flex items-center justify-center border border-emerald-100">
                  <DynamicIcon name={selectedNode.iconName} size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-gray-950 leading-tight">
                    {selectedNode.title}
                  </h3>
                  <span className="text-[10px] font-mono text-[#0B7A33] tracking-widest uppercase font-bold">
                    Ecom Network Matrix Pipeline
                  </span>
                </div>
              </div>

              {/* Main Node Description */}
              <p className="mt-5 text-gray-600 text-xs sm:text-sm leading-relaxed min-h-[72px] font-medium">
                {selectedNode.description}
              </p>

              {/* Itemized Bullet Metrics */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3.5">
                <h4 className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">
                  Core Revenue Highlights
                </h4>
                
                {selectedNode.detailsList.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                    <span className="text-[#0B7A33] shrink-0 mt-0.5">
                      <DynamicIcon name="CheckCircle2" size={14} />
                    </span>
                    <span className="font-medium">{detail}</span>
                  </div>
                ))}
              </div>

              {/* Primary Call to Action link trigger inside details */}
              <div className="mt-8 flex gap-3">
                <a
                  href="#final-cta"
                  className="w-full text-center py-3.5 px-4 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white font-bold font-mono text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all block"
                >
                  Leverage {selectedNode.title}
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
