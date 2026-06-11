import React from "react";
import { DynamicIcon } from "./DynamicIcon";

export const CompanyIntroduction: React.FC = () => {
  return (
    <section className="relative py-24 bg-white text-gray-900 border-t border-gray-100 overflow-hidden">
      {/* Dynamic Background Circles */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-50/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#12A84A]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module 1: Company Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 text-left space-y-6">
            <span className="text-xs font-mono font-black uppercase tracking-widest text-[#0B7A33] px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full select-none">
              Who We Are
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 uppercase tracking-tight leading-none">
              Pakistan's Premier <br/>
              <span className="text-[#0B7A33]">Social Dropship</span> Ecosystem
            </h2>
            <div className="h-1.5 w-16 bg-[#0B7A33] rounded-full" />
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">
              Ecom Network is the most advanced, zero-overhead social drop-shipping and digital commerce workspace. 
              We empower local builders and online creators across Pakistan to establish real agencies. 
              By connecting with verified wholesale catalogs, you focus exclusively on marketing while our centralized 
              warehousing matches, packages, and dispatches door-to-door country-wide on your behalf.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-2xl font-black text-[#0B7A33] font-mono block">Zero</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Inventory Hurdles</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-2xl font-black text-[#0B7A33] font-mono block">Rs. 950</span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Lifetime Activation</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-6">
            <div className="relative p-8 rounded-[32px] bg-gradient-to-br from-gray-50 to-white border border-gray-150 shadow-md">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-[#12A84A] text-white font-mono text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                Next-Gen Logistic
              </div>
              <h3 className="text-lg font-black text-gray-950 uppercase tracking-tight text-left mb-6">Fully Integrated Network Tree</h3>
              <div className="space-y-4">
                {[
                  { title: "Direct Dropshipping", desc: "List high quality wholesale products on your storefront with customizable retail markup margins up to 40% per sale.", icon: "ShoppingBag" },
                  { title: "Binary Compensation Matrix", desc: "Build a left & right sales engine. Every active pin activation awards Rs. 200 direct referral and Rs. 200 pair bonuses.", icon: "GitMerge" },
                  { title: "Automated Shipping Cashouts", desc: "No manual courier accounts required. We dispatch orders automatically and accumulate clear commission balances onto your EasyPaisa or digital wallet.", icon: "CheckCircle" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-100 text-left hover:border-[#0B7A33]/20 transition-all">
                    <span className="text-[#0B7A33] bg-emerald-50 p-2.5 rounded-lg h-fit border border-emerald-100">
                      <DynamicIcon name={item.icon} size={18} />
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-950 uppercase">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Why Join Ecom Network */}
        <div className="py-16 border-t border-gray-100">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-black uppercase tracking-widest text-[#0B7A33] px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full select-none">
              Our Value Proposition
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold text-gray-950 uppercase tracking-tight">
              Why Join Ecom Network?
            </h2>
            <p className="mt-3 text-sm text-gray-500 font-semibold leading-relaxed">
              We remove every technical barrier, giving you a comprehensive, automated business template that is operational within minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "100% Dropshipping Code",
                desc: "Forget renting physical spaces or pre-purchasing stock. Just promote your store link, register sales, and we dispatch orders cash on delivery.",
                icon: "Sparkles",
                color: "bg-emerald-50 text-[#0B7A33] border-emerald-100"
              },
              {
                title: "Reliable Commission Structure",
                desc: "Achieve Rs. 200 for every direct referral active activation, plus Rs. 200 for every binary pair matched downline recursively without limits.",
                icon: "Coins",
                color: "bg-emerald-50 text-[#0B7A33] border-emerald-100"
              },
              {
                title: "Guaranteed Payout Clears",
                desc: "Receive clear earnings inside your local mobile accounts like EasyPaisa, JazzCash, or direct Bank accounts on command with our cashier clearance ticketing system.",
                icon: "Banknote",
                color: "bg-emerald-50 text-[#0B7A33] border-emerald-100"
              }
            ].map((prop, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-gray-150 hover:border-[#0B7A33]/30 hover:shadow-md transition-all">
                <span className={`p-3 rounded-2xl inline-block border ${prop.color} mb-6`}>
                  <DynamicIcon name={prop.icon} size={22} />
                </span>
                <h3 className="font-display font-black text-lg text-gray-950 uppercase tracking-tight">{prop.title}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed font-semibold">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Module 3: Business Opportunity */}
        <div className="pt-16 border-t border-gray-100">
          <div className="p-8 md:p-12 rounded-[32px] bg-gradient-to-br from-[#0B7A33]/5 to-[#12A84A]/5 border border-emerald-100 text-left relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-8 translate-x-12 select-none">
              <DynamicIcon name="TrendingUp" size={240} className="text-[#0B7A33]" />
            </div>
            
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#0B7A33] px-3 py-1 bg-white border border-emerald-100 rounded-lg">
                Exclusive Invitation
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-950 uppercase tracking-tight">
                Unlock Uncapped Binary Residual Income
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">
                Our binary system doesn't cap your progress. As your network grows on both Left and Right legs, every active activation within your downline hierarchy accumulates. 
                With a nominal lifetime verification ticket of just <strong className="text-[#0B7A33]">Rs. 950</strong>, unlock complete access to automated retail margins, multi-tier downline overrides, and achievement level ranks up to Rs. 1,500,000.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-100 text-xs font-mono font-bold text-[#0B7A33]">
                  <span>Symmetric Left Leg: Rs. 200</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-100 text-xs font-mono font-bold text-[#0B7A33]">
                  <span>Symmetric Right Leg: Rs. 200</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-100 text-xs font-mono font-bold text-[#0B7A33]">
                  <span>Level Milestone Bonuses: Up to Rs. 1.5M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
