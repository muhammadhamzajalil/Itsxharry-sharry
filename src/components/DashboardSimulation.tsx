import React, { useState, useMemo } from "react";
import { DynamicIcon } from "./DynamicIcon";

export const DashboardSimulation: React.FC = () => {
  // Simulator tuning inputs
  const [partners, setPartners] = useState<number>(8); // Range: 1 - 50
  const [sales, setSales] = useState<number>(100000); // Range: 10,000 - 500,000 PKR
  const [depth, setDepth] = useState<number>(3); // Range: 1 - 6

  // Live calculations memoized based on sliders
  const calculations = useMemo(() => {
    // 40% commission on direct retail sales
    const directSalesCommission = sales * 0.40;
    
    // Each team partner generates residual override volume. Let's model 5,000 PKR base override matching per active depth level
    const residualOverride = partners * 5000 * (depth * 0.82);
    
    // Sum to total monthly income
    const totalEarnings = directSalesCommission + residualOverride;
    
    // Traffic index based on partners and storefront traffic
    const activeTraffic = Math.floor(partners * 450 + (sales / 350));
    
    // Performance advance progress mapping (capped at gold target of 200,000 PKR)
    const goldMilestone = 200000;
    const progressPercent = Math.min((totalEarnings / goldMilestone) * 100, 100);

    // Dynamic 12-month curve projection nodes
    const monthStops = [
      totalEarnings * 0.25,
      totalEarnings * 0.35,
      totalEarnings * 0.40,
      totalEarnings * 0.58,
      totalEarnings * 0.54, // Dip
      totalEarnings * 0.72,
      totalEarnings * 0.80,
      totalEarnings * 0.75,
      totalEarnings * 0.92,
      totalEarnings * 1.05,
      totalEarnings * 1.15,
      totalEarnings
    ];

    // Map month outputs to SVG coordinate space (Width=600, Height=150)
    const maxY = Math.max(...monthStops, 2000);
    const svgPoints = monthStops.map((val, idx) => {
      const x = (idx / (monthStops.length - 1)) * 560 + 20;
      const y = 140 - (val / maxY) * 110;
      return { x, y };
    });

    const pathData = svgPoints.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, "");

    // Path string enclosing bottom area for smooth semi-transparent filling
    const areaPathData = `${pathData} L ${svgPoints[svgPoints.length - 1].x} 145 L ${svgPoints[0].x} 145 Z`;

    return {
      directSalesCommission,
      residualOverride,
      totalEarnings,
      activeTraffic,
      progressPercent,
      svgPoints,
      pathData,
      areaPathData
    };
  }, [partners, sales, depth]);

  // Static ledger attributions
  const ledgerTicks = [
    { time: "Just now", user: "Zainab M. (Isb, PK)", event: "Direct retail checkout", value: "+Rs. 4,800", type: "direct" },
    { time: "2 min ago", user: "Kamran S. (Lhr, PK)", event: "Depth Level 3 replication advanced", value: "+Rs. 12,000", type: "residual" },
    { time: "7 min ago", user: "Ayesha K. (Khi, PK)", event: "Smart Store dropship finalized", value: "+Rs. 8,400", type: "direct" },
    { time: "12 min ago", user: "Marcus D. (Paris, FR)", event: "Direct Sponsor override cleared", value: "+Rs. 24,000", type: "residual" },
    { time: "25 min ago", user: "Siddique A. (Fsd, PK)", event: "AI Copywriter funnels registered", value: "Verified Active", type: "info" }
  ];

  return (
    <section id="dashboard" className="relative py-24 bg-white text-gray-900 overflow-hidden border-t border-gray-100">
      
      {/* Decorative Warm Radial Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-[#0B7A33] uppercase bg-emerald-50/60 border border-[#0B7A33]/15 px-3.5 py-1.5 rounded-full">
            Commission Lab
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 uppercase">
            Income Simulator Console
          </h2>
          <div className="h-1 lg:h-1.5 w-20 bg-[#0B7A33] mx-auto mt-4 rounded-full" />
          <p className="mt-5 text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
            Witness the direct relationship between network connectivity and financial leverage. Adjust the parameters below to compute potential direct commissions and residual loyalty royalties.
          </p>
        </div>

        {/* Master Console Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* CONTROL PANEL / SLIDERS: Column 1-5 */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-[20px] bg-white border border-gray-200/80 flex flex-col justify-between shadow-md text-left">
            
            <div>
              <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0B7A33] flex items-center justify-center border border-emerald-100">
                  <DynamicIcon name="Cpu" size={16} />
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-950">Simulator Inputs</h3>
                  <p className="text-[10px] text-gray-400 font-bold">Configure your global business parameters</p>
                </div>
              </div>

              {/* SLIDER 1: Active Team Nodes */}
              <div className="mt-8 flex flex-col">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-semibold text-gray-700">Active Partners (Network Members)</label>
                  <span className="font-mono text-xs font-bold text-[#0B7A33] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {partners} nodes
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={partners}
                  onChange={(e) => setPartners(Number(e.target.value))}
                  className="mt-3.5 h-1.5 w-full bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0B7A33]"
                />
                <p className="mt-1.5 text-[10px] text-gray-500 font-medium">Each active team member creates secondary network leverage.</p>
              </div>

              {/* SLIDER 2: Ecomm Store Retail Sales Volume */}
              <div className="mt-8 flex flex-col">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-semibold text-gray-700">E-commerce Sales Volume / mo</label>
                  <span className="font-mono text-xs font-bold text-[#0B7A33] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Rs. {sales.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={sales}
                  onChange={(e) => setSales(Number(e.target.value))}
                  className="mt-3.5 h-1.5 w-full bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0B7A33]"
                />
                <p className="mt-1.5 text-[10px] text-gray-500 font-medium">Your pre-built smart store sales volume. Earns 40% direct margin.</p>
              </div>

              {/* SLIDER 3: Network Multiplier Depth */}
              <div className="mt-8 flex flex-col font-sans">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-semibold text-gray-700">Replication Depth (Generations)</label>
                  <span className="font-mono text-xs font-bold text-[#0B7A33] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Lvl {depth} override
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="mt-3.5 h-1.5 w-full bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0B7A33]"
                />
                <p className="mt-1.5 text-[10px] text-gray-500 font-medium">How deep your duplication goes. Unlocks leadership override cashflows.</p>
              </div>
            </div>

            {/* Performance Target Meter */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">
                <span>Rank Qualification Target</span>
                <span className="text-[#0B7A33] font-bold">GOLD STANDARD ({Math.round(calculations.progressPercent)}%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 mt-3.5 rounded-full overflow-hidden border border-gray-200/50">
                <div 
                  className="bg-gradient-to-r from-[#0B7A33] via-[#12A84A] to-emerald-400 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${calculations.progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] text-gray-500 font-medium">
                ⭐ Gold qualification unlocks an extra <span className="font-bold text-gray-900">5% generation match override</span>.
              </p>
            </div>

          </div>

          {/* SIMULATOR DASHBOARD BOARD: Column 6-12 */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 4 REVENUE OUTPUT CARDS */}
            <div className="grid grid-cols-2 gap-4 text-left">
              
              {/* Output 1: Monthly Earnings */}
              <div className="p-4 rounded-[20px] bg-white border border-gray-200/80 hover:border-[#0B7A33]/20 shadow-xs transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-y-0 right-0 w-1 bg-[#0B7A33] pointer-events-none" />
                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase block font-bold">MONTHLY EARNINGS</span>
                <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B7A33] block mt-1 leading-none">
                  Rs. {calculations.totalEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[9px] text-[#0B7A33] font-mono mt-1 w-fit block bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold">Estimated Residual</span>
              </div>

              {/* Output 2: Direct Commission */}
              <div className="p-4 rounded-[20px] bg-white border border-gray-200/80 hover:border-[#0B7A33]/20 shadow-xs transition-all duration-300">
                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase block font-bold">DIRECT COMMISSIONS</span>
                <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 block mt-1 leading-none">
                  Rs. {calculations.directSalesCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[9px] text-gray-400 font-mono mt-1 block">40% E-com Gross margin</span>
              </div>

              {/* Output 3: Residual Override */}
              <div className="p-4 rounded-[20px] bg-white border border-gray-200/80 hover:border-[#0B7A33]/20 shadow-xs transition-all duration-300">
                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase block font-bold">RESIDUAL ROYALTY</span>
                <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 block mt-1 leading-none">
                  Rs. {calculations.residualOverride.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[9px] text-[#0B7A33] font-mono mt-1 block font-bold">Leverage matching override</span>
              </div>

              {/* Output 4: Traffic reach */}
              <div className="p-4 rounded-[20px] bg-white border border-gray-200/80 hover:border-[#0B7A33]/20 shadow-xs transition-all duration-300">
                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase block font-bold">TRAFFIC REACH (CLICKS)</span>
                <span className="font-mono text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 block mt-1 leading-none">
                  {calculations.activeTraffic.toLocaleString()}
                </span>
                <span className="text-[9px] text-gray-400 font-mono mt-1 block">Attributed social loops</span>
              </div>

            </div>

            {/* PROJECTED AREA CHART */}
            <div className="p-6 rounded-[20px] bg-[#F8FAFC] border border-gray-200 flex flex-col justify-between shadow-xs">
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-200/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B7A33] animate-ping" />
                  <h4 className="font-display font-bold text-xs tracking-wide uppercase text-gray-800">12-Month Passive Revenue Curve</h4>
                </div>
                <div className="flex gap-2 font-mono text-[9px] text-gray-500 font-bold">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#0B7A33]" /> Projected Scale</span>
                </div>
              </div>

              {/* Dynamic SVG Visual Container */}
              <div className="relative mt-4 h-[150px] w-full">
                
                <svg className="w-[100%] h-full overflow-visible" viewBox="0 0 600 150" fill="none" preserveAspectRatio="none">
                  
                  {/* Subtle Grid Lines inside Area */}
                  <g stroke="rgba(11,122,51,0.04)" strokeWidth="0.8">
                    <line x1="20" y1="20" x2="580" y2="20" />
                    <line x1="20" y1="55" x2="580" y2="55" />
                    <line x1="20" y1="90" x2="580" y2="90" />
                    <line x1="20" y1="125" x2="580" y2="125" />
                  </g>

                  {/* Filled Area */}
                  <path d={calculations.areaPathData} fill="url(#payout-grad)" className="transition-all duration-300" />
                  
                  {/* Top Line */}
                  <path d={calculations.pathData} stroke="#0B7A33" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-300" />
                  
                  {/* Circular Highlights */}
                  <circle cx={calculations.svgPoints[5].x} cy={calculations.svgPoints[5].y} r="4" fill="white" stroke="#0B7A33" strokeWidth="2.5" className="transition-all duration-300" />
                  <circle cx={calculations.svgPoints[11].x} cy={calculations.svgPoints[11].y} r="5.5" fill="white" stroke="#0B7A33" strokeWidth="3" className="transition-all duration-300" />

                  <defs>
                    <linearGradient id="payout-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0B7A33" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#0B7A33" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                </svg>

                {/* Floating coordinate tooltip card above peak node */}
                <div 
                  className="absolute p-2.5 rounded-lg bg-white border border-gray-200 text-gray-800 font-mono text-[9px] tracking-wide shadow-md transition-all duration-300 text-left"
                  style={{
                    left: `${(11 / 11) * 91 + 1}%`,
                    top: `10%`,
                    transform: "translateX(-130%)"
                  }}
                >
                  <div className="flex items-center gap-1.5 text-gray-500 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B7A33]" />
                    <span>Month 12 Forecast:</span>
                  </div>
                  <span className="text-[#0B7A33] font-bold block mt-0.5">
                    Rs. {(calculations.totalEarnings * 1.0).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo achieved
                  </span>
                </div>

              </div>

              {/* Month Marks Footer */}
              <div className="flex justify-between font-mono text-[8px] text-gray-400 font-bold uppercase tracking-widest pt-2 border-t border-gray-200/60">
                <span>Month 1</span>
                <span>Month 4</span>
                <span>Month 8</span>
                <span>Month 12 (Mature Node)</span>
              </div>

            </div>

            {/* NETWORK LIVE LEDGER TICKER */}
            <div className="p-4 rounded-[20px] bg-white border border-gray-200 shadow-xs flex flex-col gap-2.5 text-left">
              <h5 className="text-[10px] font-mono tracking-widest text-[#0B7A33] uppercase font-extrabold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B7A33] animate-ping" />
                Live Network Ledger Attributions
              </h5>
              
              <div className="flex flex-col gap-2 max-h-[148px] overflow-hidden">
                {ledgerTicks.slice(0, 3).map((tick, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-left">
                      <span className={`w-2 h-2 rounded-full ${tick.type === 'direct' ? 'bg-[#0B7A33]' : 'bg-indigo-500'}`} />
                      <div>
                        <div className="flex gap-2 items-center">
                          <span className="font-bold text-gray-800">{tick.user}</span>
                          <span className="text-[9px] font-mono text-gray-400">{tick.time}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium font-sans">{tick.event}</span>
                      </div>
                    </div>
                    <span className={`font-mono text-xs font-bold ${tick.type === 'direct' ? 'text-[#0B7A33]' : 'text-indigo-600'}`}>
                      {tick.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
