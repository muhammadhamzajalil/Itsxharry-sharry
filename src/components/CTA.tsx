import React, { useState } from "react";
import { DynamicIcon } from "./DynamicIcon";

interface CTAProps {
  navigate?: (page: string) => void;
}

export const CTA: React.FC<CTAProps> = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    
    setIsSubmitting(true);
    
    // Simulate API registration lag
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  // Redirect to pre-composed WhatsApp dialogue with custom lead coordinates
  const getWhatsAppLink = () => {
    const message = `Hello Ecom Network! I just registered my pre-activation workspace request:
Name: ${formData.name || "Guest Partner"}
Email: ${formData.email || ""}
Phone: ${formData.phone || ""}
Please activate my free global store, and guide me on how to turn my connections into commissions!`;
    return `https://wa.me/923241651892?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="final-cta" className="relative py-24 bg-white text-gray-900 overflow-hidden border-t border-gray-100">
      
      {/* Decorative large warm radial light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-50/50 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-50/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* VALUE PROPOSITION LEFT: Column 1-6 */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-[#0B7A33] uppercase bg-emerald-50/60 border border-[#0B7A33]/15 px-3.5 py-1.5 rounded-full w-fit mx-auto lg:mx-0">
              Immediate Onboarding
            </span>
            
            <h2 className="mt-5 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-950 uppercase leading-none">
              Start Building <br className="hidden sm:inline" />
              Your Future Today
            </h2>

            <p className="mt-6 text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Join thousands of digital creators, e-commerce specialists, and affiliate ambassadors earning recurring income through the power of global connections.
            </p>

            {/* Bullet Highlights */}
            <div className="mt-8 flex flex-col gap-3.5 max-w-md mx-auto lg:mx-0">
              {[
                "100% Pre-Built Smart Storefront ready to configure",
                "Instant commission payouts direct to local bank lines",
                "Full access to the Ecom Network AI-powered copywriting tool",
                "Around-the-clock Tech Operator support and mentoring"
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3.5 text-left text-sm text-gray-700 font-medium">
                  <span className="text-[#0B7A33] p-0.5 rounded bg-emerald-50 border border-emerald-100 shrink-0 mt-0.5">
                    <DynamicIcon name="Check" size={12} className="stroke-[3]" />
                  </span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Quick stats highlight */}
            <div className="mt-10 pt-8 border-t border-gray-150 flex justify-center lg:justify-start gap-8 text-xs font-mono text-gray-500 font-bold">
              <div>
                <span className="text-gray-950 block text-lg font-extrabold">50K+</span> Active Members
              </div>
              <div className="w-[1px] h-8 bg-gray-200" />
              <div>
                <span className="text-gray-950 block text-lg font-extrabold">100+</span> Countries
              </div>
              <div className="w-[1px] h-8 bg-gray-200" />
              <div>
                <span className="text-gray-950 block text-lg font-extrabold">Rs. 2.5B+</span> Commissions Paid
              </div>
            </div>

          </div>

          {/* HIGH CONVERSION FORM RIGHT: Column 7-12 */}
          <div className="lg:col-span-6 flex justify-center">
            
            <div className="w-full max-w-md p-6 sm:p-8 rounded-[20px] bg-white border border-gray-200 shadow-2xl relative overflow-hidden text-left">
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-[40px] pointer-events-none" />

              {!isSuccess ? (
                <>
                  <div className="pb-6 border-b border-gray-150">
                    <h3 className="font-display font-bold text-xl text-gray-950">Create Free Account</h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Pre-configure your digital shop workspace in seconds</p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="mt-6 flex flex-col gap-4">
                    
                    {/* Name input */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Kamran Ali"
                        className="mt-2 p-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none text-sm text-gray-800 transition-all"
                      />
                    </div>

                    {/* Email input */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase">Personal Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. kamran@gmail.com"
                        className="mt-2 p-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none text-sm text-gray-800 transition-all"
                      />
                    </div>

                    {/* Phone/WhatsApp input */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase">WhatsApp Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. 0324 16 51 892"
                        className="mt-2 p-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B7A33]/50 focus:bg-white outline-none text-sm text-gray-800 transition-all"
                      />
                    </div>

                    {/* Action trigger button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-4 p-4 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white font-bold font-mono tracking-wider text-sm uppercase shadow-lg shadow-[#0B7A33]/15 transition-all flex justify-center items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin shrink-0" />
                          PRICING CONFIGURE FLOW...
                        </>
                      ) : (
                        <>
                          Create Free Account
                          <DynamicIcon name="ArrowRight" size={14} />
                        </>
                      )}
                    </button>

                  </form>

                  {/* Anti-spam note */}
                  <span className="block text-center text-[10px] text-gray-400 mt-4 leading-normal select-none font-medium">
                    🔒 SSL Certified Encryption. We do not sell or spam your data parameters under regulatory code standard.
                  </span>
                </>
              ) : (
                /* SUCCESS LEAD STAGE -> DIRECT CONVERSION LINK */
                <div className="text-center py-4 flex flex-col items-center gap-5">
                  
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-105 text-[#0B7A33] flex items-center justify-center shadow-md">
                    <DynamicIcon name="ShieldCheck" size={32} className="animate-bounce text-[#0B7A33]" />
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-xl text-gray-950">Pre-Activation Success!</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto font-medium">
                      Your Ecom Network affiliate workspace has been reserved. To unlock your pre-configured store, please coordinate with your direct Ambassador support.
                    </p>
                  </div>

                  {/* Simulated Ticket block */}
                  <div className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl p-4 text-left font-mono">
                    <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                      <span>TICKET_STAMP</span>
                      <span>ACTIVE_PENDING</span>
                    </div>
                    <div className="mt-2.5 flex flex-col gap-1.5 text-xs">
                      <div><span className="text-gray-500 uppercase font-bold text-[9px]">Partner Name:</span> <span className="text-gray-950 font-bold">{formData.name}</span></div>
                      <div><span className="text-gray-500 uppercase font-bold text-[9px]">Email Index:</span> <span className="text-gray-800 font-bold">{formData.email}</span></div>
                      <div><span className="text-gray-500 uppercase font-bold text-[9px]">Portal Status:</span> <span className="text-[#0B7A33] font-bold">AWAITING WHATSAPP PIN</span></div>
                    </div>
                  </div>

                  {/* Immediate Direct Link redirection CTA */}
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-4 rounded-xl bg-[#12A84A] hover:bg-[#0B7A33] text-white font-bold font-mono text-xs tracking-wider uppercase flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <DynamicIcon name="PhoneCall" size={14} className="animate-pulse" />
                    Activate Securely on WhatsApp
                  </a>

                  <p className="text-[10px] text-gray-500 max-w-xs font-medium">
                    * Redirection triggers a pre-composed chat on WhatsApp directly with our registration node <strong>0324 16 51 892</strong>.
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
