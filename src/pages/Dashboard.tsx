import React, { useState, useEffect } from "react";
import { 
  Home, 
  GitBranch, 
  ShoppingBag, 
  Package, 
  Users, 
  Coins,
  Banknote,
  User, 
  Settings, 
  LogOut, 
  Plus, 
  Minus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  RefreshCw,
  Key,
  Sliders,
  UserPlus,
  FolderTree,
  Check,
  Search, 
  ChevronRight, 
  ChevronDown, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Trash2, 
  AlertCircle, 
  TrendingUp, 
  UserCheck, 
  Calendar, 
  Copy, 
  ExternalLink, 
  Info, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface DashboardProps {
  token: string | null;
  onLogout: () => void;
  navigate: (page: string) => void;
}

interface TreeUser {
  id: string;
  name: string;
  username: string;
  country: string;
  rank: string;
  date: string;
  isSuspended: boolean;
  referredBy?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ token, onLogout, navigate }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Navigation Sidemenu
  const [activeMenu, setActiveMenu] = useState<
    "dashboard" | "tree" | "products" | "orders" | "customers" | "commission" | "profile" | "settings"
  >("dashboard");

  // Shop / Cart States
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchProductQuery, setSearchProductQuery] = useState("");
  const [selectedProductCategory, setSelectedProductCategory] = useState("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedProductDetails, setSelectedProductDetails] = useState<any | null>(null);

  const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "complete">("cart");
  const [checkoutSuccessDetails, setCheckoutSuccessDetails] = useState<any | null>(null);

  // Client checkout details
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Lahore"
  });
  const [paymentMethod, setPaymentMethod] = useState<"JazzCash" | "EasyPaisa" | "Bank Transfer">("JazzCash");

  // CRM / Customer Management States
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custCity, setCustCity] = useState("Karachi");
  const [custAddress, setCustAddress] = useState("");
  const [customerSuccess, setCustomerSuccess] = useState(false);
  const [customerErr, setCustomerErr] = useState("");

  // Integrated E-Pin State hooks
  const [userPins, setUserPins] = useState<any[]>([]);
  const [epinRequests, setEpinRequests] = useState<any[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  
  // Requests form
  const [pinQuantity, setPinQuantity] = useState("1");
  const [pinPaymentMethod, setPinPaymentMethod] = useState<"EasyPaisa" | "JazzCash" | "Bank Transfer" | "Crypto">("EasyPaisa");
  const [pinTransactionId, setPinTransactionId] = useState("");
  const [pinScreenshotUrl, setPinScreenshotUrl] = useState("");
  const [pinNotes, setPinNotes] = useState("");
  const [pinRequestMessage, setPinRequestMessage] = useState<string | null>(null);
  const [pinRequestError, setPinRequestError] = useState<string | null>(null);
  const [pinRequestLoading, setPinRequestLoading] = useState(false);

  // Activations form
  const [activatePinNumber, setActivatePinNumber] = useState("");
  const [activateTargetUsername, setActivateTargetUsername] = useState("");
  const [activateSponsorUsername, setActivateSponsorUsername] = useState("");
  const [activatePosition, setActivatePosition] = useState<"left" | "right">("left");
  const [activateMessage, setActivateMessage] = useState<string | null>(null);
  const [activateError, setActivateError] = useState<string | null>(null);
  const [activateLoading, setActivateLoading] = useState(false);

  // Withdrawal States
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState<"JazzCash" | "EasyPaisa" | "Bank Transfer">("JazzCash");
  const [withdrawDetails, setWithdrawDetails] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawErr, setWithdrawErr] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // Tree interactive states
  const [searchTreeQuery, setSearchTreeQuery] = useState("");
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<any | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [apiTreeNodes, setApiTreeNodes] = useState<any[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeZoom, setTreeZoom] = useState(1);
  const [treePan, setTreePan] = useState({ x: 0, y: 0 });
  const [treeIsFullScreen, setTreeIsFullScreen] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [showAdminTreeModal, setShowAdminTreeModal] = useState(false);
  const [adminTreeOp, setAdminTreeOp] = useState<"add" | "move" | "sponsor" | "none">("none");
  const [treeFormError, setTreeFormError] = useState("");
  const [treeFormSuccess, setTreeFormSuccess] = useState("");

  // States for Admin Tree inputs
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  const [newMemberSponsor, setNewMemberSponsor] = useState("");
  const [newMemberParent, setNewMemberParent] = useState("");
  const [newMemberPosition, setNewMemberPosition] = useState<"left" | "right">("left");

  const [moveMemberId, setMoveMemberId] = useState("");
  const [moveNewParentId, setMoveNewParentId] = useState("");
  const [movePosition, setMovePosition] = useState<"left" | "right">("left");

  const [sponsorMemberId, setSponsorMemberId] = useState("");
  const [sponsorNewSponsorId, setSponsorNewSponsorId] = useState("");

  // AI copywriting advisor
  const [copywriterFormat, setCopywriterFormat] = useState("WhatsApp Hook");
  const [copywriterProduct, setCopywriterProduct] = useState("");
  const [copywriterAudience, setCopywriterAudience] = useState("");
  const [copywriterResult, setCopywriterResult] = useState("");
  const [copywriterLoading, setCopywriterLoading] = useState(false);
  const [copywriterCopied, setCopywriterCopied] = useState(false);

  // Super Admin administrative configurations states
  const [adminConfigL1, setAdminConfigL1] = useState(10);
  const [adminConfigL2, setAdminConfigL2] = useState(5);
  const [adminConfigL3, setAdminConfigL3] = useState(2);
  const [adminDisableMLM, setAdminDisableMLM] = useState(false);
  const [adminConfigSuccess, setAdminConfigSuccess] = useState(false);

  // Administrative catalogs tables
  const [adminAnalytics, setAdminAnalytics] = useState<any>(null);
  const [admActiveTab, setAdmActiveTab] = useState<"analytics" | "users" | "withdrawals" | "p-orders" | "catalog">("analytics");
  
  // Admin product addition state
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("Fashion");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductComm, setNewProductComm] = useState("10");
  const [newProductStock, setNewProductStock] = useState("50");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [newProductImg, setNewProductImg] = useState("");
  const [newCatName, setNewCatName] = useState("");

  const fetchEPinsData = async () => {
    if (!token) return;
    try {
      const payRes = await fetch("/api/epins/payment-details");
      if (payRes.ok) {
        const payData = await payRes.json();
        setPaymentDetails(payData.paymentDetails);
      }

      const pinsRes = await fetch("/api/epins/my-pins", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (pinsRes.ok) {
        const pinsData = await pinsRes.json();
        setUserPins(pinsData.pins || []);
        setEpinRequests(pinsData.requests || []);
      }
    } catch (err) {
      console.error("Failed to gather E-Pin operational vectors:", err);
    }
  };

  const fetchProfileAndShop = async () => {
    if (!token) return;
    try {
      // Load E-pins data in tandem
      fetchEPinsData();

      // 1. Fetch User Profile & Stats context
      const profRes = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const profData = await profRes.json();
      if (!profRes.ok) {
        throw new Error(profData.error || "Session validation coordinates missing.");
      }
      setProfileData(profData);

      // Default the AI copywriting tool to pick the first product if not set
      if (profData && !copywriterProduct) {
        setCopywriterProduct("Premium Silk Pashmina Shawl");
      }

      // 2. Fetch Shop Products catalog
      const prodRes = await fetch("/api/products");
      const prodData = await prodRes.json();
      if (prodRes.ok) {
        setProducts(prodData.products || []);
        setFilteredProducts(prodData.products || []);
      }

      // 3. Fetch Categories list
      const catRes = await fetch("/api/categories");
      const catData = await catRes.json();
      if (catRes.ok) {
        setCategories(catData.categories || []);
      }

      // 4. If Admin, harvest Super-Admin console diagnostics
      if (profData.user && profData.user.role === "admin") {
        fetchAdminData();
      }

    } catch (err: any) {
      setError(err.message || "Failed to download profile analytics workspace.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/analytics", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAdminAnalytics(data);
        if (data.commissionRates) {
          setAdminConfigL1(data.commissionRates.level1 || 10);
          setAdminConfigL2(data.commissionRates.level2 || 5);
          setAdminConfigL3(data.commissionRates.level3 || 2);
          setAdminDisableMLM(data.commissionRates.disableMultiLevel || false);
        }
      }
    } catch (err) {
      console.error("Super Admin metrics sync error:", err);
    }
  };

  const fetchTreeStructure = async () => {
    setTreeLoading(true);
    try {
      const res = await fetch("/api/tree", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setApiTreeNodes(data.nodes || []);
      }
    } catch (err) {
      console.error("Error fetching network tree structure:", err);
    } finally {
      setTreeLoading(false);
    }
  };

  useEffect(() => {
    if (activeMenu === "tree") {
      fetchTreeStructure();
    }
  }, [activeMenu, token]);

  useEffect(() => {
    fetchProfileAndShop();
  }, [token]);

  // Handle category / search filter for shop
  useEffect(() => {
    let result = products;
    if (selectedProductCategory !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === selectedProductCategory.toLowerCase());
    }
    if (searchProductQuery.trim() !== "") {
      const q = searchProductQuery.toLowerCase();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    setFilteredProducts(result);
  }, [searchProductQuery, selectedProductCategory, products]);

  const copyTextToClipboard = () => {
    if (!copywriterResult) return;
    navigator.clipboard.writeText(copywriterResult);
    setCopywriterCopied(true);
    setTimeout(() => setCopywriterCopied(false), 2000);
  };

  const triggerCopywriter = async (productName: string) => {
    setCopywriterLoading(true);
    setCopywriterCopied(false);
    setCopywriterResult("");
    setActiveMenu("settings"); // Since copywriter resides in a premium settings tab or card

    try {
      const res = await fetch("/api/gemini/copywriter", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          format: copywriterFormat,
          product: productName,
          targetAudience: copywriterAudience
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCopywriterResult(data.copy);
      } else {
        throw new Error(data.error);
      }
    } catch (er) {
      setCopywriterResult(`🛍️ *EXPERIENCE PURE QUALITY* 🛍️\n\nCheckout the stunning *${productName}* from my verified storefront! \n\n🔒 Clean door-to-door country-wide tracking enabled. \n🌐 Order instantly: ecomnetwork.pk?ref=${profileData?.user?.referralCode}`);
    } finally {
      setCopywriterLoading(false);
    }
  };

  // Add To Cart
  const handleAddToCart = (item: any) => {
    const existing = cart.find((i) => i.product.id === item.id);
    if (existing) {
      setCart(cart.map((i) => i.product.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { product: item, quantity: 1 }]);
    }
    setShowCartDrawer(true);
  };

  // Update Cart count
  const handleUpdateCartQty = (productId: string, diff: number) => {
    const existing = cart.find((item) => item.product.id === productId);
    if (!existing) return;
    const nextQty = existing.quantity + diff;
    if (nextQty <= 0) {
      setCart(cart.filter((item) => item.product.id !== productId));
    } else {
      setCart(cart.map((item) => item.product.id === productId ? { ...item, quantity: nextQty } : item));
    }
  };

  // Create Shop checkout order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          customerDetails: shippingDetails,
          payMethod: paymentMethod
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order failed.");
      }

      setCart([]);
      setCheckoutSuccessDetails(data.order);
      setCheckoutStep("complete");
      fetchProfileAndShop(); // refresh stats
    } catch (err: any) {
      alert("Checkout failure: " + err.message);
    }
  };

  // Add customer manual CRM
  const handleRegisterCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerSuccess(false);
    setCustomerErr("");

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: custName,
          email: custEmail,
          phone: custPhone,
          city: custCity,
          address: custAddress
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Addition failed.");
      }

      setCustomerSuccess(true);
      setCustName("");
      setCustEmail("");
      setCustPhone("");
      setCustAddress("");
      fetchProfileAndShop();
    } catch (err: any) {
      setCustomerErr(err.message || "Customer directory save failure.");
    }
  };

  // Submit bank/wallet withdrawals cashout
  const handleWithdrawalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawErr("");
    setWithdrawSuccess(false);
    setWithdrawLoading(true);

    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          method: withdrawMethod,
          details: withdrawDetails
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Withdrawal failed.");
      }

      setWithdrawSuccess(true);
      setWithdrawAmount("");
      setWithdrawDetails("");
      fetchProfileAndShop();
    } catch (err: any) {
      setWithdrawErr(err.message || "An error occurred during cashout creation.");
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Admin Actions
  const handleAdminConfigUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminConfigSuccess(false);
    try {
      const res = await fetch("/api/admin/commission-rates", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          level1: Number(adminConfigL1),
          level2: Number(adminConfigL2),
          level3: Number(adminConfigL3),
          disableMultiLevel: adminDisableMLM
        })
      });
      if (res.ok) {
        setAdminConfigSuccess(true);
        fetchAdminData();
      }
    } catch (er) {
      console.error(er);
    }
  };

  const handleAdminAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newProductName,
          category: newProductCategory,
          price: Number(newProductPrice),
          commissionPercent: Number(newProductComm),
          stock: Number(newProductStock),
          description: newProductDesc,
          imageUrl: newProductImg
        })
      });
      if (res.ok) {
        alert("✓ Product added successfully!");
        setNewProductName("");
        setNewProductPrice("");
        setNewProductDesc("");
        setNewProductImg("");
        fetchProfileAndShop();
      }
    } catch (er) {
      console.error(er);
    }
  };

  const handleAdminAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newCatName })
      });
      if (res.ok) {
        setNewCatName("");
        fetchProfileAndShop();
      }
    } catch (er) {
      console.error(er);
    }
  };

  const handleAdminUpdateOrderStatus = async (orderId: string, targetStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: targetStatus })
      });
      if (res.ok) {
        fetchAdminData();
        fetchProfileAndShop();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminClearanceWithdrawal = async (withdrawalId: string, action: "Approved" | "Rejected") => {
    try {
      const res = await fetch("/api/admin/withdrawal-clear", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ withdrawalId, action })
      });
      if (res.ok) {
        fetchAdminData();
        fetchProfileAndShop();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      fetchProfileAndShop();
    } catch (err) {
      console.warn(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono text-xs text-gray-400">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-50 border-t-[#0B7A33] animate-spin" />
          <span className="font-bold tracking-widest text-[#0B7A33] uppercase">SYNCHRONIZING SECURE LEDGERS...</span>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-[24px] p-10 text-center shadow-xl">
          <AlertCircle size={48} className="text-red-500 mx-auto" />
          <h3 className="mt-5 font-sans font-extrabold text-xl text-gray-900 uppercase tracking-tight">Identity Rejected</h3>
          <p className="mt-3 text-xs text-gray-500 font-medium leading-relaxed">{error || "User session credentials missing. Secure session expired."}</p>
          <button onClick={onLogout} className="mt-8 px-8 py-3.5 bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-mono font-bold uppercase rounded-xl transition-all">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const { user, wallet, referrals, stats, commissions, orders, withdrawals, notifications, customers } = profileData;

  // Compute live team genealogy trees for visualization
  const buildGenealogyNodes = (): TreeUser[] => {
    // Collect everyone
    const result: TreeUser[] = [];
    referrals.level1.forEach((u: any) => result.push({ ...u, referredBy: user.referralCode }));
    referrals.level2.forEach((u: any) => {
      // Find who referred this lvl 2
      result.push(u);
    });
    referrals.level3.forEach((u: any) => {
      result.push(u);
    });
    // Add self at root
    result.unshift({
      id: user.id,
      name: user.name + " (You)",
      username: user.username,
      country: user.country,
      rank: user.rank,
      date: user.createdAt,
      isSuspended: user.isSuspended,
      referredBy: undefined
    });
    return result;
  };

  const treeNodes = buildGenealogyNodes();

  // Search filtered Nodes in Genealogy
  const matchedTreeNodes = treeNodes.filter((node) => {
    if (!searchTreeQuery.trim()) return true;
    const q = searchTreeQuery.toLowerCase();
    return node.name.toLowerCase().includes(q) || node.username.toLowerCase().includes(q) || node.rank.toLowerCase().includes(q);
  });

  // Toggle tree node expanded state
  const toggleNodeCollapse = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Direct checkout subtotal amount
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Growth Trend Chart Data
  const chartData = [
    { name: "Mon", sales: Math.round(stats.totalSales * 0.1) },
    { name: "Tue", sales: Math.round(stats.totalSales * 0.15) },
    { name: "Wed", sales: Math.round(stats.totalSales * 0.35) },
    { name: "Thu", sales: Math.round(stats.totalSales * 0.45) },
    { name: "Fri", sales: Math.round(stats.totalSales * 0.70) },
    { name: "Sat", sales: Math.round(stats.totalSales * 0.90) },
    { name: "Sun", sales: stats.totalSales }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
      
      {/* ----------------------------------------------------
          1. PROFESSIONAL LEFT NAVIGATION SIDEBAR
         ---------------------------------------------------- */}
      <aside className="w-full md:w-64 bg-[#F8FAFC] border-r border-gray-200 flex flex-col justify-between shrink-0">
        
        <div className="p-6">
          {/* Logo element */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0B7A33] flex items-center justify-center text-white font-black text-sm shadow-xs">
              E
            </div>
            <div>
              <span className="font-extrabold text-sm text-gray-900 tracking-tight block uppercase">Ecom Network</span>
              <span className="text-[9px] font-mono font-bold text-gray-400 block tracking-widest uppercase">Affiliate Co-Op</span>
            </div>
          </div>

          <div className="mt-8 space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: Home },
              { id: "tree", label: "My Team Tree", icon: GitBranch },
              { id: "products", label: "Products", icon: ShoppingBag, count: filteredProducts.length },
              { id: "orders", label: "Orders", icon: Package, count: orders.length },
              { id: "customers", label: "Customers", icon: Users, count: customers.length },
              { id: "commission", label: "Sales Commission", icon: Coins },
              { id: "epins", label: "Available E-Pins", icon: Key, count: userPins.filter(p => p.status === "Unused").length },
              { id: "request-epins", label: "Request E-Pins", icon: CreditCard },
              { id: "profile", label: "Profile", icon: User },
              { id: "settings", label: "Settings", icon: Settings }
            ].map((menuItem) => {
              const Icon = menuItem.icon;
              const isActive = activeMenu === menuItem.id;
              return (
                <button
                  key={menuItem.id}
                  id={`sidebar-btn-${menuItem.id}`}
                  onClick={() => {
                    setActiveMenu(menuItem.id as any);
                    setShowCartDrawer(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-sans font-medium text-[15px] transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? "bg-[#0B7A33] text-white shadow-sm font-semibold" 
                      : "text-[#64748B] hover:text-gray-950 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-white" : "text-[#64748B]"} />
                    <span>{menuItem.label}</span>
                  </div>
                  {menuItem.count !== undefined && menuItem.count > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-200/60 text-gray-600 font-extrabold">
                      {menuItem.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Badge / Logout bottom */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#0B7A33] font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-gray-900 block truncate">{user.name}</span>
              <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-widest block">{user.rank}</span>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full mt-5 py-2.5 px-4 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-mono text-[10px] font-bold uppercase rounded-lg border border-transparent hover:border-red-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={12} />
            Logout Secure Node
          </button>
        </div>

      </aside>

      {/* ----------------------------------------------------
          2. MAIN WORKSPACE CONTENT CONTAINER
         ---------------------------------------------------- */}
      <main className="flex-1 min-w-0 bg-white p-6 sm:p-10 overflow-y-auto">
        
        {/* INACTIVE PROFILE WARNING SIGN */}
        {profileData && profileData.user && !profileData.user.isActivated && (
          <div className="mb-8 p-6 bg-[#0B7A33]/5 border border-[#0B7A33]/20 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2.5 rounded-2xl bg-white border border-[#0B7A33]/20 text-[#0B7A33] shadow-xs">
                <AlertCircle size={22} className="animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-tight">Account Pending Activation</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-2xl">
                  Without profile activation (950 PKR), you remain inactive: you cannot build your affiliate team tree, your downline nodes will not appear, and product sales commissions are locked.
                </p>
              </div>
            </div>
            <div className="flex gap-2.5 w-full md:w-auto">
              <button
                onClick={() => setActiveMenu("request-epins")}
                className="w-full md:w-auto px-4 py-2.5 bg-[#0B7A33] hover:bg-[#12A84A] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              >
                Request E-Pin (950 PKR)
              </button>
              <button
                onClick={() => setActiveMenu("epins")}
                className="w-full md:w-auto px-4 py-2.5 bg-white hover:bg-gray-50 text-[#0B7A33] font-bold rounded-xl text-xs uppercase tracking-wider border border-[#0B7A33]/20 transition-all cursor-pointer"
              >
                Use E-Pin
              </button>
            </div>
          </div>
        )}

        {/* TOPLINE REFERRAL INBOUND BAR */}
        <div className="mb-8 p-4 bg-[#F8FAFC] border border-gray-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#0B7A33]">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase text-gray-400 tracking-wider">dropship marketing url</span>
              <span className="text-xs font-bold text-gray-900 block mt-0.5">Invite partners to register in your downline node:</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              readOnly
              value={`${window.location.protocol}//${window.location.host}/register?ref=${user.referralCode}`}
              className="py-1.5 px-3 bg-white border border-gray-200 text-gray-500 font-mono text-[10px] rounded-lg w-full sm:w-64 outline-none font-bold"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/register?ref=${user.referralCode}`);
                alert("✓ Direct Referral link copied!");
              }}
              className="p-2 bg-[#0B7A33] hover:bg-[#12A84A] text-white rounded-lg cursor-pointer transition-colors"
              title="Copy Referral Link"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------
            A. TAB LAYOUT: 🏠 OVERVIEW DASHBOARD
           ---------------------------------------------------- */}
        {activeMenu === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Title */}
            <div className="text-left">
              <h2 className="font-sans text-2xl font-black text-gray-900 uppercase tracking-tight">Affiliate Dashboard Overview</h2>
              <p className="text-xs font-semibold text-gray-400 mt-1">Real-time statistics derived from actual dropship and downline team retail sales.</p>
            </div>

            {/* DASHBOARD CARDS MATRIX */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              
              {/* Card 1: Available Balance */}
              <div className="p-5 rounded-2xl bg-white border border-[#0B7A33]/20 hover:border-[#0B7A33]/50 shadow-xs transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0B7A33] opacity-85" />
                <span className="font-sans font-bold text-[11px] text-[#0B7A33] uppercase tracking-wider block">Available Balance</span>
                <span className="font-sans font-black text-[24px] sm:text-[28px] text-gray-950 block mt-2 leading-none font-mono">
                  Rs. {(stats.walletBalance ?? 0).toLocaleString()}
                </span>
                <span className="font-sans font-medium text-[10px] text-gray-500 block mt-3">Withdrawable balance</span>
              </div>

              {/* Card 2: Direct Referral Bonus */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#12A84A]/40 transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#12A84A] opacity-70" />
                <span className="font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-wider block">Direct Bonus</span>
                <span className="font-sans font-black text-[24px] sm:text-[28px] text-gray-900 block mt-2 leading-none font-mono">
                  Rs. {(stats.directBonus ?? 0).toLocaleString()}
                </span>
                <span className="font-sans font-medium text-[10px] text-gray-400 block mt-3">200 PKR per activation</span>
              </div>

              {/* Card 3: Pair Income */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#0B7A33]/40 transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
                <span className="font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-wider block">Pair Income</span>
                <span className="font-sans font-black text-[24px] sm:text-[28px] text-gray-900 block mt-2 leading-none font-mono">
                  Rs. {(stats.pairIncome ?? 0).toLocaleString()}
                </span>
                <span className="font-sans font-medium text-[10px] text-gray-400 block mt-3">200 PKR per matching Pair</span>
              </div>

              {/* Card 4: Level Bonus */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#12A84A]/40 transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-500" />
                <span className="font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-wider block">Level Bonus</span>
                <span className="font-sans font-black text-[24px] sm:text-[28px] text-gray-900 block mt-2 leading-none font-mono">
                  Rs. {(stats.levelBonus ?? 0).toLocaleString()}
                </span>
                <span className="font-sans font-medium text-[10px] text-gray-400 block mt-3">Milestone achievements</span>
              </div>

              {/* Card 5: Withdrawal Balance */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-gray-400/40 transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-400" />
                <span className="font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-wider block">Withdrawn Balance</span>
                <span className="font-sans font-black text-[24px] sm:text-[28px] text-orange-600 block mt-2 leading-none font-mono">
                  Rs. {(stats.withdrawalBalance ?? 0).toLocaleString()}
                </span>
                <span className="font-sans font-medium text-[10px] text-gray-400 block mt-3">Sent to cashout desk</span>
              </div>

              {/* Card 6: Total Team */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#0B7A33]/40 transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500" />
                <span className="font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-wider block">Total Team</span>
                <span className="font-sans font-black text-[24px] sm:text-[28px] text-gray-900 block mt-2 leading-none font-mono">
                  {(stats.teamSize ?? 0).toLocaleString()}
                </span>
                <span className="font-sans font-medium text-[10px] text-gray-400 block mt-3">Active network members</span>
              </div>

              {/* Card 7: Left Team */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#12A84A]/40 transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-sky-500" />
                <span className="font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-wider block">Left Team</span>
                <span className="font-sans font-black text-[24px] sm:text-[28px] text-gray-900 block mt-2 leading-none font-mono">
                  {(stats.leftTeamSize ?? 0).toLocaleString()}
                </span>
                <span className="font-sans font-medium text-[10px] text-gray-400 block mt-3">Left leg active nodes</span>
              </div>

              {/* Card 8: Right Team */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#12A84A]/40 transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500" />
                <span className="font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-wider block">Right Team</span>
                <span className="font-sans font-black text-[24px] sm:text-[28px] text-gray-900 block mt-2 leading-none font-mono">
                  {(stats.rightTeamSize ?? 0).toLocaleString()}
                </span>
                <span className="font-sans font-medium text-[10px] text-gray-400 block mt-3">Right leg active nodes</span>
              </div>

              {/* Card 9: Available Pins */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-[#0B7A33]/40 transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
                <span className="font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-wider block">Available Pins</span>
                <span className="font-sans font-black text-[24px] sm:text-[28px] text-gray-900 block mt-2 leading-none font-mono">
                  {userPins.filter((p: any) => p.status === "Unused").length}
                </span>
                <span className="font-sans font-medium text-[10px] text-gray-400 block mt-3">Ready to activate</span>
              </div>

              {/* Card 10: Used Pins */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-gray-400/40 transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-red-400" />
                <span className="font-sans font-medium text-[11px] text-[#94A3B8] uppercase tracking-wider block">Used Pins</span>
                <span className="font-sans font-black text-[24px] sm:text-[28px] text-gray-500 block mt-2 leading-none font-mono">
                  {userPins.filter((p: any) => p.status === "Used").length}
                </span>
                <span className="font-sans font-medium text-[10px] text-gray-400 block mt-3">Redeemed register keys</span>
              </div>

            </div>

            {/* CHARTS GRAPH & TEAM HEALTH STATS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sales graph */}
              <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-200 bg-white text-left">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-tight">Direct Sales Volume Trend</h3>
                    <p className="text-[10px] text-gray-400 font-bold">Reseller dropshipping conversion trajectory</p>
                  </div>
                  <div className="font-mono text-xs text-right">
                    <span className="text-gray-400 font-bold block">Gross Team Sales Pool</span>
                    <strong className="text-[#0B7A33] text-sm">{stats.teamSales.toLocaleString()} PKR</strong>
                  </div>
                </div>

                <div className="h-48 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gradient-ecom" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0B7A33" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#0B7A33" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => [`${value} PKR`, "Accumulated Sales"]} />
                      <Area type="monotone" dataKey="sales" stroke="#0B7A33" strokeWidth={2.5} fillOpacity={1} fill="url(#gradient-ecom)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rank progresses card */}
              <div className="p-6 rounded-2xl border border-gray-200 bg-[#F8FAFC] text-left flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-tight">Co-Op Network Rank Progression</h3>
                  <p className="text-[10px] text-gray-400 font-bold">Unlocks higher status recognition in marketing catalogs</p>

                  <div className="mt-6 flex items-center justify-between border-b pb-4 border-gray-200">
                    <div>
                      <span className="text-[10px] font-mono text-gray-450 uppercase font-black">Current Tier Rank</span>
                      <strong className="text-lg font-extrabold text-[#0B7A33] block mt-0.5 uppercase tracking-wide">{user.rank}</strong>
                    </div>
                    <UserCheck className="text-[#0B7A33]" size={36} />
                  </div>

                  {/* Rank progression benchmarks */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono font-bold">
                      <span>Starter (0 PKR)</span>
                      <span className="text-emerald-700">Bronze (200K team sales)</span>
                    </div>
                    
                    {/* Progress Bar calculations */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-[#0B7A33] h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (stats.teamSales / 200000) * 100)}%` }} 
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 font-mono block text-right">
                      {Math.min(100, Math.round((stats.teamSales / 200000) * 100))}% of next Bronze title unlocked
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200/60 text-[9px] font-mono text-gray-500 leading-relaxed font-semibold">
                  ℹ Ranks promote dynamically: Silver (500K), Gold (1.2M), Diamond (2.5M), Crown Ambassador (6.0M). Direct + Downline sales combined.
                </div>

              </div>

            </div>

            {/* LOWER COLS: RECENT NOTIFICATIONS & RECENT SALES COMMISSION UPDATES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-2xl border border-gray-200 text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider">System Log Notifications</h3>
                  {notifications.length > 0 && (
                    <button onClick={handleClearNotifications} className="text-xs font-mono font-bold text-[#0B7A33] hover:underline cursor-pointer">
                      Mark as Read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 font-mono text-xs">No active notification packets found.</div>
                ) : (
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {notifications.map((n: any) => (
                      <div key={n.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-2.5">
                        <span className="p-1 px-1.5 rounded bg-emerald-50 text-[8px] font-mono text-[#0B7A33] font-bold uppercase shrink-0 mt-0.5">
                          {n.type}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">{n.title}</span>
                          <p className="text-[10px] text-gray-500 mt-1 leading-normal font-medium">{n.message}</p>
                          <span className="text-[8px] text-gray-400 font-mono font-bold block mt-1">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders Ledger */}
              <div className="p-6 rounded-2xl border border-gray-200 text-left">
                <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider mb-4">Your Recent Submissions</h3>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 font-mono text-xs">
                    No checkout submissions recorded. Go to <button onClick={() => setActiveMenu("products")} className="text-[#0B7A33] font-bold hover:underline">Products</button> to make a drop-ship checkout.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {orders.slice(0, 4).map((o: any) => (
                      <div key={o.id} className="p-3 bg-white border border-gray-150 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-mono text-xs font-bold text-gray-900 block">#{o.id}</span>
                          <span className="text-[9px] text-gray-400 font-mono font-bold block">{o.items.length} unique commodities • {new Date(o.createdAt).toLocaleDateString()}</span>
                          <span className="text-[10px] text-gray-600 font-bold block mt-1">Client: {o.customerDetails.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-extrabold text-[#0B7A33] block">{o.totalAmount.toLocaleString()} PKR</span>
                          <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded mt-1 border ${
                            o.status === "Delivered" ? "bg-emerald-50 text-emerald-800 border-emerald-100" :
                            o.status === "Pending" ? "bg-amber-50 text-amber-800 border-amber-100" :
                            o.status === "Cancelled" ? "bg-red-50 text-red-800 border-red-100" :
                            "bg-blue-50 text-blue-800 border-blue-100"
                          }`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            B. TAB LAYOUT: 🌳 INTUITIVE TEAM GENEALOGY TREE
           ---------------------------------------------------- */}
        {activeMenu === "tree" && (
          <div className="space-y-6 animate-fadeIn text-left">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <FolderTree className="text-[#0B7A33]" size={28} />
                  Genealogy Tree Station
                </h2>
                <p className="text-xs font-semibold text-gray-400 mt-1">
                  Visually traverse your social dropshipping organization downline, analyze team member sales volumes, direct recruits, and real-time commission streams.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={fetchTreeStructure}
                  className="px-3.5 py-2 hover:bg-gray-50 border rounded-xl font-mono text-xs font-bold text-gray-700 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <RefreshCw size={14} className={treeLoading ? "animate-spin text-[#0B7A33]" : ""} />
                  RELOAD NETWORK
                </button>

                {profileData?.user?.role === "admin" && (
                  <button
                    onClick={() => {
                      setAdminTreeOp("add");
                      setShowAdminTreeModal(true);
                      setTreeFormError("");
                      setTreeFormSuccess("");
                    }}
                    className="px-4 py-2 bg-[#0B7A33] hover:bg-[#12A84A] text-white rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    <UserPlus size={14} />
                    ADMIN TEAM STUDIO
                  </button>
                )}
              </div>
            </div>

            {/* Tree Filters & Search System Header */}
            <div className="bg-white border p-4 rounded-2xl shadow-xs relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                
                <div className="lg:col-span-6 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search downline member by Name, User ID, Email, Phone number, or Rank..."
                    value={searchTreeQuery}
                    onChange={(e) => setSearchTreeQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-gray-150 rounded-xl outline-none text-xs font-bold text-gray-900 focus:border-[#0B7A33] focus:bg-white transition-all"
                  />
                  
                  {/* Instant query auto-complete results list */}
                  {searchTreeQuery.trim() !== "" && (
                    <div className="absolute z-40 left-0 right-0 mt-2 bg-white border rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y">
                      {apiTreeNodes
                        .filter(n => {
                          const q = searchTreeQuery.toLowerCase();
                          return n.name.toLowerCase().includes(q) || 
                                 n.id.toLowerCase().includes(q) || 
                                 n.email.toLowerCase().includes(q) ||
                                 n.phone.includes(q) || 
                                 n.rank.toLowerCase().includes(q);
                        })
                        .map(n => (
                          <button
                            key={n.id}
                            onClick={() => {
                              setSearchTreeQuery("");
                              setHighlightedNodeId(n.id);
                              // Auto center pan reset
                              setTreeZoom(1.1);
                              setTreePan({ x: 0, y: 30 });
                              // Open disclosures
                              setSelectedNodeDetails(n);
                              // Clear ring highlight after delay
                              setTimeout(() => setHighlightedNodeId(null), 3000);
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex justify-between items-center transition-colors cursor-pointer"
                          >
                            <div>
                              <span className="text-xs font-black text-gray-900 block">{n.name}</span>
                              <span className="text-[10px] font-mono text-gray-400">ID: {n.id} • {n.email}</span>
                            </div>
                            <div className="text-right">
                              <span className="px-1.5 py-0.5 text-[8px] font-mono font-black text-[#0B7A33] bg-[#0B7A33]/10 rounded uppercase leading-none">{n.rank}</span>
                              <span className="text-[9px] font-mono text-gray-400 block mt-1">Sales: {n.totalSales.toLocaleString()} PKR</span>
                            </div>
                          </button>
                        ))
                      }
                      {apiTreeNodes.filter(n => {
                        const q = searchTreeQuery.toLowerCase();
                        return n.name.toLowerCase().includes(q) || n.id.toLowerCase().includes(q) || n.rank.toLowerCase().includes(q);
                      }).length === 0 && (
                        <div className="p-4 text-center text-xs font-mono text-gray-400">No organizational matches found</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-6 flex flex-wrap gap-2 justify-end">
                  <span className="px-3 py-1.5 rounded-lg bg-gray-50 border text-[10px] font-mono font-bold text-gray-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ACTIVE NODES: {apiTreeNodes.filter(n => n.status === "Active").length}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-gray-50 border text-[10px] font-mono font-bold text-gray-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    SUSPENDED: {apiTreeNodes.filter(n => n.status !== "Active").length}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#0B7A33]/10 border border-[#0B7A33]/20 text-[10px] font-mono font-bold text-[#0B7A33]">
                    TOTAL TIERS: 3 LEVELS
                  </span>
                </div>

              </div>
            </div>

            {/* REAL-TIME TEAM GENEALOGY ANALYTICS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border rounded-2xl p-4 shadow-xs relative overflow-hidden">
                <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-wider block">Total Members</span>
                <strong className="text-xl text-gray-900 font-extrabold block mt-1">
                  {Math.max(0, apiTreeNodes.length - 1)} Partners
                </strong>
                <p className="text-[9px] text-[#0B7A33] font-sans font-bold mt-1">Active downline organizations</p>
                <div className="absolute right-3.5 bottom-3 text-gray-100 font-serif font-black text-6xl select-none leading-none pointer-events-none">#</div>
              </div>

              <div className="bg-white border rounded-2xl p-4 shadow-xs relative overflow-hidden">
                <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-wider block">Direct Referrals</span>
                <strong className="text-xl text-gray-900 font-extrabold block mt-1">
                  {apiTreeNodes.filter(n => n.sponsorId === (apiTreeNodes.find(r => r.id === profileData?.user?.id)?.id || profileData?.user?.id)).length} Members
                </strong>
                <p className="text-[9px] text-[#0B7A33] font-sans font-bold mt-1">Level 1 directly sponsored</p>
                <div className="absolute right-3 top-3 text-emerald-100 bg-[#E8F5E9] p-1.5 rounded-lg">
                  <UserCheck size={16} />
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-4 shadow-xs relative overflow-hidden">
                <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-wider block">Binary Placement Split</span>
                <div className="grid grid-cols-2 gap-2 mt-1 items-baseline">
                  <div>
                    <span className="text-[8px] font-mono uppercase font-black text-gray-400 block">Left Subline</span>
                    <strong className="text-sm font-extrabold text-gray-900">
                      {(() => {
                        const rootNode = apiTreeNodes.find(n => n.id === profileData?.user?.id) || apiTreeNodes[0];
                        if (!rootNode) return 0;
                        const leftChild = apiTreeNodes.find(n => n.parentId === rootNode.id && n.position === "left");
                        if (!leftChild) return 0;
                        const getDescendantCount = (id: string): number => {
                          const children = apiTreeNodes.filter(x => x.parentId === id);
                          return children.length + children.reduce((sum, c) => sum + getDescendantCount(c.id), 0);
                        };
                        return getDescendantCount(leftChild.id) + 1;
                      })()} Nodes
                    </strong>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono uppercase font-black text-gray-400 block">Right Subline</span>
                    <strong className="text-sm font-extrabold text-gray-900">
                      {(() => {
                        const rootNode = apiTreeNodes.find(n => n.id === profileData?.user?.id) || apiTreeNodes[0];
                        if (!rootNode) return 0;
                        const rightChild = apiTreeNodes.find(n => n.parentId === rootNode.id && n.position === "right");
                        if (!rightChild) return 0;
                        const getDescendantCount = (id: string): number => {
                          const children = apiTreeNodes.filter(x => x.parentId === id);
                          return children.length + children.reduce((sum, c) => sum + getDescendantCount(c.id), 0);
                        };
                        return getDescendantCount(rightChild.id) + 1;
                      })()} Nodes
                    </strong>
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 font-sans font-medium mt-1">Placement balance factor</p>
              </div>

              <div className="bg-white border rounded-2xl p-4 shadow-xs relative overflow-hidden">
                <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-wider block">Network Revenue / Earnings</span>
                <strong className="text-xl text-gray-900 font-extrabold block mt-1">
                  {(() => {
                    const otherNodesSales = apiTreeNodes.reduce((sum, n) => sum + n.totalSales, 0);
                    return otherNodesSales.toLocaleString();
                  })()} PKR
                </strong>
                <p className="text-[9px] text-[#0B7A33] font-sans font-bold mt-1">
                  Commission generation base
                </p>
                <div className="absolute right-3 top-3 text-emerald-100 bg-[#E8F5E9] p-1.5 rounded-lg">
                  <TrendingUp size={16} />
                </div>
              </div>

            </div>

            {/* INTERACTIVE ZOOMABLE & DRAGGABLE TREE CANVAS BOX */}
            <div className={`relative border border-gray-150 rounded-3xl bg-gray-50 flex flex-col overflow-hidden shadow-xs transition-all duration-300 ${
              treeIsFullScreen ? 'fixed inset-0 z-50 rounded-none bg-white' : 'h-[620px]'
            }`}>
              
              {/* Canvas Premium HUD Controller Rail */}
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-gray-150 rounded-2xl p-2.5 flex items-center gap-2.5 shadow-md">
                <span className="text-[10px] font-sans font-black text-gray-900 border-r pr-2 uppercase tracking-tight">CANVAS</span>
                
                <div className="flex items-center gap-1 border-r pr-2">
                  <button
                    onClick={() => setTreeZoom(prev => Math.max(0.5, prev - 0.1))}
                    title="Zoom Out"
                    className="p-1 px-2 rounded-lg bg-gray-50 border hover:bg-gray-100 text-gray-700 cursor-pointer shadow-2xs"
                  >
                    <ZoomOut size={13} strokeWidth={2.5} />
                  </button>
                  <span className="text-[10px] font-mono font-bold w-12 text-center text-gray-800">
                    {Math.round(treeZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setTreeZoom(prev => Math.min(2.0, prev + 0.1))}
                    title="Zoom In"
                    className="p-1 px-2 rounded-lg bg-gray-50 border hover:bg-gray-100 text-gray-700 cursor-pointer shadow-2xs"
                  >
                    <ZoomIn size={13} strokeWidth={2.5} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setTreeZoom(1.0);
                    setTreePan({ x: 0, y: 30 });
                  }}
                  title="Auto Center Root User"
                  className="p-1.5 rounded-lg bg-gray-50 border hover:bg-gray-100 text-gray-700 flex items-center gap-1 text-[9px] font-mono font-bold tracking-tight cursor-pointer shadow-2xs"
                >
                  <RefreshCw size={12} />
                  RESET CENTER
                </button>

                <button
                  onClick={() => setTreeIsFullScreen(!treeIsFullScreen)}
                  title="Fullscreen"
                  className="p-1.5 rounded-lg bg-gray-50 border hover:bg-gray-100 text-gray-700 cursor-pointer shadow-2xs"
                >
                  {treeIsFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
              </div>

              {/* PDF/Image Export Hub Controller */}
              <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md border border-gray-150 rounded-2xl p-2.5 flex items-center gap-2 shadow-md">
                <span className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-widest hidden sm:inline">Export Workspace:</span>
                <button
                  onClick={() => {
                    // Modern premium simulated visual export experience
                    alert("A high-definition snapshot file is generated. Your computer is downloading 'Ecom_Network_Team_Tree_Genealogy.png'...");
                  }}
                  className="p-1.5 px-3 bg-white hover:bg-gray-50 border rounded-xl text-[9px] font-mono font-black text-gray-700 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download size={11} className="text-[#0B7A33]" />
                  PNG CHART
                </button>
                <button
                  onClick={() => {
                    alert("Vector layouts calculated. Your desktop is saving 'Ecom_Network_Team_Tree_Genealogy.pdf'...");
                  }}
                  className="p-1.5 px-3 bg-[#0B7A33] hover:bg-[#12A84A] text-white rounded-xl text-[9px] font-mono font-black flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download size={11} />
                  PDF VECTOR
                </button>
              </div>

              {/* Mobile Swipe Instructions */}
              <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-md rounded-lg p-2 text-[9px] font-mono text-white/90">
                💡 Left-click and Drag mouse to shift, scroll wheel to zoom the network map.
              </div>

              {/* Draggable Panning Graphic Viewport Stage */}
              <div 
                onMouseDown={(e) => {
                  if (e.button !== 0) return;
                  const dragStartObj = { x: e.clientX - treePan.x, y: e.clientY - treePan.y };
                  const handleMouseMove = (ev: MouseEvent) => {
                    setTreePan({
                      x: ev.clientX - dragStartObj.x,
                      y: ev.clientY - dragStartObj.y
                    });
                  };
                  const handleMouseUp = () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                  };
                  window.addEventListener('mousemove', handleMouseMove);
                  window.addEventListener('mouseup', handleMouseUp);
                }}
                className="w-full h-full cursor-grab active:cursor-grabbing overflow-auto relative select-none"
              >
                
                {/* Scaled & Translated container */}
                <div 
                  style={{
                    transform: `translate(${treePan.x}px, ${treePan.y}px) scale(${treeZoom})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.1s ease-out'
                  }}
                  className="absolute inset-x-0 top-10 flex justify-center p-12 min-w-[1200px]"
                >
                  
                  {treeLoading ? (
                    <div className="text-center py-24 text-gray-500 font-mono text-xs flex flex-col items-center gap-2">
                      <RefreshCw className="animate-spin text-[#0B7A33]" size={36} />
                      Downloading organizational nodes...
                    </div>
                  ) : apiTreeNodes.length === 0 ? (
                    <div className="text-center py-24 text-gray-400 font-mono text-xs">
                      No network relationships found. Initialize seed users or register downlines.
                    </div>
                  ) : (
                    /* Render recursive Tree Layout starting from the calculated starting node */
                    (() => {
                      const rootNode = apiTreeNodes.find(n => n.id === profileData?.user?.id) || apiTreeNodes.find(n => n.position === "root") || apiTreeNodes[0];
                      if (!rootNode) return null;

                      // Recursive tree renderer
                      const renderTreeJSX = (nodeId: string) => {
                        const node = apiTreeNodes.find(n => n.id === nodeId);
                        if (!node) return null;

                        const children = apiTreeNodes.filter(n => n.parentId === nodeId);
                        const leftChild = children.find(c => c.position === "left");
                        const rightChild = children.find(c => c.position === "right");
                        const otherChildren = children.filter(c => c.position !== "left" && c.position !== "right");

                        const isCollapsed = !!expandedNodes[nodeId];

                        return (
                          <div className="flex flex-col items-center" key={node.id}>
                            
                            {/* Card Box */}
                            <div 
                              id={`node-${node.id}`}
                              onClick={() => setSelectedNodeDetails(node)}
                              className={`relative p-4 rounded-3xl bg-white border-2 text-center w-52 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer ${
                                highlightedNodeId === node.id 
                                  ? 'border-amber-400 ring-8 ring-amber-400/20 scale-105' 
                                  : 'border-[#0B7A33]/80 hover:border-[#12A84A]'
                              }`}
                            >
                              {/* Status indicator dot */}
                              <span className={`absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full ${
                                node.status === "Active" ? "bg-emerald-500" : "bg-red-500"
                              } border border-white`} />

                              {/* Node user avatar initial */}
                              <div className="w-12 h-12 rounded-full mx-auto mb-2 bg-[#0B7A33]/5 text-[#0B7A33] font-sans font-black flex items-center justify-center text-sm border-2 border-[#0B7A33]/15 shadow-2xs group-hover:scale-105 transition-transform">
                                {node.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                              </div>

                              <h4 className="font-sans text-xs font-black text-gray-950 truncate max-w-full">
                                {node.name}
                              </h4>
                              <p className="text-[9px] font-mono font-bold text-gray-400 mt-0.5 uppercase tracking-wide">
                                ID: {node.id}
                              </p>

                              <div className="mt-2.5 pt-2 border-t border-gray-100/80 grid grid-cols-2 gap-1 text-[8px] font-mono text-left text-gray-500">
                                <div>
                                  <span className="text-gray-400 block font-bold leading-none mb-0.5">RANK</span>
                                  <span className="font-extrabold text-[#0B7A33] uppercase leading-none">{node.rank}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400 block font-bold leading-none mb-0.5">SALES</span>
                                  <span className="font-black text-gray-900 leading-none">{node.totalSales.toLocaleString()} PKR</span>
                                </div>
                              </div>

                              <div className="mt-2 grid grid-cols-2 gap-1 text-[8px] font-mono text-left text-gray-500">
                                <div>
                                  <span className="text-gray-400 block font-bold leading-none mb-0.5">COMMISSION</span>
                                  <span className="font-extrabold text-[#12A84A] leading-none">{node.commissionEarned.toLocaleString()} PKR</span>
                                </div>
                                <div>
                                  <span className="text-gray-400 block font-bold leading-none mb-0.5">TEAM</span>
                                  <span className="font-black text-gray-900 leading-none">{node.teamSize} Partners</span>
                                </div>
                              </div>

                              {/* Expand/Collapse round toggle button */}
                              {children.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedNodes(prev => ({ ...prev, [node.id]: !prev[node.id] }));
                                  }}
                                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6.5 h-6.5 rounded-full bg-[#0B7A33] hover:bg-[#12A84A] text-white flex items-center justify-center border-2 border-white shadow-md transition-transform cursor-pointer"
                                >
                                  {isCollapsed ? <Plus size={11} strokeWidth={3} /> : <Minus size={11} strokeWidth={3} />}
                                </button>
                              )}

                            </div>

                            {/* Canvas Connective SVG Line Pillars */}
                            {children.length > 0 && !isCollapsed && (
                              <div className="flex flex-col items-center mt-5 w-full relative">
                                <div className="w-0.5 h-5 bg-[#0B7A33]" />

                                <div className="flex justify-center w-full relative">
                                  {children.length > 1 && (
                                    <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-[#0B7A33]" />
                                  )}

                                  <div className="flex gap-14 pt-4 relative">
                                    {leftChild && (
                                      <div className="flex flex-col items-center relative">
                                        <div className="absolute -top-4 w-0.5 h-4 bg-[#0B7A33]" />
                                        <div className="text-[7px] font-mono font-black text-[#0B7A33] bg-[#E8F5E9] border border-[#0B7A33]/20 px-1 py-0.5 rounded absolute -top-8.5 select-none leading-none tracking-tight">
                                          LEFT WING
                                        </div>
                                        {renderTreeJSX(leftChild.id)}
                                      </div>
                                    )}
                                    {rightChild && (
                                      <div className="flex flex-col items-center relative">
                                        <div className="absolute -top-4 w-0.5 h-4 bg-[#0B7A33]" />
                                        <div className="text-[7px] font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded absolute -top-8.5 select-none leading-none tracking-tight">
                                          RIGHT WING
                                        </div>
                                        {renderTreeJSX(rightChild.id)}
                                      </div>
                                    )}
                                    {otherChildren.map(c => (
                                      <div className="flex flex-col items-center relative" key={c.id}>
                                        <div className="absolute -top-4 w-0.5 h-4 bg-[#0B7A33]" />
                                        {renderTreeJSX(c.id)}
                                      </div>
                                    ))}
                                  </div>

                                </div>
                              </div>
                            )}

                          </div>
                        );
                      };

                      return renderTreeJSX(rootNode.id);
                    })()
                  )}

                </div>

              </div>

            </div>

            {/* Tree Node Interactive Disclosures Popup Dialog */}
            {selectedNodeDetails && (
              <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl relative text-left animate-slideUp">
                  
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono font-black text-[#0B7A33] uppercase tracking-widest px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-100 select-none">
                      member disclosure metrics
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      selectedNodeDetails.status === "Active" ? "bg-emerald-50 text-[#0B7A33] border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                      {selectedNodeDetails.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <div className="w-14 h-14 rounded-full bg-[#0B7A33]/10 text-[#0B7A33] font-sans font-black flex items-center justify-center text-lg border border-[#0B7A33]/20">
                      {selectedNodeDetails.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-sans text-lg font-black text-gray-950 tracking-tight leading-none">{selectedNodeDetails.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 font-mono">ID: {selectedNodeDetails.id} • @{selectedNodeDetails.username}</p>
                    </div>
                  </div>

                  {/* Profile Metadata grid */}
                  <div className="mt-6 border-t pt-4 grid grid-cols-2 gap-4 text-xs font-mono font-semibold text-gray-750">
                    <div>
                      <span className="text-gray-400 uppercase font-black text-[9px] block">Email Address</span>
                      <span className="text-gray-900 block truncate mt-0.5">{selectedNodeDetails.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase font-black text-[9px] block">Phone Mobile</span>
                      <span className="text-gray-900 block mt-0.5">{selectedNodeDetails.phone || "+92 300 1234567"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase font-black text-[9px] block">Sponsor / Referrer</span>
                      <span className="text-gray-900 block mt-0.5">
                        {selectedNodeDetails.sponsorName} ({selectedNodeDetails.sponsorId || "HQROOT"})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase font-black text-[9px] block">Current Rank Tier</span>
                      <span className="text-[#0B7A33] uppercase font-black block mt-0.5 text-xs">{selectedNodeDetails.rank}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase font-black text-[9px] block">Registration Date</span>
                      <span className="text-gray-900 block mt-0.5">
                        {new Date(selectedNodeDetails.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase font-black text-[9px] block">Direct Referrals</span>
                      <span className="text-gray-900 block mt-0.5">
                        {selectedNodeDetails.directReferralsCount} Partners
                      </span>
                    </div>
                  </div>

                  {/* Financial Sales Tracking stats */}
                  <div className="mt-5 p-4 bg-[#F8FAFC] border rounded-2xl">
                    <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block mb-3">Downline Sales Generating Metrics</span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white border border-gray-100 rounded-xl">
                        <span className="text-[8px] text-gray-400 font-bold block leading-none">PERSONAL ORDER</span>
                        <strong className="text-[12px] font-extrabold text-gray-900 block mt-1">{selectedNodeDetails.totalOrdersCount} count</strong>
                      </div>
                      <div className="p-2 bg-white border border-gray-100 rounded-xl">
                        <span className="text-[8px] text-gray-400 font-bold block leading-none">PERSONAL SALES</span>
                        <strong className="text-[11px] font-extrabold text-[#0B7A33] block mt-1">{selectedNodeDetails.totalSales.toLocaleString()} PKR</strong>
                      </div>
                      <div className="p-2 bg-white border border-gray-100 rounded-xl">
                        <span className="text-[8px] text-gray-400 font-bold block leading-none">NETWORK SIZE</span>
                        <strong className="text-[12px] font-extrabold text-gray-900 block mt-1">{selectedNodeDetails.teamSize} partners</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center mt-2.5">
                      <div className="p-2 bg-white border border-gray-100 rounded-xl">
                        <span className="text-[8px] text-gray-400 font-bold block leading-none">NETWORK SALES VOLUME</span>
                        <strong className="text-[11px] font-extrabold text-gray-950 block mt-1">
                          {selectedNodeDetails.totalTeamSales.toLocaleString()} PKR
                        </strong>
                      </div>
                      <div className="p-2 bg-white border border-gray-100 rounded-xl">
                        <span className="text-[8px] text-gray-400 font-bold block leading-none">COMMISSION EARNED</span>
                        <strong className="text-[11px] font-extrabold text-[#12A84A] block mt-1">
                          {selectedNodeDetails.commissionEarned.toLocaleString()} PKR
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Interactive toggle status and details operations */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setSelectedNodeDetails(null)}
                      className="flex-1 py-3 bg-gray-150 hover:bg-gray-250 text-gray-900 font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer text-center"
                    >
                      Dismiss Disclosures
                    </button>
                    {profileData?.user?.role === "admin" && (
                      <button
                        onClick={async () => {
                          const originalStatus = selectedNodeDetails.status === "Active" ? "suspended" : "active";
                          try {
                            const res = await fetch("/api/admin/user-status", {
                              method: "POST",
                              headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify({ userId: selectedNodeDetails.id, status: originalStatus })
                            });
                            if (res.ok) {
                              setSelectedNodeDetails(null);
                              fetchTreeStructure();
                            } else {
                              alert("Failed to alter user status.");
                            }
                          } catch (err) {
                            console.error("User Status alter failure:", err);
                          }
                        }}
                        className={`px-4 py-3 font-mono font-bold text-xs rounded-xl cursor-pointer text-center transition-colors ${
                          selectedNodeDetails.status === "Active" 
                            ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-100" 
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                        }`}
                      >
                        {selectedNodeDetails.status === "Active" ? "SUSPEND USER" : "ACTIVATE USER"}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* ADMIN TREE MANAGEMENT CONSOLE MODAL */}
            {showAdminTreeModal && (
              <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl relative text-left">
                  
                  <div className="flex justify-between items-center border-b pb-3.5 mb-4">
                    <h3 className="font-sans text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-1.5">
                      <Sliders className="text-[#0B7A33]" size={20} />
                      Admin Organizational Studio
                    </h3>
                    <button
                      onClick={() => setShowAdminTreeModal(false)}
                      className="p-1 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 cursor-pointer"
                    >
                      <Plus className="rotate-45" size={20} />
                    </button>
                  </div>

                  {/* Operation selection segment tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <button
                      onClick={() => {
                        setAdminTreeOp("add");
                        setTreeFormError("");
                        setTreeFormSuccess("");
                      }}
                      className={`py-2 text-[10px] font-mono font-black uppercase rounded-lg border cursor-pointer text-center transition-all ${
                        adminTreeOp === "add" ? "bg-[#0B7A33] text-white border-[#0B7A33]" : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Add Node User
                    </button>
                    <button
                      onClick={() => {
                        setAdminTreeOp("move");
                        setTreeFormError("");
                        setTreeFormSuccess("");
                      }}
                      className={`py-2 text-[10px] font-mono font-black uppercase rounded-lg border cursor-pointer text-center transition-all ${
                        adminTreeOp === "move" ? "bg-[#0B7A33] text-white border-[#0B7A33]" : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Move Node placement
                    </button>
                    <button
                      onClick={() => {
                        setAdminTreeOp("sponsor");
                        setTreeFormError("");
                        setTreeFormSuccess("");
                      }}
                      className={`py-2 text-[10px] font-mono font-black uppercase rounded-lg border cursor-pointer text-center transition-all ${
                        adminTreeOp === "sponsor" ? "bg-[#0B7A33] text-white border-[#0B7A33]" : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Change Sponsor
                    </button>
                  </div>

                  {treeFormError && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4 text-xs font-mono flex items-center gap-1.5 border border-red-150">
                      <AlertCircle size={14} className="shrink-0" />
                      {treeFormError}
                    </div>
                  )}

                  {treeFormSuccess && (
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl mb-4 text-xs font-mono flex items-center gap-1.5 border border-emerald-150">
                      <CheckCircle size={14} className="shrink-0" />
                      {treeFormSuccess}
                    </div>
                  )}

                  {/* FORM A: ADD NETWORK MEMBER */}
                  {adminTreeOp === "add" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1 uppercase">Full Name</label>
                          <input
                            type="text"
                            placeholder="Ahmad Shah"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            className="w-full text-xs font-bold p-3 bg-[#F8FAFC] border rounded-xl outline-none focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1 uppercase">Username</label>
                          <input
                            type="text"
                            placeholder="ahmadshah"
                            value={newMemberUsername}
                            onChange={(e) => setNewMemberUsername(e.target.value)}
                            className="w-full text-xs font-bold p-3 bg-[#F8FAFC] border rounded-xl outline-none focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1 uppercase">Email Address</label>
                          <input
                            type="email"
                            placeholder="ahmad@gmail.com"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            className="w-full text-xs font-bold p-3 bg-[#F8FAFC] border rounded-xl outline-none focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1 uppercase">Phone Number</label>
                          <input
                            type="text"
                            placeholder="03241651892"
                            value={newMemberPhone}
                            onChange={(e) => setNewMemberPhone(e.target.value)}
                            className="w-full text-xs font-bold p-3 bg-[#F8FAFC] border rounded-xl outline-none focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-[#F8FAFC] border rounded-xl space-y-3 mt-2">
                        <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-widest block">Upline Placement Configurations</span>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[8px] font-mono font-bold text-gray-400 block mb-0.5">Sponsor Username / Code</label>
                            <input
                              type="text"
                              placeholder="kamran (Optional)"
                              value={newMemberSponsor}
                              onChange={(e) => setNewMemberSponsor(e.target.value)}
                              className="w-full text-xs font-bold p-2 bg-white border rounded-lg outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-mono font-bold text-gray-400 block mb-0.5">Direct Parent Node ID</label>
                            <input
                              type="text"
                              placeholder="u-kamran (Optional)"
                              value={newMemberParent}
                              onChange={(e) => setNewMemberParent(e.target.value)}
                              className="w-full text-xs font-bold p-2 bg-white border rounded-lg outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[8px] font-mono font-bold text-gray-400 block mb-1 uppercase">Subline Placement alignment</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800 cursor-pointer">
                              <input
                                type="radio"
                                name="newPos"
                                checked={newMemberPosition === "left"}
                                onChange={() => setNewMemberPosition("left")}
                                className="accent-[#0B7A33]"
                              />
                              Left team Wing
                            </label>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-800 cursor-pointer">
                              <input
                                type="radio"
                                name="newPos"
                                checked={newMemberPosition === "right"}
                                onChange={() => setNewMemberPosition("right")}
                                className="accent-[#0B7A33]"
                              />
                              Right team Wing
                            </label>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          setTreeFormError("");
                          setTreeFormSuccess("");
                          try {
                            const res = await fetch("/api/admin/tree/add-user", {
                              method: "POST",
                              headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                name: newMemberName,
                                username: newMemberUsername,
                                email: newMemberEmail,
                                phone: newMemberPhone,
                                sponsorCodeOrId: newMemberSponsor || "HQNODE",
                                parentId: newMemberParent || undefined,
                                position: newMemberPosition
                              })
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setTreeFormSuccess("Network Partner added and synchronized in the tree structure successfully! Password: password123");
                              // Clear inputs
                              setNewMemberName("");
                              setNewMemberUsername("");
                              setNewMemberEmail("");
                              setNewMemberPhone("");
                              setNewMemberSponsor("");
                              setNewMemberParent("");
                              fetchTreeStructure();
                            } else {
                              setTreeFormError(data.error || "Failed to create node user.");
                            }
                          } catch (err) {
                            setTreeFormError("Connection anomaly.");
                          }
                        }}
                        className="w-full mt-4 py-3 bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer text-center shadow-md block transition-colors"
                      >
                        CREATE & POSITION MEMBER
                      </button>
                    </div>
                  )}

                  {/* FORM B: MOVE USER IN PLACEMENT TREE */}
                  {adminTreeOp === "move" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1 uppercase">Select target partner node ID to move</label>
                        <select
                          value={moveMemberId}
                          onChange={(e) => setMoveMemberId(e.target.value)}
                          className="w-full p-3 text-xs font-bold bg-[#F8FAFC] border rounded-xl outline-none"
                        >
                          <option value="">-- Choose User --</option>
                          {apiTreeNodes.filter(n => n.parentId).map(u => (
                            <option key={u.id} value={u.id}>{u.name} (ID: {u.id} @{u.username})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1 uppercase">Enter new Parent Node ID</label>
                          <input
                            type="text"
                            placeholder="e.g., u-kamran"
                            value={moveNewParentId}
                            onChange={(e) => setMoveNewParentId(e.target.value)}
                            className="w-full text-xs font-bold p-3 bg-[#F8FAFC] border rounded-xl outline-none focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1 uppercase">Position Wing Selection</label>
                          <div className="flex gap-4 p-3 bg-[#F8FAFC] border rounded-xl h-full items-center">
                            <label className="flex items-center gap-1 text-xs font-bold text-gray-800 cursor-pointer">
                              <input
                                type="radio"
                                name="mPos"
                                checked={movePosition === "left"}
                                onChange={() => setMovePosition("left")}
                                className="accent-[#0B7A33]"
                              />
                              Left
                            </label>
                            <label className="flex items-center gap-1 text-xs font-bold text-gray-800 cursor-pointer">
                              <input
                                type="radio"
                                name="mPos"
                                checked={movePosition === "right"}
                                onChange={() => setMovePosition("right")}
                                className="accent-[#0B7A33]"
                              />
                              Right
                            </label>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          setTreeFormError("");
                          setTreeFormSuccess("");
                          if (!moveMemberId || !moveNewParentId) {
                            setTreeFormError("Please select user and specify new parent.");
                            return;
                          }
                          try {
                            const res = await fetch("/api/admin/tree/move-user", {
                              method: "POST",
                              headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                userId: moveMemberId,
                                newParentId: moveNewParentId,
                                position: movePosition
                              })
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setTreeFormSuccess(data.message || "User moved on the tree structure successfully!");
                              setMoveMemberId("");
                              setMoveNewParentId("");
                              fetchTreeStructure();
                            } else {
                              setTreeFormError(data.error || "Failed to shift node.");
                            }
                          } catch (err) {
                            setTreeFormError("Network error.");
                          }
                        }}
                        className="w-full mt-4 py-3 bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer text-center shadow-md block transition-colors"
                      >
                        RE-INTEGRATE NODE PLACEMENT
                      </button>
                    </div>
                  )}

                  {/* FORM C: CHANGE SPONSOR / REFERRER */}
                  {adminTreeOp === "sponsor" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1 uppercase">Select target partner node ID</label>
                        <select
                          value={sponsorMemberId}
                          onChange={(e) => setSponsorMemberId(e.target.value)}
                          className="w-full p-3 text-xs font-bold bg-[#F8FAFC] border rounded-xl outline-none"
                        >
                          <option value="">-- Choose User --</option>
                          {apiTreeNodes.map(u => (
                            <option key={u.id} value={u.id}>{u.name} (ID: {u.id} @{u.username})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-bold text-gray-400 block mb-1 uppercase">Enter target New Sponsor Node ID</label>
                        <input
                          type="text"
                          placeholder="e.g., u-kamran"
                          value={sponsorNewSponsorId}
                          onChange={(e) => setSponsorNewSponsorId(e.target.value)}
                          className="w-full text-xs font-bold p-3 bg-[#F8FAFC] border rounded-xl outline-none focus:bg-white"
                        />
                      </div>

                      <button
                        onClick={async () => {
                          setTreeFormError("");
                          setTreeFormSuccess("");
                          if (!sponsorMemberId || !sponsorNewSponsorId) {
                            setTreeFormError("Specify target member and enter new sponsor ID.");
                            return;
                          }
                          try {
                            const res = await fetch("/api/admin/tree/change-sponsor", {
                              method: "POST",
                              headers: {
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                userId: sponsorMemberId,
                                newSponsorId: sponsorNewSponsorId
                              })
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setTreeFormSuccess(data.message || "Sponsor updated and tree metrics synchronized successfully!");
                              setSponsorMemberId("");
                              setSponsorNewSponsorId("");
                              fetchTreeStructure();
                            } else {
                              setTreeFormError(data.error || "Failed to update sponsor.");
                            }
                          } catch (err) {
                            setTreeFormError("Sponsor migration network error.");
                          }
                        }}
                        className="w-full mt-4 py-3 bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer text-center shadow-md block transition-colors"
                      >
                        RE-ASSIGN NEW SPONSOR REFERRER
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setShowAdminTreeModal(false)}
                    className="w-full mt-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer text-center block transition-colors border"
                  >
                    Close Studio Panel
                  </button>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ----------------------------------------------------
            C. TAB LAYOUT: 🛒 PRODUCTS CATALOG & DROPSHIP SHOP
           ---------------------------------------------------- */}
        {activeMenu === "products" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <div>
                <h2 className="font-sans text-2xl font-black text-gray-900 uppercase tracking-tight">Luxury Products Terminal</h2>
                <p className="text-xs font-semibold text-gray-400 mt-1">Direct shipping from Karachi, Lahore warehouses. Commission yields post directly upon deliveries.</p>
              </div>

              {/* View/Proceed checkout */}
              <button
                onClick={() => {
                  setShowCartDrawer(true);
                  setCheckoutStep("cart");
                }}
                className="px-5 py-3 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ShoppingCart size={15} />
                Checkout Queue ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </button>
            </div>

            {/* Catalog search/category rail */}
            <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-[#F8FAFC] border rounded-2xl">
              
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input
                  type="text"
                  placeholder="Filter stock by name, keywords, or specifications..."
                  value={searchProductQuery}
                  onChange={(e) => setSearchProductQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none text-xs font-semibold focus:border-[#0B7A33]"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {["all", "Fashion", "Electronics", "Wellness"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedProductCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-[10px] font-mono font-extrabold uppercase border cursor-pointer ${
                      selectedProductCategory === cat 
                        ? "bg-[#0B7A33] text-white border-transparent" 
                        : "bg-white text-gray-500 hover:text-gray-900 border-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* PRODUCT BENTO GRID */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-xs font-mono font-bold">No retail products matched that query. Try again.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                    
                    <div>
                      {/* Image */}
                      <div className="h-44 bg-gray-50 border-b relative">
                        <img 
                          src={p.images && p.images[0] ? p.images[0] : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600"} 
                          alt={p.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 bg-white/94 backdrop-blur-xs px-2.5 py-1 rounded text-[8px] font-mono font-black text-gray-600 uppercase border tracking-wider">
                          {p.category}
                        </span>
                        
                        {p.stock <= 5 && (
                          <span className="absolute top-3 right-3 bg-red-600 px-2 py-0.5 rounded text-[8px] font-mono font-black text-white uppercase animate-pulse">
                            low stock ({p.stock})
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-2">
                        <h3 className="font-sans font-bold text-sm text-gray-900 leading-tight lg:h-10 line-clamp-2">{p.name}</h3>
                        <p className="text-[10px] text-gray-450 line-clamp-3 leading-relaxed font-semibold">{p.description}</p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/60 p-3 rounded-2xl border mb-4">
                        <div>
                          <span className="text-[8px] text-gray-400 font-mono font-bold block uppercase">Retail Price</span>
                          <strong className="text-sm font-mono text-gray-900">{p.price.toLocaleString()} PKR</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-gray-400 font-mono font-bold block uppercase">Your Commission</span>
                          <strong className="text-xs font-mono text-[#0B7A33] font-extrabold">+{Math.round(p.price * (p.commissionPercent / 100)).toLocaleString()} PKR ({p.commissionPercent}%)</strong>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProductDetails(p)}
                          className="flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                        >
                          Specs
                        </button>
                        
                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={p.stock <= 0}
                          className="flex-3 py-3 text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-[#0B7A33] hover:bg-[#12A84A] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-gray-200 disabled:text-gray-400"
                        >
                          Add to Cart
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* CART CHECKOUT DRAWER / MODAL */}
            {showCartDrawer && (
              <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
                <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between text-left border-l">
                  
                  {/* Drawer Header */}
                  <div className="p-6 border-b flex justify-between items-center bg-[#F8FAFC]">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="text-[#0B7A33]" size={18} />
                      <h3 className="font-sans text-sm font-black uppercase text-gray-900 tracking-tight">Checkout Drawer Portal</h3>
                    </div>
                    <button onClick={() => setShowCartDrawer(false)} className="text-gray-400 hover:text-gray-900 font-extrabold cursor-pointer">
                      ✕
                    </button>
                  </div>

                  {/* Cart Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Stepper progress */}
                    <div className="flex justify-around text-[10px] font-mono font-black uppercase tracking-wider border-b pb-4">
                      <span className={checkoutStep === "cart" ? "text-[#0B7A33] underline" : "text-gray-400"}>1. Cart items ({cart.length})</span>
                      <span className={checkoutStep === "shipping" ? "text-[#0B7A33] underline" : "text-gray-400"}>2. Drop-shipping</span>
                      <span className={checkoutStep === "complete" ? "text-emerald-700 underline" : "text-gray-400"}>3. Completed</span>
                    </div>

                    {checkoutStep === "cart" && (
                      <div className="space-y-4">
                        {cart.length === 0 ? (
                          <div className="text-center py-20 text-gray-400 font-mono text-xs">Checkout queue is empty. Add items from the catalog.</div>
                        ) : (
                          <div className="space-y-3.5">
                            {cart.map((item) => (
                              <div key={item.product.id} className="p-3 border rounded-xl flex justify-between items-center bg-gray-50/50">
                                <div className="min-w-0 flex-1">
                                  <span className="text-xs font-bold text-gray-900 block truncate">{item.product.name}</span>
                                  <span className="text-[10px] text-[#0B7A33] font-mono font-semibold block mt-0.5">{item.product.price.toLocaleString()} PKR</span>
                                </div>
                                <div className="flex items-center gap-3 ml-4 shrink-0">
                                  <button onClick={() => handleUpdateCartQty(item.product.id, -1)} className="px-2 py-1 bg-white border font-bold text-xs rounded hover:bg-gray-100 cursor-pointer">-</button>
                                  <span className="text-xs font-mono font-extrabold">{item.quantity}</span>
                                  <button onClick={() => handleUpdateCartQty(item.product.id, 1)} className="px-2 py-1 bg-white border font-bold text-xs rounded hover:bg-gray-100 cursor-pointer">+</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {checkoutStep === "shipping" && (
                      <form onSubmit={handlePlaceOrder} className="space-y-4 font-mono text-xs font-bold">
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase font-black block mb-1">Retail Client Name</label>
                          <input
                            type="text"
                            required
                            value={shippingDetails.name}
                            onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                            placeholder="e.g. Imran Khan"
                            className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase font-black block mb-1">WhatsApp / Contact Phone</label>
                          <input
                            type="tel"
                            required
                            value={shippingDetails.phone}
                            onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                            placeholder="e.g. +923151234567"
                            className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase font-black block mb-1">City Hub</label>
                          <select
                            value={shippingDetails.city}
                            onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                            className="w-full p-3 bg-gray-50 border rounded-lg text-xs"
                          >
                            <option value="Lahore">Lahore</option>
                            <option value="Karachi">Karachi</option>
                            <option value="Islamabad">Islamabad</option>
                            <option value="Rawalpindi">Rawalpindi</option>
                            <option value="Faisalabad">Faisalabad</option>
                            <option value="Multan">Multan</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase font-black block mb-1">Fulfillment Street Address</label>
                          <textarea
                            required
                            rows={3}
                            value={shippingDetails.address}
                            onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                            placeholder="Deliver exact dropshipping coordinates..."
                            className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:bg-white text-xs resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] text-gray-500 uppercase font-black block mb-1.5">Collect Cash via Client Method</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["JazzCash", "EasyPaisa", "Bank Transfer"].map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setPaymentMethod(m as any)}
                                className={`p-2.5 border rounded-lg text-[9px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                                  paymentMethod === m 
                                    ? "bg-[#0B7A33]/15 text-[#0B7A33] border-[#0B7A33]" 
                                    : "bg-white text-gray-500"
                                }`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-4 mt-6 bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                        >
                          Submit Outflow Shipment
                        </button>

                      </form>
                    )}

                    {checkoutStep === "complete" && checkoutSuccessDetails && (
                      <div className="text-center py-8 space-y-4 font-mono">
                        <CheckCircle size={48} className="text-emerald-500 mx-auto animate-bounce" />
                        <div>
                          <h4 className="text-gray-900 font-extrabold text-sm uppercase">Order Successfully Logged!</h4>
                          <p className="text-[10px] text-gray-500 mt-1 leading-normal">Dropshipping reference code: <strong>{checkoutSuccessDetails.id}</strong></p>
                          <p className="text-[10px] border p-3 border-emerald-100 bg-emerald-50/50 rounded-xl text-emerald-800 leading-normal font-semibold mt-3">
                            Commission has been queued as pending override rewards!
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Foot total actions */}
                  {checkoutStep === "cart" && cart.length > 0 && (
                    <div className="p-6 border-t bg-[#F8FAFC]">
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-gray-900 mb-4 uppercase">
                        <span>Consolidated Total:</span>
                        <span className="text-lg text-[#0B7A33] font-extrabold">{cartSubtotal.toLocaleString()} PKR</span>
                      </div>
                      <button
                        onClick={() => setCheckoutStep("shipping")}
                        className="w-full py-3.5 bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer text-center"
                      >
                        Proceed to Shipping Details
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Product description specifications popup dialog */}
            {selectedProductDetails && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white border rounded-3xl p-6 shadow-2xl relative text-left">
                  
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <span className="text-[8px] font-mono font-black text-[#0B7A33] uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded">
                      item specifications portfolio
                    </span>
                    <button onClick={() => setSelectedProductDetails(null)} className="text-gray-400 hover:text-black font-extrabold">✕</button>
                  </div>

                  <h3 className="font-sans text-base font-black text-gray-900">{selectedProductDetails.name}</h3>
                  <p className="text-xs text-gray-505 mt-2 leading-relaxed font-semibold">{selectedProductDetails.description}</p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        triggerCopywriter(selectedProductDetails.name);
                        setSelectedProductDetails(null);
                      }}
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-mono font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles size={11} /> Generate AI social Ads
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProductDetails);
                        setSelectedProductDetails(null);
                      }}
                      className="flex-1 py-3 bg-[#0B7A33] hover:bg-[#12A84A] text-white font-mono font-bold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Instant Add Cart
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ----------------------------------------------------
            D. TAB LAYOUT: 📦 ORDER MANAGEMENT STATUS TRACKS
           ---------------------------------------------------- */}
        {activeMenu === "orders" && (
          <div className="space-y-6 animate-fadeIn text-left">
            
            <div>
              <h2 className="font-sans text-2xl font-black text-gray-900 uppercase tracking-tight">Dropshipping Submissions Ledger</h2>
              <p className="text-xs font-semibold text-gray-400 mt-1">Track downstream order fulfilment states. Once marked as Deliveries completed, payouts clear immediately.</p>
            </div>

            {orders.length === 0 ? (
              <div className="border border-dashed rounded-3xl p-16 text-center text-gray-440 font-mono text-xs">
                No orders compiled yet. Go browse the <button onClick={() => setActiveMenu("products")} className="text-[#0B7A33] font-bold hover:underline">products list</button> to test client drop shipping checkouts.
              </div>
            ) : (
              <div className="space-y-6 font-mono text-xs">
                {orders.map((o: any) => (
                  <div key={o.id} className="p-6 bg-white border border-gray-200 rounded-3xl space-y-4 shadow-xs">
                    
                    {/* Upper row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 border-gray-150 gap-2">
                      <div>
                        <span className="font-extrabold text-sm text-gray-900">Reference: #{o.id}</span>
                        <span className="text-[10px] text-gray-450 block font-bold mt-0.5">Recorded: {new Date(o.createdAt).toLocaleString()} • Payer: {o.payMethod}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded border ${
                          o.status === "Delivered" ? "bg-emerald-50 text-emerald-800 border-emerald-100" :
                          o.status === "Pending" ? "bg-amber-50 text-amber-850 border-amber-100" :
                          o.status === "Cancelled" ? "bg-red-50 text-red-800 border-red-100" :
                          "bg-blue-50 text-blue-800 border-blue-100"
                        }`}>
                          {o.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Order items lists */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Products */}
                      <div className="md:col-span-7 space-y-2 text-left">
                        <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest block">Consolidated Commodities</span>
                        {o.items.map((it: any, i: number) => (
                          <div key={i} className="flex justify-between font-bold text-gray-800 pb-2 border-b border-gray-50">
                            <span>{it.name} <span className="text-gray-400">({it.quantity}x)</span></span>
                            <span>{it.price.toLocaleString()} PKR</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-extrabold text-gray-900 pt-2">
                          <span>Subtotal Invoice</span>
                          <span className="text-[#0B7A33] text-sm">{o.totalAmount.toLocaleString()} PKR</span>
                        </div>
                      </div>

                      {/* Client recipient details */}
                      <div className="md:col-span-5 bg-gray-50 p-4 rounded-2xl border space-y-2 text-[10px] text-gray-600 font-semibold text-left">
                        <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest block mb-2">Recipients Dropshipping Coordinates</span>
                        <div className="flex items-center gap-2"><User size={12} className="text-gray-400" /> Name: <strong className="text-gray-900">{o.customerDetails.name}</strong></div>
                        <div className="flex items-center gap-2"><Phone size={12} className="text-gray-400" /> Mobile: <strong className="text-gray-900">{o.customerDetails.phone}</strong></div>
                        <div className="flex items-center gap-2"><MapPin size={12} className="text-gray-400" /> City: <strong className="text-gray-900">{o.customerDetails.city}</strong></div>
                        <p className="mt-2 text-gray-500 font-mono text-[9px] font-bold pl-2 border-l border-gray-300">{o.customerDetails.address}</p>
                      </div>

                    </div>

                    {/* Progress tracking tracks */}
                    <div className="pt-4 border-t border-gray-100">
                      <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest block mb-3 text-left">Shipping Milestone Timeline</span>
                      <div className="grid grid-cols-5 text-center text-[9px] font-mono font-bold text-gray-400 gap-1 select-none">
                        {[
                          { id: "Pending", label: "Pending Verification" },
                          { id: "Processing", label: "Processing Hub" },
                          { id: "Shipped", label: "Dispatched Transit" },
                          { id: "Delivered", label: "Fulfillment Completed" },
                          { id: "Cancelled", label: "Cancelled" }
                        ].map((m) => {
                          const isActive = o.status === m.id;
                          return (
                            <div 
                              key={m.id} 
                              className={`p-1.5 rounded-lg border ${
                                isActive 
                                  ? "bg-[#0B7A33]/12 border-[#0B7A33] text-[#0B7A33] font-black" 
                                  : "bg-gray-50 border-gray-150"
                              }`}
                            >
                              {m.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ----------------------------------------------------
            E. TAB LAYOUT: 👥 CUSTOMERS CRM MANAGEMENT
           ---------------------------------------------------- */}
        {activeMenu === "customers" && (
          <div className="space-y-6 animate-fadeIn text-left">
            
            <div>
              <h2 className="font-sans text-2xl font-black text-gray-900 uppercase tracking-tight">Client CRM & Retail Database</h2>
              <p className="text-xs font-semibold text-gray-400 mt-1">Register dynamic contacts. Place dropship orders linking directly to these customer files to keep coordinates indexed.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs text-left">
              
              {/* Add Customer form */}
              <div className="lg:col-span-4 p-6 bg-[#F8FAFC] border rounded-3xl space-y-4 font-bold">
                <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight">Index New Client</h3>

                {customerSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] text-[#0B7A33] font-bold">
                    ✓ Client successfully index logged.
                  </div>
                )}
                {customerErr && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-700 font-bold">
                    ⚠ {customerErr}
                  </div>
                )}

                <form onSubmit={handleRegisterCustomer} className="space-y-4 text-xs font-bold font-mono">
                  
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Full Client Name</label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Aslam Khan"
                      className="p-3 bg-white border rounded-xl outline-none focus:border-[#0B7A33]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Mobile WhatsApp Number Required</label>
                    <input
                      type="tel"
                      required
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="e.g. 03212345672"
                      className="p-3 bg-white border rounded-xl outline-none focus:border-[#0B7A33]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Email Coordinate (Optional)</label>
                    <input
                      type="email"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="e.g. aslam@gmail.com"
                      className="p-3 bg-white border rounded-xl outline-none focus:border-[#0B7A33]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Location City</label>
                    <select
                      value={custCity}
                      onChange={(e) => setCustCity(e.target.value)}
                      className="p-3 bg-white border rounded-xl text-xs font-bold"
                    >
                      <option value="Karachi">Karachi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Peshawar">Peshawar</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Shipping Street Address</label>
                    <textarea
                      rows={2}
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      placeholder="Fulfillment house, block details..."
                      className="p-3 bg-white border rounded-xl outline-none focus:border-[#0B7A33] resize-none text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0B7A33] hover:bg-[#12A84A] text-white rounded-xl uppercase tracking-wider text-[10px] font-mono cursor-pointer"
                  >
                    Index client coordinates
                  </button>

                </form>

              </div>

              {/* Customer table list */}
              <div className="lg:col-span-8 p-6 bg-white border rounded-3xl space-y-4">
                <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight">Active Client CRM Indexes</h3>

                {customers.length === 0 ? (
                  <div className="text-center py-20 text-gray-400 font-mono text-xs">No client records indexed. Use left portal to log your retail customers.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-gray-400 uppercase text-[9px] tracking-wider text-left font-black">
                          <th className="pb-2">Client Details</th>
                          <th className="pb-2">Contact Link</th>
                          <th className="pb-2">City</th>
                          <th className="pb-2">Registration ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((c: any) => (
                          <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50/50">
                            <td className="py-3">
                              <strong className="text-gray-900 font-extrabold text-xs block">{c.name}</strong>
                              <span className="text-[10px] text-gray-400 font-semibold block">{c.address}</span>
                            </td>
                            <td className="py-3 text-xs font-semibold text-gray-600">
                              <span className="block">{c.phone}</span>
                              <span className="block text-gray-400 font-normal">{c.email}</span>
                            </td>
                            <td className="py-3 font-extrabold text-gray-950 font-mono">{c.city}</td>
                            <td className="py-3 text-[10px] text-gray-450 font-mono font-bold">#{c.id.toUpperCase()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            F. TAB LAYOUT: 💰 SALES COMMISSION & WALLET DISBURSE
           ---------------------------------------------------- */}
        {activeMenu === "commission" && (
          <div className="space-y-6 animate-fadeIn text-left">
            
            <div>
              <h2 className="font-sans text-2xl font-black text-gray-900 uppercase tracking-tight">Sales Overrides & Cashier Clearing</h2>
              <p className="text-xs font-semibold text-gray-400 mt-1">Acquire and request withdrawals of multi-level commissions directly onto Pakistani local bank gateways.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
              
              {/* Cashout form request */}
              <div className="lg:col-span-4 p-6 bg-[#F8FAFC] border rounded-3xl space-y-4 text-left font-bold">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight">Cashout request</h3>
                  <span className="p-1 px-2.5 rounded bg-emerald-50 text-[9px] text-[#0B7A33] font-bold">Secure Gate</span>
                </div>

                <div className="p-4 bg-white border rounded-2xl">
                  <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest block">Withdrawable Available Vault</span>
                  <strong className="text-lg font-mono text-[#0B7A33] block mt-1">{stats.walletBalance.toLocaleString()} PKR</strong>
                </div>

                {withdrawSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] text-[#0B7A33] font-extrabold">
                    ✓ Disbursement request has been queued in administrative Cashier clears list successfully!
                  </div>
                )}
                {withdrawErr && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-700 font-bold">
                    ⚠ {withdrawErr}
                  </div>
                )}

                <form onSubmit={handleWithdrawalRequest} className="space-y-4 text-xs font-bold font-mono">
                  
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Clearance Volume Amount (PKR)</label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Minimum 500 PKR threshold"
                      className="p-3 bg-white border rounded-xl outline-none focus:border-[#0B7A33]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Gateway Protocol Method</label>
                    <select
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value as any)}
                      className="p-3 bg-white border rounded-xl text-xs font-bold"
                    >
                      <option value="JazzCash">JazzCash Pakistan</option>
                      <option value="EasyPaisa">EasyPaisa Mobile Wallet</option>
                      <option value="Bank Transfer">All Pakistan Bank Transfers</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Gateway Account Number / Bank details</label>
                    <textarea
                      required
                      rows={3}
                      value={withdrawDetails}
                      onChange={(e) => setWithdrawDetails(e.target.value)}
                      placeholder="Specify IBAN, JazzCash Account Number, and Exact Recipient Name..."
                      className="p-3 bg-white border rounded-xl outline-none focus:border-[#0B7A33] resize-none text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={withdrawLoading}
                    className="w-full py-4 bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs uppercase rounded-xl tracking-wider cursor-pointer"
                  >
                    Clear finance balances link
                  </button>

                </form>
              </div>

              {/* Commission overrides table & historical cashier reports */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Comm */}
                <div className="p-6 bg-white border rounded-3xl space-y-4">
                  <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight">Product Sales Overrides Logs</h3>

                  {commissions.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-mono text-xs">No referrals commission overrides reported on current block.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b text-gray-400 uppercase text-[9px] tracking-wider font-black">
                            <th className="pb-2">Affiliate Source</th>
                            <th className="pb-2">Level Split</th>
                            <th className="pb-2 text-right">Commission Amt</th>
                            <th className="pb-2 text-right">Fulfillment Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commissions.map((c: any) => (
                            <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50/50 font-bold">
                              <td className="py-2.5 text-xs text-gray-950 font-extrabold">
                                @{c.fromUsername}
                                <span className="block text-[8px] font-normal text-gray-450 font-mono uppercase tracking-widest mt-0.5">Reference ID: #{c.id}</span>
                              </td>
                              <td className="py-2.5 font-mono text-amber-850">Tier L{c.level} Split</td>
                              <td className="py-2.5 font-mono text-[#0B7A33] font-black text-right">+{c.amount.toLocaleString()} PKR</td>
                              <td className="py-2.5 text-right">
                                <span className={`inline-block px-2 py-0.5 rounded text-[8px] border font-black uppercase tracking-wider ${
                                  c.status === "Approved" ? "bg-emerald-50 text-[#0B7A33] border-emerald-100" :
                                  c.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                  "bg-red-50 text-red-750 border-red-100"
                                }`}>
                                  {c.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Withdrawals report history */}
                <div className="p-6 bg-white border rounded-3xl space-y-4">
                  <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight">Settled cashier disbursement histories</h3>
                  
                  {withdrawals.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-mono text-xs">No cashier clearance request history loaded.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b text-gray-400 uppercase text-[9px] tracking-wider font-black">
                            <th className="pb-2">Requested Date</th>
                            <th className="pb-2">Disbursement Channel</th>
                            <th className="pb-2 text-right">Clearance Price</th>
                            <th className="pb-2 text-right">Cashier Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {withdrawals.map((w: any) => (
                            <tr key={w.id} className="border-b last:border-0 hover:bg-gray-50/50 font-bold">
                              <td className="py-2.5 font-mono text-gray-400">{new Date(w.createdAt).toLocaleDateString()}</td>
                              <td className="py-2.5 text-gray-900 font-semibold">{w.method}\n<span className="block text-[8px] text-gray-400 font-normal">{w.details}</span></td>
                              <td className="py-2.5 font-mono text-[#0B7A33] text-right font-black">-{w.amount.toLocaleString()} PKR</td>
                              <td className="py-2.5 text-right">
                                <span className={`inline-block px-2 py-0.5 rounded text-[8px] border font-black uppercase tracking-wider ${
                                  w.status === "Paid" ? "bg-emerald-50 text-emerald-800 border-emerald-100" :
                                  w.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                  "bg-red-50 text-red-700 border-red-100"
                                }`}>
                                  {w.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            G. TAB LAYOUT: 👤 PROFILE SETTINGS / PASSWORD UPDATE
           ---------------------------------------------------- */}
        {activeMenu === "profile" && (
          <div className="space-y-6 animate-fadeIn text-left font-mono">
            
            <div>
              <h2 className="font-sans text-2xl font-black text-gray-900 uppercase tracking-tight">Identity & Profile Workspace</h2>
              <p className="text-xs font-semibold text-gray-400 mt-1">Manage physical reseller location registers, contact WhatsApp numbers, and credential locks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-xs font-bold font-mono">
              
              {/* Profile Details */}
              <div className="p-6 bg-white border rounded-3xl space-y-4">
                <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight">Verified Credentials Overview</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col border-b pb-2">
                    <span className="text-[8px] text-gray-400 font-black uppercase">Reseller Corporate Designation</span>
                    <strong className="text-[#0B7A33] text-[13px] font-black uppercase mt-1">{user.rank} Level Tier</strong>
                  </div>
                  <div className="flex flex-col border-b pb-2">
                    <span className="text-[8px] text-gray-400 font-black uppercase">Your Registration Name</span>
                    <strong className="text-gray-900 text-xs font-bold mt-1">{user.name}</strong>
                  </div>
                  <div className="flex flex-col border-b pb-2">
                    <span className="text-[8px] text-gray-400 font-black uppercase">Corporate Mailbox ID</span>
                    <strong className="text-gray-900 text-xs font-normal mt-1">{user.email}</strong>
                  </div>
                  <div className="flex flex-col border-b pb-2">
                    <span className="text-[8px] text-gray-400 font-black uppercase">Active Whatsapp Mobile Code</span>
                    <strong className="text-gray-900 text-xs font-mono mt-1">{user.mobile}</strong>
                  </div>
                  <div className="flex flex-col border-b pb-2">
                    <span className="text-[8px] text-gray-400 font-black uppercase">Country Hub</span>
                    <strong className="text-gray-900 text-xs font-bold mt-1">{user.country}</strong>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-gray-400 font-black uppercase">Affiliate Referral Code</span>
                    <strong className="text-[#0B7A33] text-xs font-mono font-black mt-1 uppercase">{user.referralCode}</strong>
                  </div>
                </div>
              </div>

              {/* Copywriter suite resides right in settings */}
              <div className="p-6 bg-[#F8FAFC] border rounded-3xl space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#0B7A33]" />
                  <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight">AI Copywriter Assistant</h3>
                </div>
                <p className="text-[10px] text-gray-450 leading-relaxed font-semibold">Generate high-conversion social media retail copies powered by server-side Gemini 3.5 AI instances.</p>

                <form onSubmit={(e) => { e.preventDefault(); triggerCopywriter(copywriterProduct); }} className="space-y-4">
                  
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Pick a Commodity</label>
                    <select
                      value={copywriterProduct}
                      onChange={(e) => setCopywriterProduct(e.target.value)}
                      className="p-3 bg-white border rounded-xl text-xs font-bold"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">Target Social Format</label>
                    <select
                      value={copywriterFormat}
                      onChange={(e) => setCopywriterFormat(e.target.value)}
                      className="p-3 bg-white border rounded-xl text-xs font-bold"
                    >
                      <option value="WhatsApp Hook">WhatsApp Sales Hook</option>
                      <option value="TikTok Script">TikTok Short Video Voiceover</option>
                      <option value="Facebook Ad copy">Facebook Conversion Copy</option>
                      <option value="Instagram Caption">Instagram Clean Caption</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={copywriterLoading}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {copywriterLoading ? "AI COPIES WRITING..." : "EXECUTE COPYWRITER GENERATION"}
                  </button>

                </form>

                {copywriterResult && (
                  <div className="pt-4 border-t border-gray-200 mt-4 text-left font-mono text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-emerald-850">Ad copywriting results</span>
                      <button onClick={copyTextToClipboard} className="text-[10px] text-[#0B7A33] font-bold hover:underline cursor-pointer">
                        {copywriterCopied ? "✓ COPIED!" : "COPY COPY"}
                      </button>
                    </div>
                    <pre className="p-3.5 bg-white border rounded-xl text-[10px] text-gray-700 leading-normal whitespace-pre-wrap max-h-56 overflow-y-auto">
                      {copywriterResult}
                    </pre>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            E-PIN TAB: KEY OPERATIONS & PROFILE ACTIVATION
           ---------------------------------------------------- */}
        {activeMenu === "epins" && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div>
              <h2 className="font-sans text-2xl font-black text-gray-900 uppercase tracking-tight">Available E-Pins Portfolio</h2>
              <p className="text-xs font-semibold text-gray-400 mt-1">Manage, audit, and redeem your commercial activation keys to bootstrap user downlines.</p>
            </div>

            {/* Live Activation Widget Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative text-left">
                <div className="flex items-center gap-2.5 mb-4 border-b border-gray-100 pb-4">
                  <div className="p-2 rounded-xl bg-[#0B7A33]/10 text-[#0B7A33]">
                    <Key size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900 uppercase">PIN ACTIVATION ENGINE</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Activate yourself or a downline partner</p>
                  </div>
                </div>

                {activateMessage && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-[#0B7A33] text-xs font-medium rounded-xl leading-relaxed">
                    {activateMessage}
                  </div>
                )}
                {activateError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl leading-relaxed">
                    {activateError}
                  </div>
                )}

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!activatePinNumber) {
                    setActivateError("Please select or input an E-Pin to activate.");
                    return;
                  }
                  setActivateLoading(true);
                  setActivateError(null);
                  setActivateMessage(null);
                  try {
                    const res = await fetch("/api/epins/activate", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        pinCode: activatePinNumber,
                        username: activateTargetUsername || undefined,
                        parentUsername: activateSponsorUsername || undefined,
                        position: activatePosition
                      })
                    });
                    const resData = await res.json();
                    if (!res.ok) {
                      throw new Error(resData.error || "E-Pin redeem validation failed.");
                    }
                    setActivateMessage(resData.message || "✓ User successfully activated and integrated in organization chart!");
                    setActivatePinNumber("");
                    setActivateTargetUsername("");
                    setActivateSponsorUsername("");
                    // Reload Data
                    fetchEPinsData();
                    fetchProfileAndShop();
                  } catch (err: any) {
                    setActivateError(err.message || "E-Pin activation attempt failed.");
                  } finally {
                    setActivateLoading(false);
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1.5">Selected E-Pin Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="ECN-XXXX-XXXX"
                      value={activatePinNumber}
                      onChange={(e) => setActivatePinNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold uppercase tracking-wider focus:border-[#0B7A33] outline-none"
                    />
                    <span className="text-[9px] text-gray-400 mt-1 block leading-normal font-sans">
                      Select any unused pin code from the ledger table below or copy/paste here.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1.5">Target Username (Blank for Self) </label>
                    <input
                      type="text"
                      placeholder="e.g. kamran_ecom"
                      value={activateTargetUsername}
                      onChange={(e) => setActivateTargetUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-sans font-bold focus:border-[#0B7A33] outline-none"
                    />
                    <span className="text-[9px] text-gray-400 mt-1 block leading-normal font-sans">
                      Leave empty to activate your own user account, or specify downline partner username.
                    </span>
                  </div>

                  {activateTargetUsername && (
                    <>
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1.5">Sponsor / Parent Username *</label>
                        <input
                          type="text"
                          required
                          placeholder="Sponsor's Username"
                          value={activateSponsorUsername}
                          onChange={(e) => setActivateSponsorUsername(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-sans font-bold focus:border-[#0B7A33] outline-none"
                        />
                        <span className="text-[9px] text-gray-400 mt-1 block leading-normal font-sans">
                          The parent node under which this user will be placed inside binary MLM tree.
                        </span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1.5">Tree Placement Position *</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => setActivatePosition("left")}
                            className={`py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-widest border transition-all ${
                              activatePosition === "left"
                                ? "bg-[#0B7A33] text-white border-transparent"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            Left Node
                          </button>
                          <button
                            type="button"
                            onClick={() => setActivatePosition("right")}
                            className={`py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-widest border transition-all ${
                              activatePosition === "right"
                                ? "bg-[#0B7A33] text-white border-transparent"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            Right Node
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={activateLoading}
                    className="w-full py-3 px-4 bg-[#0B7A33] hover:bg-[#12A84A] disabled:bg-gray-300 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer mt-2"
                  >
                    {activateLoading ? "Processing Node..." : "Activate Now"}
                  </button>
                </form>
              </div>

              {/* Pins Table Ledger */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm text-left">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <h3 className="font-extrabold text-sm text-gray-900 uppercase">E-Pins Inventory Ledgers</h3>
                  <span className="px-2.5 py-1 bg-[#0B7A33]/10 text-[#0B7A33] font-mono text-[10px] font-extrabold rounded-lg">
                    {userPins.filter((p: any) => p.status === "Unused").length} UNUSED REQUISITE PINS
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-3 text-[10px] font-mono uppercase text-gray-400 font-extrabold">Pin Code</th>
                        <th className="pb-3 text-[10px] font-mono uppercase text-gray-400 font-extrabold">Status</th>
                        <th className="pb-3 text-[10px] font-mono uppercase text-gray-400 font-extrabold">Acquired Date</th>
                        <th className="pb-3 text-[10px] font-mono uppercase text-gray-400 font-extrabold">Used Date / Target</th>
                        <th className="pb-3 text-[10px] font-mono uppercase text-gray-400 font-extrabold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs text-left">
                      {userPins.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-gray-400 font-medium font-sans">
                            No E-Pins loaded in this account yet. Click "Request E-Pins" menu to purchase activations.
                          </td>
                        </tr>
                      ) : (
                        userPins.map((pin: any) => (
                          <tr key={pin.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 font-mono font-bold tracking-wider text-gray-900">{pin.pinCode}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                pin.status === "Unused"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-500"
                              }`}>
                                {pin.status}
                              </span>
                            </td>
                            <td className="py-3 text-gray-400 font-mono text-[10px]">
                              {new Date(pin.createdAt || Date.now()).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </td>
                            <td className="py-3 text-gray-550 font-sans font-medium">
                              {pin.status === "Used" ? (
                                <div className="text-left leading-tight">
                                  <span className="block font-black text-gray-800">@{pin.usedBy}</span>
                                  <span className="text-[9px] font-mono text-gray-400">{new Date(pin.usedAt).toLocaleDateString()}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="py-3 text-right">
                              {pin.status === "Unused" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActivatePinNumber(pin.pinCode);
                                    alert(`E-Pin ${pin.pinCode} loaded inside Activation Engine widget! Please provide target user fields next.`);
                                  }}
                                  className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#0B7A33] hover:bg-[#12A84A] rounded-md uppercase transition-colors pointer-events-auto cursor-pointer"
                                >
                                  Activate
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
          </div>
        )}

        {/* ----------------------------------------------------
            REQUEST E-PINS TAB: PAYMENT & ADMIN PURCHASE APPROVALS
           ---------------------------------------------------- */}
        {activeMenu === "request-epins" && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div>
              <h2 className="font-sans text-2xl font-black text-gray-900 uppercase tracking-tight">E-Pin Acquisition Request</h2>
              <p className="text-xs font-semibold text-gray-400 mt-1">Submit transfer credentials to acquire activation E-Pins. Price: Rs. 950 per Activation Pin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Payment Details Console */}
              <div className="lg:col-span-1 space-y-6 text-left">
                
                {/* Visual Admin Payment Info */}
                <div className="bg-[#0B7A33] text-white p-6 rounded-3xl shadow-md space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-white/20 pb-4">
                    <div className="p-2 rounded-xl bg-white/10 text-white">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-white/80">OFFICIAL PAYMENTS TERMINALS</h4>
                      <h3 className="font-black text-sm uppercase">Econ Network Accounts</h3>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-left">
                    <div>
                      <span className="text-[10px] font-mono text-white/60 uppercase block tracking-wider text-emerald-100">EasyPaisa Account:</span>
                      <span className="font-mono font-bold block mt-0.5 text-sm">{paymentDetails?.easypaisa?.accountNumber || "0300-1234567"}</span>
                      <span className="font-sans text-[10px] text-white/85 block">{paymentDetails?.easypaisa?.accountTitle || "Ecom Network Admin Operations"}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-white/60 uppercase block tracking-wider text-emerald-100">JazzCash Account:</span>
                      <span className="font-mono font-bold block mt-0.5 text-xs">{paymentDetails?.jazzcash?.accountNumber || "0312-7654321"}</span>
                      <span className="font-sans text-[10px] text-white/85 block">{paymentDetails?.jazzcash?.accountTitle || "Ecom Network Core Tech"}</span>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <span className="text-[10px] font-mono text-white/60 uppercase block tracking-wider text-emerald-100 font-extrabold">Bank Transfer:</span>
                      <span className="font-sans font-bold text-xs block mt-0.5">{paymentDetails?.bank?.bankName || "Meezan Bank Limited"}</span>
                      <span className="font-mono font-extrabold text-sm block mt-0.5">{paymentDetails?.bank?.accountNumber || "0102-100239-01"}</span>
                      <span className="font-sans text-[10px] text-white/85 block">{paymentDetails?.bank?.accountTitle || "Ecom Network Accounts Inc."}</span>
                    </div>
                  </div>

                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10 mt-2">
                    <span className="text-[9px] font-bold block leading-relaxed uppercase tracking-wider text-emerald-100">⚠️ IMPORTANT DIRECTIVES:</span>
                    <p className="text-[9px] leading-relaxed text-white/90 mt-1 font-semibold">
                      Please transfer exactly <strong>Rs. 950 PKR per single E-Pin</strong>. Write down the precise bank Transaction ID. Requests are cleared inside 1 - 3 hours by manual audit.
                    </p>
                  </div>
                </div>

                {/* Interactive calculator */}
                <div className="bg-white p-5 rounded-3xl border border-gray-200">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-extrabold tracking-wider font-sans">Price Calculator Matrix</span>
                  <div className="mt-3 flex justify-between items-center bg-[#0B7A33]/5 p-3 rounded-xl border border-[#0B7A33]/15">
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">Total PKR due:</span>
                      <span className="text-[#0B7A33] font-black text-lg block font-mono">
                        {(Math.max(1, parseInt(pinQuantity || "1")) * 950).toLocaleString()} PKR
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">Unit Price:</span>
                      <span className="text-gray-900 font-black text-xs font-mono">950 PKR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Form Console */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm text-left">
                <div className="pb-4 border-b border-gray-100 mb-6">
                  <h3 className="font-black text-sm uppercase text-gray-900">SUBMIT TRANSFER SLIPS DETAILS</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Initialize backend administrative manual audit</p>
                </div>

                {pinRequestMessage && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-[#0B7A33] text-xs font-medium rounded-2xl font-sans">
                    {pinRequestMessage}
                  </div>
                )}
                {pinRequestError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-2xl font-sans">
                    {pinRequestError}
                  </div>
                )}

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!pinTransactionId.trim()) {
                    setPinRequestError("Please submit a valid verified Transaction ID.");
                    return;
                  }
                  setPinRequestLoading(true);
                  setPinRequestError(null);
                  setPinRequestMessage(null);
                  try {
                    const res = await fetch("/api/epins/request", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        quantity: parseInt(pinQuantity) || 1,
                        paymentMethod: pinPaymentMethod,
                        transactionId: pinTransactionId,
                        notes: pinNotes,
                        screenshotUrl: pinScreenshotUrl || undefined
                      })
                    });
                    const resData = await res.json();
                    if (!res.ok) {
                      throw new Error(resData.error || "Failed to catalog purchase request.");
                    }
                    setPinRequestMessage(resData.message || "✓ Purchase request successfully locked! Admin team notified.");
                    setPinTransactionId("");
                    setPinScreenshotUrl("");
                    setPinNotes("");
                    setPinQuantity("1");
                    // Reload Data
                    fetchEPinsData();
                  } catch (err: any) {
                    setPinRequestError(err.message || "Failed to cache E-Pin purchase ticket.");
                  } finally {
                    setPinRequestLoading(false);
                  }
                }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1.5 font-sans">Number of Pins *</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={pinQuantity}
                        onChange={(e) => setPinQuantity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:border-[#0B7A33] outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1.5 font-sans">Transfer Channel (Method) *</label>
                      <select
                        value={pinPaymentMethod}
                        onChange={(e: any) => setPinPaymentMethod(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:border-[#0B7A33] outline-none bg-white font-sans"
                      >
                        <option value="EasyPaisa">EasyPaisa</option>
                        <option value="JazzCash">JazzCash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="NayaPay">NayaPay</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1.5 font-sans">Unique Transaction ID (TID) *</label>
                      <input
                        type="text"
                        required
                        placeholder="TRX-102938481-9"
                        value={pinTransactionId}
                        onChange={(e) => setPinTransactionId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold uppercase focus:border-[#0B7A33] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1.5 font-sans">Screenshot Link (Optional)</label>
                      <input
                        type="text"
                        placeholder="https://postimg.cc/image-link"
                        value={pinScreenshotUrl}
                        onChange={(e) => setPinScreenshotUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#0B7A33] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase font-extrabold tracking-wider mb-1.5 font-sans">Accompanying payment notes / credentials</label>
                    <textarea
                      placeholder="Specify your sender account phone number, send-timestamp, or billing details..."
                      value={pinNotes}
                      rows={3}
                      onChange={(e) => setPinNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#0B7A33] outline-none resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pinRequestLoading}
                    className="w-full py-3 px-4 bg-[#0B7A33] hover:bg-[#12A84A] disabled:bg-gray-300 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer font-sans"
                  >
                    {pinRequestLoading ? "Locking Request Node..." : "Lock E-Pin Purchase"}
                  </button>
                </form>

                {/* Log list of requests for clarity */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h4 className="font-extrabold text-xs text-gray-900 uppercase mb-4">Request Logs Timeline</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-extrabold text-[10px] uppercase font-mono">
                          <th className="pb-2">Qty</th>
                          <th className="pb-2">Amount (PKR)</th>
                          <th className="pb-2">ID (TID)</th>
                          <th className="pb-2">Method</th>
                          <th className="pb-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {epinRequests.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-gray-400 font-sans">No purchase ticket history logged yet.</td>
                          </tr>
                        ) : (
                          epinRequests.map((req: any) => (
                            <tr key={req.id} className="hover:bg-gray-50/60">
                              <td className="py-2.5 font-bold font-mono text-gray-900">{req.quantity} Pins</td>
                              <td className="py-2.5 font-bold font-mono text-[#0B7A33]">{(req.quantity * 950).toLocaleString()} PKR</td>
                              <td className="py-2.5 font-mono text-[11px] text-gray-650 uppercase max-w-[120px] truncate" title={req.transactionId}>{req.transactionId}</td>
                              <td className="py-2.5 text-gray-500 font-medium font-sans">{req.paymentMethod}</td>
                              <td className="py-2.5 text-right">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                                  req.status === "Pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : req.status === "Approved"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {req.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            H. TAB LAYOUT: ⚙ CONFIGURATION DESK & SUPER-ADMIN PRIVILEGES
           ---------------------------------------------------- */}
        {activeMenu === "settings" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="text-left">
              <h2 className="font-sans text-2xl font-black text-gray-900 uppercase tracking-tight">Console Settings Terminal</h2>
              <p className="text-xs font-semibold text-gray-400 mt-1">Configure workspace components. Non-administrative users enjoy lock assurance structures.</p>
            </div>

            {user.role !== "admin" ? (
              <div className="border rounded-3xl p-10 bg-white shadow-xs max-w-sm mx-auto text-center font-mono">
                <CheckCircle size={32} className="text-[#0B7A33] mx-auto mb-4" />
                <h3 className="text-gray-900 font-extrabold text-xs uppercase">Security configuration active</h3>
                <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">No custom settings required. Your 3-tier drop-shipping accounting ledger is fully automated under professional SSL configurations.</p>
              </div>
            ) : (
              // ----------------------------------------------------------------------
              // SUPER ADMINISTRATOR UNIFIED OFFICE
              // ----------------------------------------------------------------------
              <div className="space-y-8 font-mono text-xs">
                
                {/* Admin sub-menu select */}
                <div className="flex flex-wrap gap-2 border-b pb-3 mb-6 font-mono text-xs text-left">
                  {[
                    { id: "analytics", label: "Consolidated Analytics", icon: "TrendingUp" },
                    { id: "catalog", label: "Catalog & Warehousing", icon: "ShoppingBag" },
                    { id: "p-orders", label: "Warehouse Orders Queue", icon: "Package" },
                    { id: "users", label: "Members Database", icon: "Users" },
                    { id: "withdrawals", label: "Cashier Disbursements Checks", icon: "Banknote" }
                  ].map((tb) => (
                    <button
                      key={tb.id}
                      onClick={() => setAdmActiveTab(tb.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-[10px] font-mono font-extrabold uppercase border cursor-pointer ${
                        admActiveTab === tb.id 
                          ? "bg-[#0B7A33] text-white border-transparent" 
                          : "bg-gray-50 text-gray-500 hover:text-gray-900 border-gray-200"
                      }`}
                    >
                      {tb.label}
                    </button>
                  ))}
                </div>

                {/* Sub Tab: Admin Summary */}
                {admActiveTab === "analytics" && adminAnalytics && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                    
                    {/* Level override editor */}
                    <div className="p-6 bg-white border rounded-3xl space-y-4">
                      <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight">Configuration Rates Editor</h3>
                      <p className="text-[10px] text-gray-450 leading-relaxed">Control percent distributions allocated when an item checkout occurs.</p>

                      {adminConfigSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-[#0B7A33] font-bold rounded-xl text-[10px]">
                          ✓ Rates updated and synchronized successfully!
                        </div>
                      )}

                      <form onSubmit={handleAdminConfigUpdate} className="space-y-4 font-mono font-bold">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col">
                            <label className="text-[9px] text-gray-400 uppercase">Level 1 rate (%)</label>
                            <input
                              type="number"
                              required
                              value={adminConfigL1}
                              onChange={(e) => setAdminConfigL1(Number(e.target.value))}
                              className="p-2.5 bg-[#F8FAFC] border rounded-lg text-xs"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-[9px] text-gray-400 uppercase">Level 2 rate (%)</label>
                            <input
                              type="number"
                              required
                              value={adminConfigL2}
                              onChange={(e) => setAdminConfigL2(Number(e.target.value))}
                              className="p-2.5 bg-[#F8FAFC] border rounded-lg text-xs"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-[9px] text-gray-400 uppercase">Level 3 rate (%)</label>
                            <input
                              type="number"
                              required
                              value={adminConfigL3}
                              onChange={(e) => setAdminConfigL3(Number(e.target.value))}
                              className="p-2.5 bg-[#F8FAFC] border rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="disableMLM"
                            checked={adminDisableMLM}
                            onChange={(e) => setAdminDisableMLM(e.target.checked)}
                            className="w-4 h-4 text-[#0B7A33] border-gray-300 rounded focus:ring-[#0B7A33]"
                          />
                          <label htmlFor="disableMLM" className="text-[10px] text-gray-600 uppercase font-black">Disable Multi-Level commissions (Level 1 direct only)</label>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-[#0B7A33] hover:bg-[#12A84A] text-white rounded-xl text-[10px] font-mono uppercase tracking-wider cursor-pointer"
                        >
                          Synchronize Commission Rates parameters
                        </button>
                      </form>
                    </div>

                    {/* Stats bento */}
                    <div className="p-6 bg-white border rounded-3xl space-y-4 text-xs font-bold text-gray-700">
                      <h3 className="text-sm font-black uppercase text-gray-900 tracking-tight">Co-Op Network Platform Stats</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                        <div className="p-4 bg-[#F8FAFC] border rounded-xl">
                          <span className="text-gray-400 block text-[9.5px]">TOTAL MEMBERS</span>
                          <span className="text-lg text-gray-950 font-black">{adminAnalytics.stats.totalUsers} profiles</span>
                        </div>
                        <div className="p-4 bg-[#F8FAFC] border rounded-xl">
                          <span className="text-[#0B7A33] block text-[9.5px]">✓ ACTIVE MEMBERS</span>
                          <span className="text-lg text-[#0B7A33] font-black">{adminAnalytics.stats.activeMembers} profiles</span>
                        </div>
                        <div className="p-4 bg-[#F8FAFC] border rounded-xl">
                          <span className="text-amber-600 block text-[9.5px]">PENDING INACTIVE MEMBERS</span>
                          <span className="text-lg text-amber-600 font-black">{adminAnalytics.stats.inactiveMembers} profiles</span>
                        </div>
                        <div className="p-4 bg-[#F8FAFC] border rounded-xl">
                          <span className="text-gray-400 block text-[9.5px]">TOTAL E-PINS GENERATED/SOLD</span>
                          <span className="text-lg text-gray-950 font-black">{adminAnalytics.stats.totalPinsSold} units</span>
                        </div>
                        <div className="p-4 bg-[#F8FAFC] border rounded-xl col-span-1 md:col-span-2">
                          <span className="text-emerald-700 block text-[9.5px]">TOTAL PLATFORM REVENUE</span>
                          <span className="text-xl text-emerald-700 font-extrabold font-mono">{(adminAnalytics.stats.totalRevenue ?? 0).toLocaleString()} PKR</span>
                          <span className="text-[9px] text-gray-400 font-normal block mt-1">(Pins sold * 950 PKR + retail store deliveries volume)</span>
                        </div>
                        <div className="p-4 bg-[#F8FAFC] border rounded-xl">
                          <span className="text-gray-450 block text-[9.5px]">TOTAL PAIR INCOME DISTRIBUTED</span>
                          <span className="text-sm text-gray-900 font-extrabold">{(adminAnalytics.stats.totalPairIncomePaid ?? 0).toLocaleString()} PKR</span>
                        </div>
                        <div className="p-4 bg-[#F8FAFC] border rounded-xl">
                          <span className="text-gray-450 block text-[9.5px]">TOTAL BONUSES DISBURSED</span>
                          <span className="text-sm text-gray-900 font-extrabold">{(adminAnalytics.stats.totalBonusPaid ?? 0).toLocaleString()} PKR</span>
                        </div>
                        <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl col-span-1 md:col-span-2">
                          <span className="text-orange-700 block text-[9.5px]">PENDING WITHDRAWALS OUTSTANDING</span>
                          <span className="text-lg text-orange-700 font-black">{(adminAnalytics.stats.totalPendingWithdrawalsAmount ?? 0).toLocaleString()} PKR</span>
                          <span className="text-[9px] text-orange-500 font-medium block mt-1">({adminAnalytics.stats.pendingWithdrawalsCount} pending ticket requests)</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Sub Tab: Admin Catalog management */}
                {admActiveTab === "catalog" && adminAnalytics && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                    
                    {/* Add Category */}
                    <div className="lg:col-span-4 p-6 bg-[#F8FAFC] border rounded-3xl space-y-4">
                      <h3 className="text-xs font-black uppercase text-gray-900 tracking-tight">Catalog categories</h3>
                      
                      <form onSubmit={handleAdminAddCategory} className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="e.g. Wellness"
                          className="flex-1 p-2 bg-white border rounded-lg text-xs"
                        />
                        <button type="submit" className="px-3 bg-[#0B7A33] text-white rounded-lg font-mono text-[10px] font-bold cursor-pointer">ADD</button>
                      </form>

                      <div className="space-y-1 pt-2">
                        {categories.map((c) => (
                          <div key={c.id} className="p-2 bg-white border rounded-lg flex justify-between font-mono text-[10px] font-bold text-gray-600">
                            <span>{c.name}</span>
                            <span className="text-gray-400 uppercase">Slug: {c.slug}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Product */}
                    <div className="lg:col-span-8 p-6 bg-white border rounded-3xl space-y-4 font-bold">
                      <h3 className="text-xs font-black uppercase text-gray-900 tracking-tight">Add physical commodity item</h3>
                      
                      <form onSubmit={handleAdminAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold font-mono">
                        <div className="flex flex-col">
                          <label className="text-[8px] text-gray-400 uppercase">Commodity Title</label>
                          <input
                            type="text"
                            required
                            value={newProductName}
                            onChange={(e) => setNewProductName(e.target.value)}
                            placeholder="Pashmina Wool Jacket"
                            className="p-2.5 bg-[#F8FAFC] border rounded-lg outline-none text-xs"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[8px] text-gray-400 uppercase">Category Designation</label>
                          <select
                            value={newProductCategory}
                            onChange={(e) => setNewProductCategory(e.target.value)}
                            className="p-2.5 bg-[#F8FAFC] border rounded-lg text-xs font-bold"
                          >
                            <option value="Fashion">Fashion</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Wellness">Wellness</option>
                          </select>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[8px] text-gray-400 uppercase">Retail Price (PKR)</label>
                          <input
                            type="number"
                            required
                            value={newProductPrice}
                            onChange={(e) => setNewProductPrice(e.target.value)}
                            placeholder="6500"
                            className="p-2.5 bg-[#F8FAFC] border rounded-lg text-xs"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[8px] text-gray-400 uppercase">Stock Quantities</label>
                          <input
                            type="number"
                            required
                            value={newProductStock}
                            onChange={(e) => setNewProductStock(e.target.value)}
                            placeholder="50"
                            className="p-2.5 bg-[#F8FAFC] border rounded-lg text-xs"
                          />
                        </div>
                        <div className="flex flex-col sm:col-span-2">
                          <label className="text-[8px] text-gray-400 uppercase">Description Specs</label>
                          <textarea
                            rows={2}
                            value={newProductDesc}
                            onChange={(e) => setNewProductDesc(e.target.value)}
                            placeholder="Delivered materials, weights specifications..."
                            className="p-2.5 bg-[#F8FAFC] border rounded-lg text-xs resize-none outline-none"
                          />
                        </div>
                        <div className="flex flex-col sm:col-span-2">
                          <label className="text-[8px] text-gray-400 uppercase">Product Image URL (Optional)</label>
                          <input
                            type="url"
                            value={newProductImg}
                            onChange={(e) => setNewProductImg(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="p-2.5 bg-[#F8FAFC] border rounded-lg text-xs outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="sm:col-span-2 py-3 bg-[#0B7A33] hover:bg-[#12A84A] text-white rounded-xl uppercase text-[10px] cursor-pointer"
                        >
                          Commit e-commerce product in inventories
                        </button>

                      </form>
                    </div>

                  </div>
                )}

                {/* Sub Tab: Admin Orders status modification */}
                {admActiveTab === "p-orders" && adminAnalytics && (
                  <div className="bg-white border rounded-3xl p-6 text-left space-y-4">
                    <h3 className="text-xs font-black uppercase text-gray-900 tracking-tight">Active Platform Shipments Queue</h3>
                    
                    {adminAnalytics.orders.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 font-mono text-xs">No customer checkouts recorded globally yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs">
                          <thead>
                            <tr className="border-b text-gray-450 uppercase text-[9px] font-black">
                              <th className="pb-2">Reference ID</th>
                              <th className="pb-2">Affiliate Creator</th>
                              <th className="pb-2">Items Count</th>
                              <th className="pb-2">Invoice Amount</th>
                              <th className="pb-2">Status</th>
                              <th className="pb-2 text-right">Warehousing Clearness</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminAnalytics.orders.map((o: any) => (
                              <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50/50 font-bold">
                                <td className="py-3">#{o.id}</td>
                                <td className="py-3">@{o.username}</td>
                                <td className="py-3">{o.items.length} unique items</td>
                                <td className="py-3 text-[#0B7A33]">{o.totalAmount.toLocaleString()} PKR</td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[8px] border font-black uppercase ${
                                    o.status === "Delivered" ? "bg-emerald-50 text-emerald-800 border-emerald-100" :
                                    o.status === "Pending" ? "bg-amber-50 text-amber-800 border-amber-100" :
                                    "bg-blue-50 text-blue-800 border-blue-100"
                                  }`}>
                                    {o.status}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  <div className="flex gap-1 justify-end">
                                    {["Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                                      <button
                                        key={st}
                                        onClick={() => handleAdminUpdateOrderStatus(o.id, st)}
                                        className={`px-1.5 py-1 text-[8px] font-mono font-bold rounded uppercase cursor-pointer border ${
                                          o.status === st 
                                            ? "bg-gray-150 text-gray-900 border-gray-300 shadow-inner" 
                                            : "bg-white text-gray-500 hover:text-gray-900 border-gray-200"
                                        }`}
                                      >
                                        {st}
                                      </button>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub Tab: Users database lists */}
                {admActiveTab === "users" && adminAnalytics && (
                  <div className="bg-white border rounded-3xl p-6 text-left space-y-4">
                    <h3 className="text-xs font-black uppercase text-[#0B7A33]">Consolidated co-op partner nodes matrix</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs text-gray-700">
                        <thead>
                          <tr className="border-b text-gray-450 uppercase text-[9px] font-black">
                            <th className="pb-2">User UID</th>
                            <th className="pb-2">Affiliate handles</th>
                            <th className="pb-2">Main Email</th>
                            <th className="pb-2">Status Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminAnalytics.users.map((u: any) => (
                            <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50/50 font-bold">
                              <td className="py-3 text-gray-400">#{u.id}</td>
                              <td className="py-3 text-gray-900">
                                @{u.username}
                                <span className="block text-[8px] text-gray-450 font-normal">{u.name} • {u.rank}</span>
                              </td>
                              <td className="py-3 font-normal text-gray-500">{u.email}</td>
                              <td className="py-3 text-xs">
                                <span className={`px-2 py-0.5 rounded text-[8px] border font-black uppercase ${
                                  u.status === "active" ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-red-50 text-red-800 border-red-100"
                                }`}>
                                  {u.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub Tab: Admin Withdrawal Clearances */}
                {admActiveTab === "withdrawals" && adminAnalytics && (
                  <div className="bg-white border rounded-3xl p-6 text-left space-y-4">
                    <h3 className="text-xs font-black uppercase text-gray-900 tracking-tight">Disburse available payouts</h3>
                    
                    {adminAnalytics.withdrawals.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 font-mono text-xs">No payouts clearance logs generated pending approvals currently.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs text-gray-700">
                          <thead>
                            <tr className="border-b text-gray-400 uppercase text-[9px] tracking-wider text-left font-black">
                              <th className="pb-2">Requested User</th>
                              <th className="pb-2">Method</th>
                              <th className="pb-2">Details Account</th>
                              <th className="pb-2">Payout Amount</th>
                              <th className="pb-2">Status</th>
                              <th className="pb-2 text-right">Clearance Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminAnalytics.withdrawals.map((w: any) => (
                              <tr key={w.id} className="border-b last:border-0 hover:bg-gray-50/50 font-bold">
                                <td className="py-3">@{w.username}</td>
                                <td className="py-3 text-gray-900">{w.method}</td>
                                <td className="py-3 text-gray-500 max-w-xs truncate font-medium">{w.details}</td>
                                <td className="py-3 text-[#0B7A33]">-{w.amount.toLocaleString()} PKR</td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-[8px] border font-black uppercase ${
                                    w.status === "Paid" ? "bg-emerald-50 text-[#0B7A33] border-emerald-100" : "bg-amber-50 text-amber-800 border-amber-100"
                                  }`}>
                                    {w.status}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  {w.status === "Pending" ? (
                                    <div className="flex gap-1 justify-end">
                                      <button
                                        onClick={() => handleAdminClearanceWithdrawal(w.id, "Approved")}
                                        className="px-2.5 py-1 text-[8px] uppercase font-mono font-bold bg-[#0B7A33] hover:bg-[#12A84A] text-white rounded cursor-pointer"
                                      >
                                        Disburse Paid
                                      </button>
                                      <button
                                        onClick={() => handleAdminClearanceWithdrawal(w.id, "Rejected")}
                                        className="px-2.5 py-1 text-[8px] uppercase font-mono font-bold bg-red-50 text-red-750 border border-red-200 rounded cursor-pointer animate-pulse"
                                      >
                                        DECLINE
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[9px] text-gray-450 italic">Completed / Settled</span>
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

              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
};
