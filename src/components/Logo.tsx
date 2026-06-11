import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8", iconOnly = false }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Graphic */}
      <div className="relative flex items-center justify-center w-9 h-9">
        {/* Glow behind logo */}
        <div className="absolute inset-0 rounded-xl bg-primary-bright/20 blur-[6px] animate-pulse" />
        
        {/* Interlocking connection mesh */}
        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full text-primary-bright drop-shadow-[0_2px_8px_rgba(30,201,91,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Inner ring */}
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="opacity-40 animate-spin-slow" style={{ animationDuration: "25s" }} />
          
          {/* Main geometric shapes - Interconnected E & N */}
          {/* Node 1 - Affiliate */}
          <circle cx="50" cy="18" r="5" fill="#1EC95B" />
          {/* Node 2 - Ecom */}
          <circle cx="78" cy="65" r="5" fill="#12A84A" />
          {/* Node 3 - Team */}
          <circle cx="22" cy="65" r="5" fill="#0B7A33" />
          
          {/* Path connections */}
          <path d="M50 18 L78 65 L22 65 Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Custom central brand nucleus */}
          <circle cx="50" cy="49" r="10" fill="#ffffff" stroke="currentColor" strokeWidth="3" />
          <path d="M47 45 H53 M47 49 H53 M47 53 H53" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Text */}
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-display text-xl font-bold tracking-tight text-gray-950 flex items-center gap-1">
            Ecom<span className="text-[#0B7A33]">Network</span>
          </span>
          <span className="text-[9px] font-mono tracking-widest text-[#12A84A] uppercase -mt-1 font-bold">
            Connections To Commissions
          </span>
        </div>
      )}
    </div>
  );
};
