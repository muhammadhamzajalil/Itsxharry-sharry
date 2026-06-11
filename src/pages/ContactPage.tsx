import React, { useState } from "react";
import { DynamicIcon } from "../components/DynamicIcon";

interface ContactPageProps {
  navigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", inquiryType: "Activation Support", msg: "" });
  const [ticketSubmitCode, setTicketSubmitCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.msg) return;
    // Generate a beautiful system-ticket tracking code
    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketSubmitCode(ticketId);
  };

  const supportFaqs = [
    { q: "How do I purchase an E-Pin for registration?", a: "You can send EasyPaisa or JazzCash transfers directly to the Admin phone account listed on your dashboard, then post a copy of the transaction ID to request your code instantly." },
    { q: "What is the minimum withdrawal commission amount?", a: "The minimum commission clearance threshold is Rs. 500. Cashier tickets are cleared into certified EasyPaisa, JazzCash, or bank accounts." },
    { q: "How does the Left versus Right leg matching work?", a: "Every time an active registration pin is verified under your Left leg and another under your Right leg, it forms a symmetric pair. Each matched pair grants Rs. 200, which accumulates down limits." },
    { q: "Do the level milestone bonuses reset my tree?", a: "No! Your binary structure accumulates continuously. Reaching a level rank simply triggers a separate one-time bonus payout without resetting your current pair states." }
  ];

  return (
    <div className="relative min-h-screen py-24 bg-white text-gray-900 overflow-hidden">
      {/* Dynamic Ambient lighting circles */}
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-emerald-50/50 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-green-50/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10 text-left">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 text-xs font-sans text-gray-500 hover:text-gray-950 border border-gray-200/80 bg-white hover:bg-gray-50 px-3.5 py-2 rounded-xl shadow-xs font-bold uppercase tracking-wider mb-12 cursor-pointer transition-colors"
        >
          <DynamicIcon name="ArrowLeft" size={13} />
          Back to Home
        </button>

        {/* Section Header */}
        <div className="text-center pb-12 border-b border-gray-100 max-w-3xl mx-auto select-none">
          <span className="text-xs font-mono tracking-widest text-[#0B7A33] uppercase font-extrabold px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            Certified Customer Care
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold text-gray-950 uppercase tracking-tight">
            Support Desk & Help Center
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-500 font-semibold leading-relaxed">
            Need activation pins, commission clears help, or team alignment diagnostics? Connect directly to Ecom Network support specialists.
          </p>
        </div>

        {/* Support Grid Channels */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column - Hotline Details & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-display font-black text-lg text-gray-950 uppercase tracking-tight">Direct Channels</h3>
              
              {/* WhatsApp Support */}
              <a 
                href="https://wa.me/923241651892" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 shadow-sm flex gap-4 transition-all block text-left"
              >
                <span className="text-[#0B7A33] bg-emerald-50 p-2.5 rounded-xl h-fit border border-emerald-110">
                  <DynamicIcon name="PhoneCall" size={20} />
                </span>
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 font-black block">Pakistan WhatsApp</span>
                  <span className="text-sm font-extrabold text-gray-950 block mt-1 uppercase">24/7 Hotline Support</span>
                  <span className="text-xs font-mono text-[#0B7A33] block mt-1 font-bold">
                    +92 324 16 51 892
                  </span>
                </div>
              </a>

              {/* Email Support */}
              <a 
                href="mailto:support@ecomnetwork.pk" 
                className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 shadow-sm flex gap-4 transition-all block text-left"
              >
                <span className="text-[#0B7A33] bg-emerald-50 p-2.5 rounded-xl h-fit border border-emerald-110">
                  <DynamicIcon name="Mail" size={20} />
                </span>
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 font-black block">Digital Office</span>
                  <span className="text-sm font-extrabold text-gray-950 block mt-1 uppercase">Inquiries & Corporate Desk</span>
                  <span className="text-xs font-mono text-[#0B7A33] block mt-1 font-bold">
                    support@ecomnetwork.pk
                  </span>
                </div>
              </a>

              {/* Customer Care Information */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-left">
                <h4 className="font-extrabold text-xs text-gray-950 uppercase">Customer Care Information</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed font-semibold">
                  • Operating Hours: Mon – Sat (09:00 AM – 06:00 PM PKT)<br />
                  • Core Clears checkouts run automatically 24 hours a day.<br />
                  • Main Physical Office coordinate Room: DHA Sector CC, Phase IV, Lahore, Pakistan.
                </p>
              </div>
            </div>

            {/* Help Center FAQs */}
            <div className="pt-6 space-y-4">
              <h3 className="font-display font-black text-lg text-gray-950 uppercase tracking-tight">Common Solutions</h3>
              <div className="space-y-3">
                {supportFaqs.map((faq, i) => (
                  <div key={i} className="p-4 bg-white border border-gray-150 rounded-2xl">
                    <h4 className="font-bold text-xs text-gray-950">{faq.q}</h4>
                    <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed font-semibold">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Submit Ticket & Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 rounded-[32px] bg-white border border-gray-200 shadow-sm">
              <h3 className="font-display font-black text-xl text-gray-950 uppercase tracking-tight">Submit Assistance Ticket</h3>
              <p className="text-xs text-gray-500 mt-1 font-semibold">Our operational support queues average less than 45 minutes response turnarounds.</p>

              {ticketSubmitCode ? (
                <div className="mt-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-left space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0B7A33] flex items-center justify-center">
                    <DynamicIcon name="CheckCircle" size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-gray-950 uppercase">Ticket Dispatched Successfully!</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed font-medium">
                      Your query has been indexed. Please preserve the tracking certificate code below for reference via WhatsApp.
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-emerald-200 rounded-xl font-mono text-center">
                    <span className="text-[9.5px] text-gray-400 font-bold block uppercase tracking-wider">Ticket Code</span>
                    <span className="text-lg font-black text-[#0B7A33] tracking-widest">{ticketSubmitCode}</span>
                  </div>
                  <button
                    onClick={() => setTicketSubmitCode(null)}
                    className="w-full py-3.5 bg-white border border-emerald-200 hover:bg-emerald-50/50 text-[#0B7A33] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Open Another Support Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5 font-mono text-xs text-left font-bold">
                  <div>
                    <label className="text-[9.5px] text-gray-500 uppercase tracking-widest block mb-1.5">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Kamran Shah"
                      className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-150 outline-none focus:border-[#0B7A33]/50 focus:bg-white text-gray-800 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9.5px] text-gray-500 uppercase tracking-widest block mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. kamran@gmail.com"
                        className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-150 outline-none focus:border-[#0B7A33]/50 focus:bg-white text-gray-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] text-gray-500 uppercase tracking-widest block mb-1.5">WhatsApp / Phone</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 03241651892"
                        className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-150 outline-none focus:border-[#0B7A33]/50 focus:bg-white text-gray-800 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9.5px] text-gray-500 uppercase tracking-widest block mb-1.5">Inquiry Classification Category</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-150 outline-none focus:border-[#0B7A33]/50 focus:bg-white text-gray-800 font-extrabold cursor-pointer"
                    >
                      <option value="Activation Support">Account Activation / E-Pin Issues</option>
                      <option value="Commission Clearance">Withdrawals & Bank Clearance</option>
                      <option value="Wholesale Orders">Wholesale Storefront Dropship Logs</option>
                      <option value="Corporate / Partnership">Business Opportunity Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9.5px] text-gray-500 uppercase tracking-widest block mb-1.5">Your Message / Request</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.msg}
                      onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                      placeholder="State precise transactional IDs, registration codes, or downline coordination technical queries..."
                      className="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-150 outline-none focus:border-[#0B7A33]/50 focus:bg-white text-gray-800 font-bold resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 py-4 bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-black uppercase text-xs rounded-xl transition-all shadow-md shadow-[#0B7A33]/15 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <DynamicIcon name="Navigation" size={13} />
                    Register certified Ticket
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
