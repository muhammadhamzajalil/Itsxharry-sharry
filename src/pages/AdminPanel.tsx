import React, { useState, useEffect } from "react";
import { DynamicIcon } from "../components/DynamicIcon";
import { Key, CreditCard, Trash2, CheckCircle, RefreshCw, Plus, ArrowLeftRight, Check, X, ShieldAlert, Award } from "lucide-react";

interface AdminPanelProps {
  token: string | null;
  navigate: (page: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ token, navigate }) => {
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // CMS state
  const [tagline, setTagline] = useState("");
  const [pricingStarter, setPricingStarter] = useState(3500);
  const [pricingPro, setPricingPro] = useState(12500);
  const [cmsSuccess, setCmsSuccess] = useState(false);

  // Broadcast Notification state
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all");
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Selectable workspace page view
  const [activeTab, setActiveTab] = useState<"analytics" | "users" | "withdrawals" | "commissions" | "cms" | "epins" | "products">("analytics");

  // YourMart Dropship State Indicators
  const [ymCatalog, setYmCatalog] = useState<any[]>([]);
  const [ecomProducts, setEcomProducts] = useState<any[]>([]);
  const [globalMarkup, setGlobalMarkup] = useState<number>(500);
  const [categoryMarkups, setCategoryMarkups] = useState<Record<string, number>>({});
  const [ymSearch, setYmSearch] = useState("");
  const [ymCategoryFilter, setYmCategoryFilter] = useState("all");
  const [selectedYmIds, setSelectedYmIds] = useState<string[]>([]);
  const [syncingIds, setSyncingIds] = useState<Record<string, boolean>>({});
  const [bulkAction, setBulkAction] = useState("sync_stock");
  const [bulkExtraValue, setBulkExtraValue] = useState("");
  const [syncStatusMsg, setSyncStatusMsg] = useState("");
  const [markupStatusMsg, setMarkupStatusMsg] = useState("");
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState("");

  const fetchYourMartData = async () => {
    try {
      const catRes = await fetch("/api/yourmart/catalog");
      if (catRes.ok) {
        const catData = await catRes.json();
        setYmCatalog(catData.products || []);
      }

      const prodRes = await fetch("/api/products");
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setEcomProducts(prodData.products || []);
      }

      const settingsRes = await fetch("/api/yourmart/settings");
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.settings) {
          setGlobalMarkup(settingsData.settings.globalMarkup ?? 500);
          setCategoryMarkups(settingsData.settings.categoryMarkups ?? {});
        }
      }
    } catch (err) {
      console.error("Failed to load YourMart system parameters", err);
    }
  };

  // Admin E-Pins states
  const [adminPins, setAdminPins] = useState<any[]>([]);
  const [adminRequests, setAdminRequests] = useState<any[]>([]);
  const [adminPaymentDetails, setAdminPaymentDetails] = useState<any>(null);

  // Form states
  const [generateQty, setGenerateQty] = useState("5");
  const [generateTargetUser, setGenerateTargetUser] = useState("");
  const [transferPinCode, setTransferPinCode] = useState("");
  const [transferDestUser, setTransferDestUser] = useState("");
  
  // Payment edit states
  const [epNum, setEpNum] = useState("");
  const [epTitle, setEpTitle] = useState("");
  const [jcNum, setJcNum] = useState("");
  const [jcTitle, setJcTitle] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNum, setBankNum] = useState("");
  const [bankTitle, setBankTitle] = useState("");

  const fetchAdminPins = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/epins/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminPins(data.pins || []);
        setAdminRequests(data.requests || []);
      }

      const payRes = await fetch("/api/epins/payment-details");
      if (payRes.ok) {
        const payData = await payRes.json();
        setAdminPaymentDetails(payData.paymentDetails);
        if (payData.paymentDetails) {
          setEpNum(payData.paymentDetails.easypaisa?.accountNumber || "");
          setEpTitle(payData.paymentDetails.easypaisa?.accountTitle || "");
          setJcNum(payData.paymentDetails.jazzcash?.accountNumber || "");
          setJcTitle(payData.paymentDetails.jazzcash?.accountTitle || "");
          setBankName(payData.paymentDetails.bank?.bankName || "");
          setBankNum(payData.paymentDetails.bank?.accountNumber || "");
          setBankTitle(payData.paymentDetails.bank?.accountTitle || "");
        }
      }
    } catch (err) {
      console.error("Failed to load administrative pins.", err);
    }
  };

  useEffect(() => {
    if (activeTab === "epins" && token) {
      fetchAdminPins();
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab === "products" && token) {
      fetchYourMartData();
    }
  }, [activeTab, token]);

  const fetchAdminDetails = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/analytics", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to authorize Super Admin coordinate context.");
      }
      setAdminData(data);
      
      // Seed default configurations
      if (data.cms) {
        setTagline(data.cms.homepageTagline || "");
        setPricingStarter(data.cms.pricingStarter || 3500);
        setPricingPro(data.cms.pricingPro || 12500);
      }
    } catch (err: any) {
      setError(err.message || "Admin authorization failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDetails();
  }, [token]);

  // Action: Approve or Reject Payout Clearance
  const handleClearanceAction = async (id: number, action: "Approved" | "Rejected") => {
    try {
      const res = await fetch("/api/admin/withdrawal-clear", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ withdrawalId: id, action })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Clearance failed.");
      }
      fetchAdminDetails(); // Refresh
    } catch (err: any) {
      alert("⚠️ Clearance error: " + err.message);
    }
  };

  // Action: Approve or Reject Commission Ledger items
  const handleCommissionAction = async (id: number, action: "Approved" | "Rejected") => {
    try {
      const res = await fetch("/api/admin/commission-clear", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ commissionId: id, action })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Override clearance failed.");
      }
      fetchAdminDetails(); // Refresh
    } catch (err: any) {
      alert("⚠️ Override action clearance error: " + err.message);
    }
  };

  // Action: Create Broadcast
  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSuccess(false);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMsg,
          targetRole: broadcastTarget
        })
      });

      if (!res.ok) {
        throw new Error("Failed to transmission broadcast coordinates.");
      }

      setBroadcastSuccess(true);
      setBroadcastTitle("");
      setBroadcastMsg("");
      fetchAdminDetails();
    } catch (err: any) {
      alert("⚠️ Broadcast deployment fault check: " + err.message);
    }
  };

  // Action: Edit CMS tags
  const handleCmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSuccess(false);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          homepageTagline: tagline,
          pricingStarter: Number(pricingStarter),
          pricingPro: Number(pricingPro)
        })
      });

      if (!res.ok) {
        throw new Error("CMS updating failed.");
      }

      setCmsSuccess(true);
      fetchAdminDetails();
    } catch (err: any) {
      alert("⚠️ CMS write fault: " + err.message);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    if (!confirm(`Are you sure you want to change this member status to: ${nextStatus.toUpperCase()}?`)) return;

    try {
      const res = await fetch("/api/admin/user-status", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, status: nextStatus })
      });

      if (!res.ok) {
        throw new Error("Failed to toggle user status.");
      }

      fetchAdminDetails();
    } catch (err: any) {
      alert("⚠️ User status change error: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-mono text-xs text-gray-500">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="w-8 h-8 rounded-full border-2 border-emerald-100 border-t-[#0B7A33] animate-spin" />
          <span className="font-bold tracking-widest text-[#0B7A33] uppercase">AUTHORIZING ADMINISTRATIVE SUITE INDEX...</span>
        </div>
      </div>
    );
  }

  if (error || !adminData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-[20px] p-8 text-center shadow-lg">
          <DynamicIcon name="Lock" size={48} className="text-red-500 mx-auto" />
          <h3 className="mt-4 font-display font-extrabold text-lg text-gray-950 uppercase">Administrative Clearance Rejected</h3>
          <p className="mt-2 text-xs text-gray-500 font-medium leading-normal">{error || "Insufficient clearance level coordinates detected."}</p>
          <button onClick={() => navigate("dashboard")} className="mt-6 px-6 py-2.5 bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-mono font-bold uppercase rounded-xl cursor-pointer">
            Return to User Terminal
          </button>
        </div>
      </div>
    );
  }

  const { stats, users, withdrawals, commissions } = adminData;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 antialiased">
      
      {/* Admin Panel Header Menu */}
      <header className="fixed top-0 left-0 right-0 z-40 py-3.5 bg-white border-b border-gray-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          <div className="flex items-center gap-2">
            <span className="p-1 px-3.5 rounded-full bg-amber-50 border border-amber-100 text-amber-800 font-mono text-xs font-bold uppercase tracking-wider">
              SUPER ADMIN CONSOLE
            </span>
            <span className="text-xs text-gray-500 font-mono font-bold hidden sm:inline">
              Secure Auth Cleared Node
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("dashboard")}
              className="px-4 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0B7A33] border border-emerald-100 text-xs font-sans font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              Affiliate Terminal
            </button>
            <button
              onClick={() => navigate("home")}
              className="text-xs font-sans font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase cursor-pointer"
            >
              Lobby
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Work Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* TOPLINE OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 text-left">
          
          {/* Card 1 */}
          <div className="p-5 rounded-[20px] bg-white border border-gray-200/80 shadow-sm relative overflow-hidden">
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider font-extrabold block">Consolidated Users</span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-950 block mt-2 font-mono leading-none">
              {stats.totalUsers.toLocaleString()} <span className="text-xs text-gray-400 font-bold">Nodes</span>
            </span>
            <span className="text-[9px] font-mono font-bold text-[#0B7A33] block mt-3.5">Active accounts: {users.filter((u:any)=>u.status=="active").length}</span>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-[20px] bg-white border border-gray-200/80 shadow-sm relative overflow-hidden">
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider font-extrabold block">Gross Royalties Paid</span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-950 block mt-2 font-mono leading-none">
              {stats.totalCommissionsPaid.toLocaleString()} <span className="text-xs text-gray-400 font-bold">PKR</span>
            </span>
            <span className="text-[9px] font-mono font-bold text-teal-600 block mt-3.5">Processed direct overrides</span>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-[20px] bg-white border border-gray-200/80 shadow-sm relative overflow-hidden">
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider font-extrabold block">Pending Withdrawals</span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-600 block mt-2 font-mono leading-none">
              {stats.pendingWithdrawalsCount} <span className="text-xs text-amber-600 font-bold">Trans</span>
            </span>
            <span className="text-[9px] font-mono font-bold text-amber-600 block mt-3.5">Awaiting cashier audits</span>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-[20px] bg-white border border-gray-200/80 shadow-sm relative overflow-hidden">
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider font-extrabold block">Total Cashout Settled</span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#0B7A33] block mt-2 font-mono leading-none">
              {stats.totalWithdrawalsSettled.toLocaleString()} <span className="text-xs text-[#0B7A33] font-bold">PKR</span>
            </span>
            <span className="text-[9px] font-mono font-bold text-emerald-600 block mt-3.5">Completed disbursements</span>
          </div>

          {/* Card 5 */}
          <div className="p-5 rounded-[20px] bg-white border border-gray-200/80 shadow-sm relative overflow-hidden col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider font-extrabold block">Platform conversion</span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-600 block mt-2 font-mono leading-none">
              86.4%
            </span>
            <span className="text-[9px] font-mono font-bold text-gray-400 block mt-3.5">Auto-calculated index</span>
          </div>

        </div>

        {/* CONTROLS SEPARATOR ROW */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Rails (Drawer) */}
          <div className="lg:col-span-3 flex lg:flex-col gap-1.5 border-b lg:border-b-0 lg:border-r border-gray-250 pb-4 lg:pb-0 lg:pr-4 overflow-x-auto select-none">
            {[
              { id: "analytics", label: "Analytics Bento", icon: "AreaChart" },
              { id: "users", label: "Co-Op Members Matrix", icon: "Users" },
              { id: "withdrawals", label: "Cashier Clearance Logs", icon: "Coins" },
              { id: "commissions", label: "Commission Overrides", icon: "TrendingUp" },
              { id: "cms", label: "CMS Settings Editor", icon: "Settings" },
              { id: "epins", label: "E-Pins & Activations", icon: "Key" },
              { id: "products", label: "YourMart Dropship Hub", icon: "ShoppingBag" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer border ${
                  activeTab === tab.id
                    ? "bg-amber-50 text-amber-800 border-amber-200 font-black shadow-xs"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/60 border-transparent"
                }`}
              >
                <DynamicIcon name={tab.icon} size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* TAB VIEW: System Analytics graphs and Manual Broadcast Module */}
            {activeTab === "analytics" && (
              <div className="space-y-6 text-left">
                
                {/* Visual Grid Inline SVG Render */}
                <div className="p-6 bg-white border border-gray-200 rounded-[20px] shadow-sm">
                  <h3 className="font-display font-bold text-base text-gray-950">System Growth & Conversion Velocities</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Tracking daily store registrations & volume splits</p>

                  <div className="mt-6 h-56 w-full bg-gray-50/50 rounded-2xl border border-gray-200 p-4 flex flex-col justify-between shadow-xs">
                    
                    <svg className="w-full h-44 font-mono select-none" viewBox="0 0 600 150">
                      
                      <defs>
                        <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0B7A33" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#0B7A33" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* X gridlines */}
                      <line x1="20" y1="120" x2="580" y2="120" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="20" y1="80" x2="580" y2="80" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="20" y1="40" x2="580" y2="40" stroke="#E5E7EB" strokeWidth="1" />

                      {/* Line Paths */}
                      <path
                        d="M 20 120 L 100 110 L 180 85 L 260 92 L 340 60 L 420 50 L 500 30 L 580 15"
                        fill="none"
                        stroke="#0B7A33"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      <path
                        d="M 20 120 L 100 110 L 180 85 L 260 92 L 340 60 L 420 50 L 500 30 L 580 15 L 580 130 L 20 130 Z"
                        fill="url(#chart-glow)"
                      />

                      {/* Node dots */}
                      <circle cx="180" cy="85" r="4.5" className="fill-[#0B7A33] stroke-white stroke-2" />
                      <circle cx="340" cy="60" r="4.5" className="fill-[#0B7A33] stroke-white stroke-2" />
                      <circle cx="500" cy="30" r="4.5" className="fill-[#0B7A33] stroke-white stroke-2" />

                      {/* Labels */}
                      <text x="25" y="132" className="fill-gray-400 text-[8px] font-bold">Week 1</text>
                      <text x="185" y="132" className="fill-gray-400 text-[8px] font-bold">Week 2</text>
                      <text x="345" y="132" className="fill-gray-400 text-[8px] font-bold">Week 3</text>
                      <text x="505" y="132" className="fill-gray-400 text-[8px] font-bold">Week 4</text>
                      
                    </svg>

                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono font-bold">
                      <span>Store Registrations velocity trends: +38.5% Week-on-Week</span>
                      <span className="text-[#0B7A33] font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#0B7A33] rounded-full animate-ping" /> ONLINE MONITOR ACTIVE</span>
                    </div>

                  </div>
                </div>

                {/* Broadcast Broadcaster form */}
                <div className="p-6 bg-white border border-gray-200 rounded-[20px] shadow-sm">
                  <h3 className="font-display font-bold text-base text-gray-950">Platform Broadcast Dispatch Coordinates</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Push manual broadcast notifications directly onto partner workspace cards</p>

                  {broadcastSuccess && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-[#0B7A33] font-mono font-bold flex items-center gap-2">
                      <DynamicIcon name="CheckCircle" size={16} />
                      <span>Broadcast coordinates successfully dispatched across active workspaces!</span>
                    </div>
                  )}

                  <form onSubmit={handleBroadcastSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs font-bold">
                    
                    <div className="flex flex-col">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold mb-1.5">Broadcast Subject Name</label>
                      <input
                        type="text"
                        required
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        placeholder="e.g. VIP Leaderboard Reset"
                        className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:border-amber-500/50 focus:bg-white"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold mb-1.5">Target Partner Level</label>
                      <select
                        value={broadcastTarget}
                        onChange={(e) => setBroadcastTarget(e.target.value)}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:border-amber-500/50 focus:bg-white text-xs"
                      >
                        <option value="all">Broadcast All Registered Nodes (L1 + L2 + L3)</option>
                        <option value="admin">Super Administrators Desk Only</option>
                        <option value="member">Verified Active Affiliates Only</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 flex flex-col">
                      <label className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold mb-1.5">Message Details Payload</label>
                      <textarea
                        required
                        rows={3}
                        value={broadcastMsg}
                        onChange={(e) => setBroadcastMsg(e.target.value)}
                        placeholder="Detail the news, system alerts, or commission rates update coordinates..."
                        className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:border-amber-500/50 focus:bg-white resize-none"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold font-mono text-xs uppercase cursor-pointer"
                      >
                        Transmit Broadcaster Payload
                      </button>
                    </div>

                  </form>
                </div>

              </div>
            )}

            {/* TAB VIEW: Co-Op Members List Management */}
            {activeTab === "users" && (
              <div className="p-6 bg-white border border-gray-200 rounded-[20px] shadow-sm space-y-6 text-left">
                <div>
                  <h3 className="font-display font-bold text-base text-gray-950">System Members Database Ledger</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Verify information parameters, toggle security status suspension, or verify balances</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs text-gray-700">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 uppercase text-[9px] tracking-widest font-bold">
                        <th className="py-3">User ID</th>
                        <th className="py-3">Name</th>
                        <th className="py-3">Username</th>
                        <th className="py-3">Email</th>
                        <th className="py-3">Phone</th>
                        <th className="py-3">Registration Date</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Administrative</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/60 font-medium">
                      {users.map((u: any) => (
                        <tr key={u.id} className="hover:bg-gray-50/50">
                          <td className="py-3 font-bold text-gray-900">{u.user_id || u.id}</td>
                          <td className="py-3 text-gray-800">{u.name}</td>
                          <td className="py-3 font-semibold text-[#0B7A33]">@{u.username}</td>
                          <td className="py-3 text-gray-500">{u.email}</td>
                          <td className="py-3 text-gray-500">{u.mobile || u.phone || "N/A"}</td>
                          <td className="py-3 text-gray-400">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : "N/A"}
                          </td>
                          <td className="py-3 font-bold">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] border ${
                              u.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              u.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                              "bg-red-50 text-red-650 border-red-100"
                            }`}>
                              {u.status ? u.status.toUpperCase() : "PENDING"}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {u.role !== "admin" && (
                              <button
                                onClick={() => toggleUserStatus(u.id, u.status)}
                                className={`px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-colors border ${
                                  u.status === "active"
                                    ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                                    : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-[#0B7A33]"
                                }`}
                              >
                                {u.status === "active" ? "SUSPEND" : "ACTIVATE"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB VIEW: Cashier Clearance Logs */}
            {activeTab === "withdrawals" && (
              <div className="p-6 bg-white border border-gray-200 rounded-[20px] space-y-4 text-left shadow-sm">
                <div>
                  <h3 className="font-display font-bold text-base text-gray-950">Payment Requests / Cashout Clearance</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Disburse earnings to user's specified JazzCash, EasyPaisa, Bank, or Crypto accounts</p>
                </div>

                {withdrawals.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs font-mono font-bold">No cash checks pending cashier validation.</div>
                ) : (
                  <div className="overflow-x-auto animate-fadeIn">
                    <table className="w-full text-left font-mono text-xs text-gray-700">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-400 uppercase text-[9px] tracking-widest font-bold">
                          <th className="py-3">User Coordinate</th>
                          <th className="py-3">Method</th>
                          <th className="py-3">Coordinates Details</th>
                          <th className="py-3">Volume (PKR)</th>
                          <th className="py-3">Status</th>
                          <th className="py-3 text-right">Clearing Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100/60 font-medium">
                        {withdrawals.map((w: any) => (
                          <tr key={w.id} className="hover:bg-gray-50/50">
                            <td className="py-3 text-gray-900 font-bold">
                              @{w.username}
                              <span className="block text-[10px] text-gray-400 font-normal">UID: #{w.userId}</span>
                            </td>
                            <td className="py-3 font-bold text-gray-950">{w.method}</td>
                            <td className="py-3 text-gray-500 max-w-[240px] truncate font-medium" title={w.details}>{w.details}</td>
                            <td className="py-3 font-extrabold text-[#0B7A33]">{w.amount.toLocaleString()}</td>
                            <td className="py-3 font-bold">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] border ${
                                w.status === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                w.status === "Approved" ? "bg-teal-50 text-teal-700 border-teal-100" :
                                w.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                "bg-red-50 text-red-700 border-red-100"
                              }`}>
                                {w.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {w.status === "Pending" ? (
                                <div className="flex gap-1.5 justify-end">
                                  <button
                                    onClick={() => handleClearanceAction(w.id, "Approved")}
                                    className="px-2.5 py-1.5 rounded-lg bg-[#0B7A33] hover:bg-[#12A84A] text-white font-bold font-mono text-[9px] uppercase cursor-pointer"
                                  >
                                    PAYOUT
                                  </button>
                                  <button
                                    onClick={() => handleClearanceAction(w.id, "Rejected")}
                                    className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold font-mono text-[9px] uppercase cursor-pointer"
                                  >
                                    REJECT
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-mono italic">Document settled</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* TAB VIEW: Commissions override ledger queue */}
            {activeTab === "commissions" && (
              <div className="p-6 bg-white border border-gray-200 rounded-[20px] space-y-4 text-left shadow-sm">
                <div>
                  <h3 className="font-display font-bold text-base text-gray-950">Affiliate Commission Ledger Clear List</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Approve direct retail margins or Level 2 & 3 affiliate override points before payouts</p>
                </div>

                {commissions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-xs font-mono font-bold">No commission entries linked or filed yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs text-gray-700">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-400 uppercase text-[9px] tracking-widest font-bold">
                          <th className="py-3">From Host</th>
                          <th className="py-3">Trigger Type</th>
                          <th className="py-3">Level Override</th>
                          <th className="py-3">Cash (PKR)</th>
                          <th className="py-3">Status</th>
                          <th className="py-3 text-right font-bold">SLA Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100/60 font-medium">
                        {commissions.map((c: any) => (
                          <tr key={c.id} className="hover:bg-gray-50/50">
                            <td className="py-3 text-gray-900 font-bold">@{c.fromUsername}</td>
                            <td className="py-3 text-gray-500">{c.type} Override</td>
                            <td className="py-3 text-gray-600">L{c.level} Split</td>
                            <td className="py-3 font-bold text-[#0B7A33]">{c.amount.toLocaleString()}</td>
                            <td className="py-3 font-bold">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] border ${
                                c.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                c.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                "bg-red-50 text-red-700 border-red-100"
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {c.status === "Pending" ? (
                                <div className="flex gap-1.5 justify-end">
                                  <button
                                    onClick={() => handleCommissionAction(c.id, "Approved")}
                                    className="px-2.5 py-1 bg-[#0B7A33] hover:bg-[#12A84A] text-white font-bold font-mono text-[9px] uppercase cursor-pointer rounded-lg"
                                  >
                                    Authorize Clear
                                  </button>
                                  <button
                                    onClick={() => handleCommissionAction(c.id, "Rejected")}
                                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold font-mono text-[9px] uppercase cursor-pointer rounded-lg"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold">Cleared</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* TAB VIEW: CMS Settings dynamic edits updater */}
            {activeTab === "cms" && (
              <div className="p-6 bg-white border border-gray-200 rounded-[20px] space-y-6 text-left shadow-sm">
                <div>
                  <h3 className="font-display font-bold text-base text-gray-950">Dynamic Content Management System (CMS)</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Edit store headlines, about info, or pricing rates without writing code</p>
                </div>

                {cmsSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-[#0B7A33] font-mono font-bold flex items-center gap-2">
                    <DynamicIcon name="CheckCircle" size={16} />
                    <span>Dynamic JSON parameters saved securely directly back to persistent databases.</span>
                  </div>
                )}

                <form onSubmit={handleCmsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs font-bold text-left">
                  
                  {/* Headline Tagline */}
                  <div className="md:col-span-2 flex flex-col">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold mb-1.5">Homepage Headline Subtagline</label>
                    <input
                      type="text"
                      required
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Turn Connections Into Commissions"
                      className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0B7A33] focus:border-amber-500/50 focus:bg-white outline-none text-xs font-bold"
                    />
                  </div>

                  {/* Starter pricing subscription */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold mb-1.5">Starter Subscription rate (PKR)</label>
                    <input
                      type="number"
                      required
                      value={pricingStarter}
                      onChange={(e) => setPricingStarter(Number(e.target.value))}
                      className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:border-[#0B7A33]/50 focus:bg-white outline-none text-xs"
                    />
                  </div>

                  {/* Pro pricing subscription */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold mb-1.5">Enterprise Pro subscription rate (PKR)</label>
                    <input
                      type="number"
                      required
                      value={pricingPro}
                      onChange={(e) => setPricingPro(Number(e.target.value))}
                      className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:border-[#0B7A33]/50 focus:bg-white outline-none text-xs"
                    />
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold font-mono text-xs uppercase shadow-md transition-all cursor-pointer"
                    >
                      Commit Digital Copy Writes
                    </button>
                  </div>

                </form>

              </div>
            )}

            {/* TAB VIEW: 🔑 E-PINS SYSTEM MANAGER */}
            {activeTab === "epins" && (
              <div className="space-y-8 animate-fadeIn text-left">
                
                {/* Visual Overview cards for Admin */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-gray-400 tracking-wider font-extrabold block">Platform Total E-Pins</span>
                    <span className="text-2xl font-extrabold text-[#0B7A33] block mt-1 font-mono">
                      {adminPins.length} <span className="text-xs text-gray-400">issued</span>
                    </span>
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-gray-400 tracking-wider font-extrabold block">Unused (Available)</span>
                    <span className="text-2xl font-extrabold text-[#12A84A] block mt-1 font-mono">
                      {adminPins.filter(p => p.status === "Unused").length} <span className="text-xs text-gray-400">assets</span>
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-gray-400 tracking-wider font-extrabold block">Used (Redeemed)</span>
                    <span className="text-2xl font-extrabold text-gray-400 block mt-1 font-mono">
                      {adminPins.filter(p => p.status === "Used").length} <span className="text-xs text-gray-450">profiles</span>
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-amber-200/60 bg-amber-50/20 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-amber-700 tracking-wider font-extrabold block">Pending Requests Queue</span>
                    <span className="text-2xl font-extrabold text-amber-600 block mt-1 font-mono">
                      {adminRequests.filter(r => r.status === "Pending").length} <span className="text-xs text-amber-500 font-bold">TIDs</span>
                    </span>
                  </div>
                </div>

                {/* Main operational splits */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Requests Queue Approvals */}
                  <div className="lg:col-span-8 space-y-8">
                    
                    {/* Queue Card */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                      <div className="pb-4 border-b border-gray-100 mb-6 flex justify-between items-center">
                        <div>
                          <h3 className="font-extrabold text-sm text-gray-900 uppercase">INCOMING E-PIN PURCHASE REQUESTS</h3>
                          <p className="text-[10px] text-gray-400 mt-0.5">Approve incoming bank transfers to instantly generate and deposit pins</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-amber-800 text-[9px] font-mono font-bold leading-none uppercase">
                          Manual Auditing Required
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans text-xs">
                          <thead>
                            <tr className="border-b border-gray-100 font-mono text-[9px] text-gray-400 uppercase font-extrabold">
                              <th className="pb-2">Requester</th>
                              <th className="pb-2">Quantity</th>
                              <th className="pb-2">TID (Trans Code)</th>
                              <th className="pb-2">Channel / Slip</th>
                              <th className="pb-2">Status</th>
                              <th className="pb-2 text-right">Audit Payout</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {adminRequests.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="py-10 text-center text-gray-400">
                                  No E-Pin purchase requests have been filed by users.
                                </td>
                              </tr>
                            ) : (
                              adminRequests.map((req: any) => (
                                <tr key={req.id} className="hover:bg-gray-50/50">
                                  <td className="py-3 font-semibold text-gray-900">@{req.username}</td>
                                  <td className="py-3 font-bold font-mono text-emerald-800">{req.quantity} Pins</td>
                                  <td className="py-3 font-mono text-xs uppercase font-bold text-gray-750" title={req.transactionId}>{req.transactionId}</td>
                                  <td className="py-3 font-medium">
                                    <span className="block text-[11px] text-gray-800 font-bold">{req.paymentMethod}</span>
                                    {req.screenshotUrl ? (
                                      <a href={req.screenshotUrl} target="_blank" rel="noreferrer" className="text-[9px] text-[#0B7A33] hover:underline block mt-0.5 font-bold">
                                        View Slip Screenshot ↗
                                      </a>
                                    ) : (
                                      <span className="text-[9px] text-gray-400 block mt-0.5">No screenshot submitted</span>
                                    )}
                                  </td>
                                  <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                      req.status === "Pending" ? "bg-amber-100 text-amber-800" :
                                      req.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                                      "bg-red-100 text-red-800"
                                    }`}>
                                      {req.status}
                                    </span>
                                  </td>
                                  <td className="py-3 text-right">
                                    {req.status === "Pending" ? (
                                      <div className="flex gap-1.5 justify-end">
                                        <button
                                          onClick={async () => {
                                            if (!confirm(`Are you sure you want to approve this request and automatically credit ${req.quantity} E-Pins code to user @${req.username}?`)) return;
                                            try {
                                              const res = await fetch("/api/admin/epins/approve-request", {
                                                method: "POST",
                                                headers: {
                                                  "Content-Type": "application/json",
                                                  "Authorization": `Bearer ${token}`
                                                },
                                                body: JSON.stringify({ requestId: req.id })
                                              });
                                              if (!res.ok) {
                                                const errRes = await res.json();
                                                throw new Error(errRes.error || "Approval clearance failed.");
                                              }
                                              alert("✓ Payment verified! E-Pins generated and transferred successfully.");
                                              fetchAdminPins();
                                            } catch (err: any) {
                                              alert("⚠️ Clearance error: " + err.message);
                                            }
                                          }}
                                          className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#0B7A33] hover:bg-[#12A84A] rounded-lg transition-colors cursor-pointer"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={async () => {
                                            if (!confirm("Are you sure you want to REJECT this purchase request?")) return;
                                            try {
                                              const res = await fetch("/api/admin/epins/reject-request", {
                                                method: "POST",
                                                headers: {
                                                  "Content-Type": "application/json",
                                                  "Authorization": `Bearer ${token}`
                                                },
                                                body: JSON.stringify({ requestId: req.id })
                                              });
                                              if (!res.ok) throw new Error("Rejection clearance failed.");
                                              alert("✓ Request rejected.");
                                              fetchAdminPins();
                                            } catch (err: any) {
                                              alert("⚠️ Clearance error: " + err.message);
                                            }
                                          }}
                                          className="px-2 py-1 text-[10px] bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 rounded-lg transition-colors cursor-pointer"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold">Cleared</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Master Ledger Directory */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                      <div className="pb-4 border-b border-gray-100 mb-6">
                        <h3 className="font-extrabold text-sm text-gray-900 uppercase">SYSTEM GLOBAL E-PINS MATRIX DIRECTORY</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Real-time catalog representing every single activation key issued under Ecom Network</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans text-xs">
                          <thead>
                            <tr className="border-b border-gray-100 font-mono text-[9px] text-gray-400 uppercase font-extrabold">
                              <th className="pb-2">Pin Number Code</th>
                              <th className="pb-2">Assigned Owner</th>
                              <th className="pb-2">Current Status</th>
                              <th className="pb-2">Issue Date</th>
                              <th className="pb-2">Activated Member</th>
                              <th className="pb-2 text-right">SLA actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {adminPins.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="py-6 text-center text-gray-400 font-medium">
                                  No E-Pin instances recorded in platform database.
                                </td>
                              </tr>
                            ) : (
                              adminPins.map((pin: any) => (
                                <tr key={pin.id} className="hover:bg-gray-50/50">
                                  <td className="py-2.5 font-mono font-bold text-gray-900 tracking-wider text-xs">
                                    {pin.pinCode}
                                  </td>
                                  <td className="py-2.5 text-gray-700 font-sans font-extrabold">
                                    @{pin.assignedTo}
                                  </td>
                                  <td className="py-2.5">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                      pin.status === "Unused" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"
                                    }`}>
                                      {pin.status}
                                    </span>
                                  </td>
                                  <td className="py-2.5 font-mono text-[10px] text-gray-400">
                                    {new Date(pin.createdAt || Date.now()).toLocaleDateString()}
                                  </td>
                                  <td className="py-2.5 font-medium text-gray-800">
                                    {pin.status === "Used" ? (
                                      <div className="text-left leading-none font-bold">
                                        <span>@{pin.usedBy}</span>
                                        <span className="text-[8px] font-mono text-gray-400 block mt-1">{new Date(pin.usedAt).toLocaleDateString()}</span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">—</span>
                                    )}
                                  </td>
                                  <td className="py-2.5 text-right font-sans">
                                    {pin.status === "Unused" && (
                                      <button
                                        onClick={async () => {
                                          if (!confirm(`Are you absolutely sure you want to void, deactivate, and permanently delete the available E-pin code ${pin.pinCode}?`)) return;
                                          try {
                                            const res = await fetch("/api/admin/epins/deactivate", {
                                              method: "POST",
                                              headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}`
                                              },
                                              body: JSON.stringify({ pinCode: pin.pinCode })
                                            });
                                            if (!res.ok) throw new Error("Deactivation failed.");
                                            alert(`✓ E-Pin ${pin.pinCode} successfully voided.`);
                                            fetchAdminPins();
                                          } catch (err: any) {
                                            alert("⚠️ Deactivation error: " + err.message);
                                          }
                                        }}
                                        className="py-1 px-2 Text-[10px] bg-red-50 hover:bg-red-100 text-red-650 font-bold uppercase rounded border border-red-100 transition-colors cursor-pointer"
                                      >
                                        Void Key
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Payments Settings & Generation Form */}
                  <div className="lg:col-span-4 space-y-8">
                    
                    {/* Manual Generation Console */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                      <div className="pb-4 border-b border-gray-100 mb-5 flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-[#0B7A33]/10 text-[#0B7A33]">
                          <Plus size={16} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-900 uppercase">PIN GEN TERMINAL</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Manually spawn unique activation keys</p>
                        </div>
                      </div>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (parseInt(generateQty) < 1) return;
                        try {
                          const res = await fetch("/api/admin/epins/generate", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              quantity: parseInt(generateQty),
                              username: generateTargetUser || undefined
                            })
                          });
                          const jsonRes = await res.json();
                          if (!res.ok) {
                            throw new Error(jsonRes.error || "Generation script failed.");
                          }
                          alert(`✓ Successfully generated and assigned ${generateQty} unique E-Pins to user @${generateTargetUser || "admin"}!`);
                          setGenerateTargetUser("");
                          fetchAdminPins();
                        } catch (err: any) {
                          alert("⚠️ Error: " + err.message);
                        }
                      }} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1">Pins Quantity *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="100"
                            value={generateQty}
                            onChange={(e) => setGenerateQty(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-[#0B7A33]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1">Target Account Username (Blank for Admin)</label>
                          <input
                            type="text"
                            placeholder="e.g. kamran_ecom"
                            value={generateTargetUser}
                            onChange={(e) => setGenerateTargetUser(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-[#0B7A33]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          Generate E-Pins Spawn
                        </button>
                      </form>
                    </div>

                    {/* Manual Pin Transfer Console */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                      <div className="pb-4 border-b border-gray-100 mb-5 flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                          <ArrowLeftRight size={16} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-900 uppercase">TRANSFER LEDGER</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Move available unused pins to users</p>
                        </div>
                      </div>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!transferPinCode || !transferDestUser) {
                          alert("Please fill in both Pin Code and Recipient Username.");
                          return;
                        }
                        try {
                          const res = await fetch("/api/admin/epins/transfer", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              pinCode: transferPinCode.trim().toUpperCase(),
                              recipientUsername: transferDestUser.trim().toLowerCase()
                            })
                          });
                          const resData = await res.json();
                          if (!res.ok) {
                            throw new Error(resData.error || "Pin transfer clearance failed.");
                          }
                          alert(`✓ Successfully transferred available E-Pin ${transferPinCode} to user @${transferDestUser}!`);
                          setTransferPinCode("");
                          setTransferDestUser("");
                          fetchAdminPins();
                        } catch (err: any) {
                          alert("⚠️ E-Pin Transfer failure: " + err.message);
                        }
                      }} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1">Pin Code Number *</label>
                          <input
                            type="text"
                            required
                            placeholder="ECN-XXXX-XXXX"
                            value={transferPinCode}
                            onChange={(e) => setTransferPinCode(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold outline-none focus:border-[#0B7A33] uppercase"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1 font-sans">Recipient Partner Username *</label>
                          <input
                            type="text"
                            required
                            placeholder="Recipient's Username"
                            value={transferDestUser}
                            onChange={(e) => setTransferDestUser(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-[#0B7A33]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          Execute Key Transfer
                        </button>
                      </form>
                    </div>

                    {/* Official Payment Credentials Configurations Card */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                      <div className="pb-4 border-b border-gray-100 mb-5 flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                          <CreditCard size={16} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-900 uppercase">OFFICIAL BILLING CONFIGS</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Customize payment channels displayed on user screens</p>
                        </div>
                      </div>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await fetch("/api/admin/epins/payment-details", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                              easypaisa: { accountNumber: epNum, accountTitle: epTitle },
                              jazzcash: { accountNumber: jcNum, accountTitle: jcTitle },
                              bank: { bankName, accountNumber: bankNum, accountTitle: bankTitle }
                            })
                          });
                          if (!res.ok) throw new Error("Payment credentials override failed.");
                          alert("✓ Official payments credentials config saved successfully!");
                          fetchAdminPins();
                        } catch (err: any) {
                          alert("⚠️ Save configs error: " + err.message);
                        }
                      }} className="space-y-4 font-sans text-xs">
                        
                        {/* EasyPaisa section */}
                        <div className="border-b border-gray-100 pb-3 space-y-2">
                          <span className="text-[9px] font-mono text-[#0B7A33] uppercase font-extrabold">EasyPaisa Coordinates:</span>
                          <input
                            type="text"
                            placeholder="EasyPaisa Account Number"
                            value={epNum}
                            onChange={(e) => setEpNum(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                          />
                          <input
                            type="text"
                            placeholder="EasyPaisa Account Title"
                            value={epTitle}
                            onChange={(e) => setEpTitle(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                          />
                        </div>

                        {/* JazzCash section */}
                        <div className="border-b border-gray-100 pb-3 space-y-2">
                          <span className="text-[9px] font-mono text-[#0B7A33] uppercase font-extrabold">JazzCash Coordinates:</span>
                          <input
                            type="text"
                            placeholder="JazzCash Account Number"
                            value={jcNum}
                            onChange={(e) => setJcNum(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                          />
                          <input
                            type="text"
                            placeholder="JazzCash Account Title"
                            value={jcTitle}
                            onChange={(e) => setJcTitle(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                          />
                        </div>

                        {/* Meezan Bank section */}
                        <div className="space-y-2 pb-1">
                          <span className="text-[9px] font-mono text-[#0B7A33] uppercase font-extrabold">Standard Bank Coordinates:</span>
                          <input
                            type="text"
                            placeholder="Bank Name (e.g. Meezan Bank)"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Bank Account Number"
                            value={bankNum}
                            onChange={(e) => setBankNum(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Bank Account Title"
                            value={bankTitle}
                            onChange={(e) => setBankTitle(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold uppercase text-[10px] tracking-widest rounded-xl transition-all cursor-pointer"
                        >
                          Commit Official Credentials
                        </button>
                      </form>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB VIEW: 📦 YOURMART DROPSHIP HUB */}
            {activeTab === "products" && (
              <div className="space-y-6 animate-fadeIn text-left">
                
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-gray-400 tracking-wider font-extrabold block">YourMart Catalog Size</span>
                    <span className="text-2xl font-extrabold text-[#0B7A33] block mt-1 font-mono">
                      {ymCatalog.length} <span className="text-xs text-gray-400 font-sans font-normal">items available</span>
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-gray-250 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-amber-500 tracking-wider font-extrabold block">Synced to Network</span>
                    <span className="text-2xl font-extrabold text-amber-600 block mt-1 font-mono">
                      {ecomProducts.filter(p => p.supplier === "YourMart").length} <span className="text-xs text-gray-400 font-sans font-normal">SaaS products</span>
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
                    <span className="text-[9px] uppercase font-mono text-gray-400 tracking-wider font-extrabold block">Default Global Markup</span>
                    <span className="text-2xl font-extrabold text-gray-800 block mt-1 font-mono">
                      Rs. {globalMarkup} <span className="text-xs text-emerald-600 font-sans font-normal">PKR</span>
                    </span>
                  </div>
                </div>

                {/* Markup Rules Settings Configuration */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 bg-white p-6 rounded-[20px] border border-gray-200 shadow-sm space-y-5">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900 uppercase">Markup Engine Settings</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">Define commissions added to original YourMart whole-sale cost</p>
                    </div>

                    {markupStatusMsg && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-[#0B7A33] font-mono font-bold">
                        {markupStatusMsg}
                      </div>
                    )}

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setMarkupStatusMsg("");
                      try {
                        const res = await fetch("/api/admin/yourmart/settings", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            globalMarkup: Number(globalMarkup),
                            categoryMarkups
                          })
                        });
                        if (res.ok) {
                          setMarkupStatusMsg("✓ Pricing offset formulas saved securely & synchronized!");
                          setTimeout(() => setMarkupStatusMsg(""), 4000);
                          fetchYourMartData();
                        } else {
                          const errData = await res.json();
                          throw new Error(errData.error || "Save faulty.");
                        }
                      } catch (err: any) {
                        alert("⚠️ Save error: " + err.message);
                      }
                    }} className="space-y-4 text-xs font-bold font-mono">
                      <div>
                        <label className="block text-[9px] text-gray-400 uppercase tracking-wider mb-1">Global Markup Margin (PKR)</label>
                        <input
                          type="number"
                          required
                          value={globalMarkup}
                          onChange={(e) => setGlobalMarkup(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold outline-none font-mono focus:border-[#0B7A33]"
                        />
                        <p className="text-[9px] text-gray-400 font-sans mt-1">Added to final selling price if category matches fail.</p>
                      </div>

                      {/* Category Overrides */}
                      <div className="space-y-2">
                        <span className="block text-[9px] text-gray-400 uppercase tracking-wider">Category-Specific Offsets</span>
                        <div className="max-h-52 overflow-y-auto space-y-2.5 p-1 border border-gray-100 rounded-xl pr-1.5">
                          {["Mobile Phones", "Smart Watches", "Storage Devices", "Power Banks & Chargers", "Lifestyle Products", "Accessories", "Smart Gadgets", "AirPods & Headsets", "Home & Kitchen Products"].map(cat => (
                            <div key={cat} className="flex justify-between items-center gap-2">
                              <span className="text-[10px] text-gray-500 truncate max-w-[130px] font-sans font-medium">{cat}</span>
                              <input
                                type="number"
                                required
                                value={categoryMarkups[cat] !== undefined ? categoryMarkups[cat] : 500}
                                onChange={(e) => {
                                  setCategoryMarkups({
                                    ...categoryMarkups,
                                    [cat]: Number(e.target.value)
                                  });
                                }}
                                className="w-20 px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-right text-[11px] font-bold outline-none focus:border-[#0B7A33]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center"
                      >
                        Update Markup Rules
                      </button>
                    </form>
                  </div>

                  {/* Main Grid table with items */}
                  <div className="lg:col-span-8 bg-white p-6 rounded-[20px] border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 uppercase">Dropshipping Catalog Stream</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Import directly from YourMart Pakistan wholesale pipeline</p>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Search YourMart catalog..."
                          value={ymSearch}
                          onChange={(e) => setYmSearch(e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium outline-none focus:border-[#0B7A33] w-full sm:w-48 text-[#0B7A33] font-bold"
                        />
                        <select
                          value={ymCategoryFilter}
                          onChange={(e) => setYmCategoryFilter(e.target.value)}
                          className="px-2 py-1.5 rounded-xl border border-gray-200 text-xs font-medium outline-none text-[#0B7A33] font-bold focus:border-[#0B7A33]"
                        >
                          <option value="all">All Categories</option>
                          <option value="Mobile Phones">Mobile Phones</option>
                          <option value="Smart Watches">Smart Watches</option>
                          <option value="Storage Devices">Storage Devices</option>
                          <option value="Power Banks & Chargers">Power & Chargers</option>
                          <option value="Lifestyle Products">Lifestyle Products</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Smart Gadgets">Smart Gadgets</option>
                          <option value="AirPods & Headsets">AirPods & Headsets</option>
                          <option value="Home & Kitchen Products">Home & Kitchen</option>
                        </select>
                      </div>
                    </div>

                    {syncStatusMsg && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-[#0B7A33] font-semibold flex items-center gap-2">
                        <span>{syncStatusMsg}</span>
                      </div>
                    )}

                    {/* Bulk Action Controls */}
                    {selectedYmIds.length > 0 && (
                      <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-orange-950 font-mono">
                          {selectedYmIds.length} items marked
                        </span>

                        <div className="flex items-center gap-2">
                          <select
                            value={bulkAction}
                            onChange={(e) => setBulkAction(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg py-1 px-2 text-xs font-medium text-amber-800 focus:outline-none"
                          >
                            <option value="sync_stock">Re-sync Stock Status</option>
                            <option value="delete">Remove Sync From Store</option>
                            <option value="hide">Temporarily Hide Items</option>
                            <option value="show">Publish / Show Selected</option>
                            <option value="update_markup">Override Offset Markup</option>
                          </select>

                          {bulkAction === "update_markup" && (
                            <input
                              type="number"
                              placeholder="PKR Markup"
                              value={bulkExtraValue}
                              onChange={(e) => setBulkExtraValue(e.target.value)}
                              className="w-20 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0B7A33]"
                            />
                          )}

                          <button
                            onClick={async () => {
                              try {
                                if (bulkAction === "delete" && !confirm("Remove synchronized records from Ecom Network?")) return;
                                
                                const res = await fetch("/api/admin/yourmart/bulk-action", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                  },
                                  body: JSON.stringify({
                                    action: bulkAction,
                                    productIds: selectedYmIds,
                                    extraValue: bulkExtraValue
                                  })
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  setSyncStatusMsg(`Successfully processed bulk action on ${data.count} items!`);
                                  setSelectedYmIds([]);
                                  fetchYourMartData();
                                  setTimeout(() => setSyncStatusMsg(""), 3000);
                                }
                              } catch (err: any) {
                                alert("⚠️ Bulk task failure: " + err.message);
                              }
                            }}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold rounded-lg uppercase tracking-wider text-[10px] cursor-pointer"
                          >
                            Execute Action
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Catalog Grid */}
                    <div className="overflow-x-auto max-h-[500px]">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                            <th className="p-3 w-8">
                              <input
                                type="checkbox"
                                checked={ymCatalog.length > 0 && selectedYmIds.length === ymCatalog.length}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedYmIds(ymCatalog.map(x => x.id));
                                  } else {
                                    setSelectedYmIds([]);
                                  }
                                }}
                                className="rounded text-amber-500 cursor-pointer animate-fadeIn"
                              />
                            </th>
                            <th className="p-3">Product Name</th>
                            <th className="p-3">Supplier Cost</th>
                            <th className="p-3">Projected Selling Price</th>
                            <th className="p-3">Ecom Net Active</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {ymCatalog
                            .filter(item => {
                              const matchesSearch = item.name.toLowerCase().includes(ymSearch.toLowerCase()) || item.category.toLowerCase().includes(ymSearch.toLowerCase());
                              const matchesCat = ymCategoryFilter === "all" || item.category === ymCategoryFilter;
                              return matchesSearch && matchesCat;
                            })
                            .map(item => {
                              const syncedItem = ecomProducts.find(p => p.id === item.id);
                              
                              let itemMarkup = globalMarkup;
                              if (categoryMarkups && categoryMarkups[item.category] !== undefined) {
                                itemMarkup = Number(categoryMarkups[item.category]);
                              }
                              
                              const projectedPrice = item.supplier_price + itemMarkup;
                              const isChecked = selectedYmIds.includes(item.id);

                              return (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="p-3">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {
                                        if (isChecked) {
                                          setSelectedYmIds(selectedYmIds.filter(id => id !== item.id));
                                        } else {
                                          setSelectedYmIds([...selectedYmIds, item.id]);
                                        }
                                      }}
                                      className="rounded text-amber-500 cursor-pointer"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-3">
                                      {item.images && item.images[0] && (
                                        <img
                                          src={item.images[0]}
                                          alt={item.name}
                                          referrerPolicy="no-referrer"
                                          className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                                        />
                                      )}
                                      <div>
                                        <h5 className="font-extrabold text-xs text-gray-950 truncate max-w-[200px]">{item.name}</h5>
                                        <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest">{item.category}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3 font-mono font-bold text-gray-500 text-xs">
                                    Rs. {item.supplier_price.toLocaleString()}
                                  </td>
                                  <td className="p-3 font-mono font-black text-gray-800 text-xs">
                                    Rs. {projectedPrice.toLocaleString()}
                                    <span className="text-[8px] text-emerald-600 block font-sans font-medium">(+{itemMarkup} Markup)</span>
                                  </td>
                                  <td className="p-3">
                                    {syncedItem ? (
                                      <div className="space-y-1">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold tracking-widest ${
                                          syncedItem.status === "Hidden" 
                                            ? "bg-gray-100 text-gray-500 border border-gray-200"
                                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        }`}>
                                          {syncedItem.status === "Hidden" ? "Hidden" : "Active"}
                                        </span>
                                        <span className="block text-[10px] font-mono text-gray-800 font-extrabold">
                                          Store Price: Rs. {syncedItem.price.toLocaleString()}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold tracking-widest bg-gray-50 text-gray-400">
                                        Not Synced
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {syncedItem && (
                                        <button
                                          onClick={() => {
                                            setEditingPriceId(item.id);
                                            setEditingPriceValue(String(syncedItem.price));
                                          }}
                                          title="Manual Price Override"
                                          className="p-1.5 rounded-lg bg-gray-50 hover:bg-amber-100 text-gray-600 hover:text-amber-700 transition cursor-pointer"
                                        >
                                          <DynamicIcon name="LineChart" size={12} />
                                        </button>
                                      )}

                                      <button
                                        onClick={async () => {
                                          setSyncingIds(prev => ({ ...prev, [item.id]: true }));
                                          try {
                                            const res = await fetch("/api/admin/yourmart/sync", {
                                              method: "POST",
                                              headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}`
                                              },
                                              body: JSON.stringify({ productIds: [item.id] })
                                            });
                                            if (res.ok) {
                                              setSyncStatusMsg(`Successfully synchronized "${item.name}"!`);
                                              fetchYourMartData();
                                              setTimeout(() => setSyncStatusMsg(""), 3000);
                                            }
                                          } catch (err) {
                                            console.error("Single sync error:", err);
                                          } finally {
                                            setSyncingIds(prev => ({ ...prev, [item.id]: false }));
                                          }
                                        }}
                                        disabled={syncingIds[item.id]}
                                        className={`px-2.5 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-extrabold cursor-pointer border hover:shadow-xs transition ${
                                          syncedItem 
                                            ? "bg-[#0B7A33] hover:bg-[#12A84A] text-white border-[#0B7A33]"
                                            : "bg-amber-500 hover:bg-amber-600 text-gray-950 border-amber-500"
                                        }`}
                                      >
                                        {syncingIds[item.id] ? "Syncing..." : syncedItem ? "Re-sync" : "Sync Store"}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                      <span className="text-[10px] text-gray-400 font-mono font-medium">Automatic hourly supplier stock feeds ACTIVE</span>
                      <button
                        onClick={async () => {
                          if (!confirm("Are you sure you want to perform bulk import of ALL YourMart catalog products? This will apply your default markup formulas automatically.")) return;
                          setSyncStatusMsg("Importing entire YourMart catalog...");
                          try {
                            const res = await fetch("/api/admin/yourmart/sync", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                              },
                              body: JSON.stringify({ productIds: "all" })
                            });
                            if (res.ok) {
                              const data = await res.json();
                              setSyncStatusMsg(`✓ Imported & synchronized all ${data.count} wholesale products!`);
                              fetchYourMartData();
                              setTimeout(() => setSyncStatusMsg(""), 4000);
                            }
                          } catch (err: any) {
                            alert("Bulk import error: " + err.message);
                          }
                        }}
                        className="py-1.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs uppercase font-extrabold tracking-wider transition hover:shadow-sm cursor-pointer"
                      >
                        Bulk Sync All Products (15)
                      </button>
                    </div>

                  </div>
                </div>

                {/* Pricing Override Panel popup modal */}
                {editingPriceId && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
                    <div className="w-full max-w-sm bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xl">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 animate-fadeIn">
                        <span className="text-xs uppercase font-mono font-black text-gray-900">Configure Price Override</span>
                        <button onClick={() => setEditingPriceId(null)} className="p-1 rounded-full hover:bg-gray-100 transition text-gray-400 cursor-pointer">
                          <X size={16} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="text-xs font-semibold text-gray-500">
                          Product ID: <span className="font-mono text-[11px] text-gray-800">{editingPriceId}</span>
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-extrabold mb-1 font-mono">Custom Selling Price (PKR)</label>
                          <input
                            type="number"
                            required
                            value={editingPriceValue}
                            onChange={(e) => setEditingPriceValue(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border text-xs font-bold font-mono outline-none focus:border-[#0B7A33]"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold tracking-wider uppercase transition font-mono cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch("/api/admin/yourmart/override-price", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`
                                  },
                                  body: JSON.stringify({
                                    productId: editingPriceId,
                                    sellingPrice: Number(editingPriceValue)
                                  })
                                });
                                if (res.ok) {
                                  setSyncStatusMsg("Successfully updated price override!");
                                  setEditingPriceId(null);
                                  fetchYourMartData();
                                  setTimeout(() => setSyncStatusMsg(""), 3000);
                                }
                              } catch (err: any) {
                                alert("Failed to save override: " + err.message);
                              }
                            }}
                            className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 text-xs font-bold tracking-wider uppercase transition font-mono cursor-pointer"
                          >
                            Save Override (PKR)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
