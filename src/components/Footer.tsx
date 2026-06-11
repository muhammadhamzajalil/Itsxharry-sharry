import React, { useState } from "react";
import { Logo } from "./Logo";
import { DynamicIcon } from "./DynamicIcon";

interface FooterProps {
  navigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const [newsEmail, setNewsEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail) return;
    setSubscribed(true);
    setNewsEmail("");
  };

  const navLinks = [
    { label: "Home Lobby", page: "home" },
    { label: "About Syndicate", page: "about" },
    { label: "Referral Opportunity", page: "opportunity" },
    { label: "Compensation Plan", page: "compensation" },
    { label: "Pricing Levels", page: "pricing" },
    { label: "Support coordinates", page: "contact" },
  ];

  const resourceLinks = [
    { label: "Training Academy Guide", page: "about" },
    { label: "Dropship Fulfillment Desk", page: "opportunity" },
    { label: "AI Copywriter Suite", page: "pricing" },
    { label: "Partner FAQ Directory", page: "home" },
    { label: "Security Login Token", page: "login" },
    { label: "Claim Workspace Store", page: "register" }
  ];

  return (
    <footer className="relative bg-gray-50 text-gray-900 border-t border-gray-200/80 pt-16 pb-8 overflow-hidden select-none">
      
      {/* Decorative subtle glows */}
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-100/20 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Core Footer Grids */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-200/60">
          
          {/* Brand & About Statement (Col 1-4) */}
          <div className="md:col-span-4 flex flex-col gap-5 text-left">
            <Logo iconOnly={false} />
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mt-2 font-medium">
              The premier hybrid business ecosystem combining direct affiliate marketing checkouts, pre-configured global dropship storefronts, and automated team leverages.
            </p>
            {/* Direct Contact Metrics */}
            <div className="flex flex-col gap-2.5 pt-2 text-xs">
              <a
                href="https://wa.me/923241651892?text=Hello%20Ecom%20Network!%20I%20have%20an%20onboarding%20question..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-600 hover:text-[#0B7A33] transition-colors font-medium"
                title="Immediate WhatsApp Line"
              >
                <DynamicIcon name="PhoneCall" size={13} className="text-[#0B7A33]" />
                <span>WhatsApp: <strong className="text-gray-950">0324 16 51 892</strong></span>
              </a>

              <a
                href="http://www.ecomnetwork.pk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-600 hover:text-[#0B7A33] transition-colors font-medium"
              >
                <DynamicIcon name="Globe" size={13} className="text-[#0B7A33]" />
                <span>Web: <strong className="text-gray-950">www.ecomnetwork.pk</strong></span>
              </a>

              <div className="flex items-center gap-2.5 text-gray-600 font-medium">
                <DynamicIcon name="MapPin" size={13} className="text-[#0B7A33]" />
                <span>HQ: <strong className="text-gray-950">Lahore / Islamabad, Pakistan</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Links Column (Col 5-6) */}
          <div className="md:col-span-2 flex flex-col gap-4 text-left">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-gray-400">Jump Coordinates</h4>
            <div className="flex flex-col gap-2.5 text-xs">
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate ? navigate(link.page) : undefined}
                  className="text-left bg-transparent border-none outline-none text-gray-600 hover:text-[#0B7A33] transition-colors font-bold font-mono uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Column (Col 7-9) */}
          <div className="md:col-span-3 flex flex-col gap-4 text-left">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-gray-400">System Resources</h4>
            <div className="flex flex-col gap-2.5 text-xs">
              {resourceLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate ? navigate(link.page) : undefined}
                  className="text-left bg-transparent border-none outline-none text-gray-600 hover:text-[#0B7A33] transition-colors font-bold font-mono uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter Form Column (Col 10-12) */}
          <div className="md:col-span-3 flex flex-col gap-4 text-left">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-gray-400">Security Broadcasts</h4>
            <p className="text-gray-500 text-xs leading-normal font-medium">
              Subscribe to obtain weekly retail trend lists, physical stock updates, and live campaign scripts.
            </p>

            {/* Newsletter form */}
            {!subscribed ? (
              <form onSubmit={handleNewsSubmit} className="mt-2 flex gap-1 bg-white rounded-xl p-1 border border-gray-200 focus-within:border-[#0B7A33]/50 overflow-hidden shadow-xs">
                <input
                  type="email"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  required
                  placeholder="name@email.com"
                  className="bg-transparent pl-3 pr-1 text-xs outline-none flex-1 max-w-[150px] sm:max-w-none text-gray-800 placeholder-gray-400 font-medium"
                />
                <button
                  type="submit"
                  className="py-2 px-3.5 rounded-lg bg-[#0B7A33] hover:bg-[#12A84A] text-white font-bold font-mono text-[10px] tracking-widest uppercase transition-colors shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
            ) : (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-[#0B7A33] flex items-center gap-1.5 font-mono font-bold">
                <DynamicIcon name="CheckCircle2" size={13} />
                <span>Subscription Secured!</span>
              </div>
            )}

            {/* Social icons */}
            <div className="flex gap-4 items-center text-gray-400 pt-4 mt-2 border-t border-gray-200/80">
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 font-extrabold">Secure Nodes:</span>
              <div className="flex gap-3">
                <a href="https://wa.me/923241651892" target="_blank" rel="noopener" className="p-1.5 rounded bg-gray-200/60 text-gray-600 hover:bg-[#12A84A] hover:text-white transition-all duration-150">
                  <DynamicIcon name="PhoneCall" size={12} />
                </a>
                <a href="http://www.ecomnetwork.pk" target="_blank" rel="noopener" className="p-1.5 rounded bg-gray-200/60 text-gray-600 hover:bg-[#0B7A33] hover:text-white transition-all duration-150">
                  <DynamicIcon name="Globe" size={12} />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Trade Mark Licensing Footer */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-gray-400 font-bold tracking-wider">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-6 items-center text-center sm:text-left select-none font-medium">
            <span>© 2026 Ecom Network International, Inc. All rights reserved.</span>
            <div className="hidden sm:block w-[1px] h-3 bg-gray-200" />
            <a href="#" className="hover:text-gray-950 font-bold">License clearance certificates</a>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-4 text-xs">
            <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#0B7A33] border border-emerald-100 py-0.5 px-2 rounded-full bg-emerald-50">
              verified system
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
