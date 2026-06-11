import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, Heart, Search, Trash2, Filter, ArrowRight, 
  ChevronRight, Star, Info, CheckCircle, Truck, User, MapPin, 
  ArrowLeft, CreditCard, Sparkles, RefreshCw, Layers
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  images: string[];
  category: string;
  supplier_price: number;
  markup?: number;
  price: number; // selling price
  stock: number;
  status: string;
  supplier?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

interface Order {
  id: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  customerDetails: {
    name: string;
    phone: string;
    email: string;
    city: string;
    address: string;
  };
  payMethod: string;
}

interface ShopStorefrontProps {
  navigate: (page: string) => void;
  token?: string | null;
}

export const ShopStorefront: React.FC<ShopStorefrontProps> = ({ navigate, token }) => {
  // Store navigation tab
  const [activeTab, setActiveTab] = useState<"home" | "products" | "detail" | "cart" | "checkout" | "tracking" | "dashboard">("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Persistent items (using localized browser storage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("ecom_store_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("ecom_store_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Server state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [resellerCode, setResellerCode] = useState<string>(() => {
    return localStorage.getItem("ecom_reseller_code") || "ADMIN";
  });

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedSort]);

  // Track & Dashboard states
  const [trackingPhone, setTrackingPhone] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [trackedOrders, setTrackedOrders] = useState<Order[]>([]);
  const [trackingStatusMsg, setTrackingStatusMsg] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Checkout inputs
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("Lahore");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [payMethod, setPayMethod] = useState("JazzCash");
  const [checkoutSuccessMsg, setCheckoutSuccessMsg] = useState<string | null>(null);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string | null>(null);

  // Load backend catalog
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load storefront products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("ecom_store_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("ecom_store_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("ecom_reseller_code", resellerCode);
  }, [resellerCode]);

  // Derived catalogs
  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  
  const getFilteredProducts = () => {
    let result = [...products];

    // Status filter - only active
    result = result.filter(p => p.status !== "Hidden");

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sort order
    if (selectedSort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  };

  const filteredProducts = getFilteredProducts();
  const PRODUCTS_PER_PAGE = 24;
  const paginatedProducts = filteredProducts.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;

  // Wishlist controls
  const toggleWishlist = (product: Product) => {
    if (wishlist.some(p => p.id === product.id)) {
      setWishlist(wishlist.filter(p => p.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Cart controls
  const addToCart = (product: Product, quantity = 1, showFeedback = true) => {
    if (product.stock <= 0) {
      alert("This product is currently out of stock!");
      return;
    }
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity = Math.min(product.stock, updated[existingIndex].quantity + quantity);
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity }]);
    }
    if (showFeedback) {
      setActiveTab("cart");
    }
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    const matchedIdx = cart.findIndex(it => it.product.id === productId);
    if (matchedIdx > -1) {
      const maxAvailable = cart[matchedIdx].product.stock;
      const updated = [...cart];
      if (qty <= 0) {
        setCart(cart.filter(item => item.product.id !== productId));
      } else {
        updated[matchedIdx].quantity = Math.min(maxAvailable, qty);
        setCart(updated);
      }
    }
  };

  const getCartTotal = () => {
    return cart.reduce((accum, item) => accum + (item.product.price * item.quantity), 0);
  };

  // Tracking query
  const handleTrackSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingPhone && !trackingId) {
      setTrackingStatusMsg("Please input either your phone number or Order Reference ID.");
      return;
    }
    setTrackingLoading(true);
    setTrackingStatusMsg("");
    try {
      const queryParams = new URLSearchParams();
      if (trackingPhone) queryParams.set("phone", trackingPhone);
      if (trackingId) queryParams.set("id", trackingId);

      const res = await fetch(`/api/public/orders/track?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTrackedOrders(data.orders || []);
        if (!data.orders || data.orders.length === 0) {
          setTrackingStatusMsg("No orders identified with those credentials.");
        }
      } else {
        setTrackingStatusMsg("Order tracking system error. Re-try later.");
      }
    } catch {
      setTrackingStatusMsg("Network or connection failure.");
    } finally {
      setTrackingLoading(false);
    }
  };

  // Checkout handle code
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your card is currently empty.");
      return;
    }
    try {
      const orderPayload = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        customerDetails: {
          name: checkoutName,
          phone: checkoutPhone,
          email: checkoutEmail || `${checkoutName.trim().toLowerCase().replace(/\s+/g, "")}@example.com`,
          city: checkoutCity,
          address: checkoutAddress
        },
        payMethod,
        resellerCode
      };

      const res = await fetch("/api/public/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const data = await res.json();
        setLastPlacedOrderId(data.order.id);
        setCheckoutSuccessMsg("🚀 Your purchase order was compiled successfully!");
        setCart([]); // Clear cart
        setTrackingId(data.order.id);
        setTrackingPhone(checkoutPhone);
        // Sync products catalog again (stock updated)
        fetchProducts();
      } else {
        const errData = await res.json();
        alert(`❌ Checkout faulty: ${errData.error || "Please verify credentials."}`);
      }
    } catch (err) {
      alert("⚠️ Checkout network request failure.");
    }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen text-gray-900 pb-20 pt-24 font-sans text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* UPPER ANCHOR: Reseller Affiliate Frame */}
        <div className="mb-6 py-3 px-5 rounded-2xl bg-white border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#0B7A33]">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase text-gray-400 tracking-widest block">Active Referral Sales Node</span>
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mt-0.5">
                <span>Credited Affiliate Link Code:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-[#0B7A33] font-mono font-black">{resellerCode || "ADMIN"}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-2">
            <span className="text-[10px] text-gray-400 font-medium hidden lg:inline">Want to test specific affiliate override? Enter referral code:</span>
            <input
              type="text"
              placeholder="Sponsor ID (e.g. ADMIN)"
              value={resellerCode}
              onChange={(e) => setResellerCode(e.target.value.toUpperCase())}
              className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-xs font-mono font-bold uppercase text-[#0B7A33] focus:border-[#0B7A33] w-36"
            />
            <button 
              onClick={() => {
                setResellerCode("ADMIN");
              }}
              title="Reset code"
              className="p-1 px-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-[10px] font-bold text-gray-500 cursor-pointer"
            >
              Default
            </button>
          </div>
        </div>

        {/* SHOP SUB-NAVIGATION BAR */}
        <div className="bg-white border border-gray-200 rounded-3xl p-3 shadow-md flex items-center justify-between gap-4 flex-wrap mb-8">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => { setActiveTab("home"); setSelectedProduct(null); }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "home" ? "bg-[#0B7A33] text-white" : "hover:bg-gray-100 text-gray-650"
              }`}
            >
              Shop Home
            </button>
            <button
              onClick={() => { setActiveTab("products"); setSelectedProduct(null); }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "products" ? "bg-[#0B7A33] text-white" : "hover:bg-gray-100 text-gray-650"
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "tracking" ? "bg-[#0B7A33] text-white" : "hover:bg-gray-100 text-gray-650"
              }`}
            >
              Order Tracking
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "dashboard" ? "bg-[#0B7A33] text-white" : "hover:bg-gray-100 text-gray-650"
              }`}
            >
              My Hub ({wishlist.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setActiveTab("cart")}
                className="p-2.5 rounded-full hover:bg-gray-100 text-gray-700 relative cursor-pointer"
              >
                <ShoppingBag size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#12A84A] text-white text-[10px] font-black rounded-full flex items-center justify-center border border-white">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TRANSITIONAL VIEWS SWAPPER */}
        {/* ======================================================== */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: SHOP HOME */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* HERO BANNER */}
              <div className="bg-radial from-[#12A84A]/10 to-[#0B7A33]/5 rounded-[30px] border border-emerald-100 p-8 md:p-14 text-left relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0B7A33] border border-emerald-100 text-[10px] font-black tracking-widest uppercase font-mono">
                    <Sparkles size={12} /> YourMart Verified Dropshipping
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
                    Direct E-Commerce Pipeline to Pakistan
                  </h1>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    Sourced straight from YourMart wholesalers. Every product features transparent warranties, verified nationwide stocks, and pre-adjusted affiliate commissions!
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab("products")}
                      className="px-6 py-3 rounded-2xl bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition"
                    >
                      Browse Catalogs <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => setActiveTab("tracking")}
                      className="px-5 py-3 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider cursor-pointer transition"
                    >
                      Track Order Status
                    </button>
                  </div>
                </div>

                <div className="relative flex-none hidden md:block">
                  <div className="w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl absolute top-10 right-10" />
                  <div className="w-48 h-48 rounded-3xl border-4 border-white shadow-xl rotate-3 bg-[#0B7A33]/15 flex items-center justify-center overflow-hidden">
                    <ShoppingBag size={80} className="text-[#0B7A33]" />
                  </div>
                </div>
              </div>

              {/* BENTO FEATURE SECTIONS */}
              <div>
                <h3 className="text-lg font-black text-gray-950 uppercase tracking-wider mb-6">Explore Curated Hot Collections</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* FEATURED: MOBILES & DEVICES */}
                  <div onClick={() => { setSelectedCategory("Mobile Phones"); setActiveTab("products"); }} className="p-6 bg-white rounded-3xl border border-gray-200 hover:border-[#0B7A33] shadow-xs hover:shadow-md transition cursor-pointer text-left space-y-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">Featured Technology</h4>
                      <p className="text-[11px] text-gray-400 mt-1 leading-normal">Premium original smartphones, brand new storage gadgets, and power chargers.</p>
                    </div>
                  </div>

                  {/* FEATURED: NEW ARRIVALS */}
                  <div onClick={() => { setSelectedCategory("Lifestyle Products"); setActiveTab("products"); }} className="p-6 bg-white rounded-3xl border border-gray-200 hover:border-[#0B7A33] shadow-xs hover:shadow-md transition cursor-pointer text-left space-y-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">Lifestyle & Smart Gear</h4>
                      <p className="text-[11px] text-gray-400 mt-1 leading-normal">Smart wearable watches, AirPods headsets, and smart-home gadgets.</p>
                    </div>
                  </div>

                  {/* FEATURED: BEST SELLERS */}
                  <div onClick={() => { setSelectedCategory("all"); setSelectedSort("price-desc"); setActiveTab("products"); }} className="p-6 bg-white rounded-3xl border border-gray-200 hover:border-[#0B7A33] shadow-xs hover:shadow-md transition cursor-pointer text-left space-y-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">Top-Margin Clearance</h4>
                      <p className="text-[11px] text-gray-400 mt-1 leading-normal">Our highest margin wholesale offerings, direct from physical supplier warehouses.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* GRID: TRENDING PRODUCTS SECTION */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-gray-950 uppercase tracking-wider">Aesthetic Best Sellers</h3>
                    <p className="text-[11px] text-gray-400 mt-1">Ready to dispatch. Calculated with strict automated +500 PKR wholesale threshold rules.</p>
                  </div>
                  <button onClick={() => { setSelectedCategory("all"); setActiveTab("products"); }} className="text-xs font-bold text-[#0B7A33] hover:underline flex items-center gap-1 cursor-pointer">
                    View Complete Catalog ({products.length}) <ChevronRight size={14} />
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-12 text-xs font-mono font-bold text-gray-400">
                    Hydrating YourMart catalog feed...
                  </div>
                ) : products.length === 0 ? (
                  <div className="p-10 rounded-2xl border-2 border-dashed border-gray-200 text-center text-xs font-semibold text-gray-400">
                    No active dropshipping products synchronized. Go to Admin Panel to sync first!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 8).map(prod => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onView={(p) => { setSelectedProduct(p); setActiveTab("detail"); }}
                        onAddToBag={(p) => addToCart(p, 1)}
                        wishlist={wishlist}
                        onToggleWishlist={toggleWishlist}
                      />
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* TAB 2: PRODUCTS CATALOG STREAM */}
          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* FILTERING CONTROLS CARD */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 text-left">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                  
                  {/* Search bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search items, specs, categories or brands..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold outline-none text-[#0B7A33] focus:border-[#0B7A33]"
                    />
                  </div>

                  {/* Filters Selection */}
                  <div className="flex items-center gap-3 flex-wrap">
                    
                    {/* Category Sorter */}
                    <div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="py-2 px-3 border border-gray-200 bg-white rounded-xl text-xs font-mono font-bold text-gray-700 focus:border-[#0B7A33]"
                      >
                        <option value="all">📁 All Categories</option>
                        {categories.filter(c => c !== "all").map(c => (
                          <option key={c} value={c}>📁 {c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sorting selector */}
                    <div>
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="py-2 px-3 border border-gray-200 bg-white rounded-xl text-xs font-mono font-bold text-gray-700 focus:border-[#0B7A33]"
                      >
                        <option value="featured">✨ Sort: Featured</option>
                        <option value="price-asc">📈 Price: Low to High</option>
                        <option value="price-desc">📉 Price: High to Low</option>
                        <option value="alphabetical">🔤 Name: A - Z</option>
                      </select>
                    </div>

                    {/* Clear button */}
                    {(searchQuery || selectedCategory !== "all") && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                        }}
                        className="text-xs font-mono font-bold text-red-600 hover:underline"
                      >
                        Reset Filters
                      </button>
                    )}

                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                  <span>Displaying <strong className="text-gray-700 font-black">{filteredProducts.length}</strong> of {products.length} products matched</span>
                  <span className="font-mono text-[10px] uppercase">NATIONWIDE SHIPPING ACTIVE</span>
                </div>
              </div>

              {/* PRODUCTS GRID */}
              {loading ? (
                <div className="text-center py-20 text-xs font-mono font-black text-[#0B7A33]">
                  Synchronizing product structures...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-20 text-center bg-white rounded-[24px] border border-gray-200">
                  <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"><Info size={20} /></div>
                  <h4 className="font-bold text-gray-700 mt-3 text-sm">No synchronized products match filter.</h4>
                  <p className="text-xs text-gray-400 mt-1">Try resetting search string or category overrides.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginatedProducts.map(prod => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onView={(p) => { setSelectedProduct(p); setActiveTab("detail"); }}
                        onAddToBag={(p) => addToCart(p, 1)}
                        wishlist={wishlist}
                        onToggleWishlist={toggleWishlist}
                      />
                    ))}
                  </div>

                  {/* MODERN PAGINATION BAR */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
                      <button
                        onClick={() => {
                          setPage(prev => Math.max(prev - 1, 1));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-all duration-150"
                      >
                        Previous
                      </button>
                      <span className="text-xs font-bold font-mono text-gray-500">
                        Page <strong className="text-gray-900">{page}</strong> of <strong className="text-gray-900">{totalPages}</strong>
                      </span>
                      <button
                        onClick={() => {
                          setPage(prev => Math.min(prev + 1, totalPages));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-all duration-150"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          )}

          {/* TAB 3: PRODUCT DETAIL LAYOUT */}
          {activeTab === "detail" && selectedProduct && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* Back selector */}
              <button
                onClick={() => setActiveTab("products")}
                className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-[#0B7A33] cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to Products Catalog
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-10 rounded-[30px] border border-gray-200 shadow-sm">
                
                {/* Images grid (Left column) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                    {selectedProduct.images && selectedProduct.images[0] ? (
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag size={80} className="text-gray-300" />
                    )}
                  </div>

                  {/* Multi-image preview selector mock */}
                  <div className="grid grid-cols-4 gap-2">
                    {[selectedProduct.images?.[0], selectedProduct.images?.[0]].filter(Boolean).map((img, index) => (
                      <div key={index} className="aspect-square bg-gray-50 border border-gray-150 rounded-xl overflow-hidden cursor-pointer">
                        <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    <div className="aspect-square bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-bold font-mono">
                      Pack +1
                    </div>
                  </div>
                </div>

                {/* Specific descriptions (Right column) */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-500 font-mono font-bold text-[9px] uppercase tracking-wider">{selectedProduct.category}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#0B7A33] border border-emerald-100 font-mono font-black text-[9px]">YOURMART Dropship</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-tight">{selectedProduct.name}</h2>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" className="text-gray-200" />
                      </div>
                      <span className="text-gray-400 font-semibold">(14 client reviews)</span>
                    </div>
                  </div>

                  <div className="py-4 border-y border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider block">Selling Price (Automated)</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-2xl font-mono font-black text-[#0B7A33]">Rs. {selectedProduct.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 font-mono line-through">Rs. {(selectedProduct.price + 599).toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider block">Warranty / Fulfillment</span>
                      <span className="text-xs font-bold text-gray-700 block mt-0.5">7 days replacement policy</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <h4 className="font-extrabold text-gray-900 uppercase">Description</h4>
                    <p className="leading-relaxed">{selectedProduct.description || "Fully functional high-quality hardware directly sourced through wholesale importing contracts. Each item complies with safety parameters and packaging specs for guaranteed delivery."}</p>
                  </div>

                  {/* Specifications */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-2 text-xs">
                    <h4 className="font-extrabold text-gray-950 uppercase tracking-wider text-[10px]">Specifications Detail</h4>
                    <div className="grid grid-cols-2 gap-y-1.5 text-[11px] font-mono">
                      <span className="text-gray-400 font-sans">Warehousing Node</span>
                      <span className="text-gray-700 font-semibold text-right">LHR-YourMart</span>

                      <span className="text-gray-400 font-sans">Payment Channel</span>
                      <span className="text-gray-700 font-semibold text-right">Cash On Delivery / JazzCash</span>

                      <span className="text-gray-400 font-sans">Stock Level</span>
                      <span className="text-gray-700 font-black text-right text-emerald-600">
                        {selectedProduct.stock > 0 ? `${selectedProduct.stock} items ready` : "Out of Stock"}
                      </span>

                      <span className="text-gray-400 font-sans">Markup Yield Code</span>
                      <span className="text-gray-705 font-bold text-right">ECOM-NET-SECURE</span>
                    </div>
                  </div>

                  {/* Buying Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct, 1, false);
                        setActiveTab("cart");
                      }}
                      className="flex-1 py-3 px-6 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-black uppercase tracking-wider transition text-center cursor-pointer"
                    >
                      Buy Instantly
                    </button>
                    <button
                      onClick={() => addToCart(selectedProduct, 1, true)}
                      className="flex-1 py-3 px-6 rounded-2xl bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-black uppercase tracking-wider transition text-center cursor-pointer"
                    >
                      Add To Shopping Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      className={`p-3 rounded-2xl border transition cursor-pointer ${
                        wishlist.some(p => p.id === selectedProduct.id)
                          ? "bg-red-50 text-red-500 border-red-100"
                          : "border-gray-200 text-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <Heart size={18} fill={wishlist.some(p => p.id === selectedProduct.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                </div>
              </div>

              {/* Related Products Grid */}
              <div className="space-y-5">
                <h3 className="text-base font-black text-gray-900 uppercase tracking-widest text-left">We Think You'll Love These</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products
                    .filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category)
                    .slice(0, 4)
                    .map(related => (
                      <ProductCard
                        key={related.id}
                        product={related}
                        onView={(p) => { setSelectedProduct(p); setActiveTab("detail"); }}
                        onAddToBag={(p) => addToCart(p, 1)}
                        wishlist={wishlist}
                        onToggleWishlist={toggleWishlist}
                      />
                    ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 4: SHOPPING CART */}
          {activeTab === "cart" && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              <h2 className="text-xl font-black text-gray-900 uppercase">Your Shopping Cart</h2>

              {cart.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700 text-sm">Shopping bag is empty</h4>
                    <p className="text-xs text-gray-400 mt-1">Snoop around our active catalogs and add markup products instantly!</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("products")}
                    className="px-5 py-2.5 rounded-xl bg-[#0B7A33] text-white text-xs font-bold uppercase tracking-wider cursor-pointer font-mono"
                  >
                    Go browse products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Cart items list */}
                  <div className="lg:col-span-8 bg-white p-6 rounded-[24px] border border-gray-200 shadow-xs space-y-4">
                    <div className="divide-y divide-gray-100">
                      {cart.map(item => (
                        <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                          
                          <div className="flex items-center gap-4">
                            {item.product.images?.[0] ? (
                              <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 object-cover rounded-xl border border-gray-100" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300"><ShoppingBag size={20} /></div>
                            )}

                            <div>
                              <h5 className="font-black text-xs text-gray-950 truncate max-w-[200px] sm:max-w-xs">{item.product.name}</h5>
                              <span className="text-[9px] font-mono font-bold text-gray-400 block uppercase">{item.product.category}</span>
                              <span className="text-[10px] text-[#0B7A33] font-bold block mt-1 font-mono">Rs. {item.product.price.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                            <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                className="px-2.5 py-0.5 text-xs text-gray-500 font-extrabold hover:bg-gray-200 rounded cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-3 py-0.5 text-xs font-black font-mono text-gray-800">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                className="px-2.5 py-0.5 text-xs text-gray-500 font-extrabold hover:bg-gray-200 rounded cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="block text-[11px] font-mono font-black text-gray-800">
                                Rs. {(item.product.price * item.quantity).toLocaleString()}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, 0)}
                                className="text-[10px] font-bold text-red-500 hover:underline mt-1 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={10} /> Delete
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary panel */}
                  <div className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-gray-200 shadow-xs space-y-4">
                    <h4 className="font-black text-xs uppercase text-gray-800 tracking-wider">Purchase Summary</h4>
                    
                    <div className="space-y-2 text-xs divide-y divide-gray-150 pt-2">
                      <div className="flex justify-between items-center py-2 first:pt-0">
                        <span className="text-gray-400">Total Original Cost</span>
                        <span className="font-bold text-gray-700 font-mono">Rs. {getCartTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-400">Tax / Handling Offset</span>
                        <span className="font-bold text-emerald-600 font-mono text-[10px]">INCLUDED</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-400">Delivery Shipment (PKR)</span>
                        <span className="font-black text-gray-750 font-mono">FREE SHIPPING</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 font-semibold text-sm">
                        <span className="text-gray-900 font-black">Grand Total</span>
                        <span className="font-black text-gray-950 font-mono text-base text-[#0B7A33]">Rs. {getCartTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab("checkout")}
                        className="w-full py-3 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-black uppercase tracking-wider text-center cursor-pointer transition shadow-xs"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: SECURE CHECKOUT PAGE */}
          {activeTab === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              <h2 className="text-xl font-black text-gray-955 uppercase">SaaS Checkout Console</h2>

              {checkoutSuccessMsg ? (
                <div className="p-8 max-w-lg mx-auto bg-white rounded-[30px] border border-gray-200 shadow-lg text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle size={30} />
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900">{checkoutSuccessMsg}</h3>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-1.5 text-xs text-left max-w-sm mx-auto font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Order Ref ID:</span>
                      <strong className="text-gray-800">{lastPlacedOrderId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Recipient Recipient:</span>
                      <strong className="text-gray-800">{checkoutName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Shipment Node:</span>
                      <strong className="text-gray-800">{checkoutCity}</strong>
                    </div>
                    <span className="text-[10px] block border-t border-gray-200 pt-2 mt-2 leading-relaxed text-center font-sans text-gray-400">
                      Automated overrides commission ledger calculated & distributed to reseller <strong>{resellerCode}</strong> safely.
                    </span>
                  </div>

                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setCheckoutSuccessMsg(null);
                        setActiveTab("tracking");
                        handleTrackSubmit();
                      }}
                      className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      Track Order Status
                    </button>
                    <button
                      onClick={() => {
                        setCheckoutSuccessMsg(null);
                        setActiveTab("home");
                      }}
                      className="px-6 py-2.5 border border-gray-250 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      Back Shop Home
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column - Shipping Credentials form */}
                  <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[24px] border border-gray-200 shadow-xs space-y-5">
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900 uppercase">Customer Shipping Coordinates</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">Nationwide physical delivery within 3 - 5 business days.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono font-bold">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">Full Customer Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Harry Harrison"
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[#0B7A33] focus:border-[#0B7A33]"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">Active Contact Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 03001234567"
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[#0B7A33] focus:border-[#0B7A33]"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">Customer E-mail Address</label>
                        <input
                          type="email"
                          placeholder="leave empty for automatic placeholder"
                          value={checkoutEmail}
                          onChange={(e) => setCheckoutEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[#0B7A33] focus:border-[#0B7A33]"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">Destination City</label>
                        <select
                          value={checkoutCity}
                          onChange={(e) => setCheckoutCity(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none text-[#0B7A33] focus:border-[#0B7A33]"
                        >
                          <option value="Rawalpindi">Rawalpindi</option>
                          <option value="Islamabad">Islamabad</option>
                          <option value="Lahore">Lahore</option>
                          <option value="Karachi">Karachi</option>
                          <option value="Faisalabad">Faisalabad</option>
                          <option value="Peshawar">Peshawar</option>
                          <option value="Multan">Multan</option>
                          <option value="Gujranwala">Gujranwala</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">Complete Physical Street Address</label>
                        <input
                          type="text"
                          required
                          placeholder="House, Street Num, Sector or Commercial Area details"
                          value={checkoutAddress}
                          onChange={(e) => setCheckoutAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[#0B7A33] focus:border-[#0B7A33]"
                        />
                      </div>
                    </div>

                    {/* Payment methods */}
                    <div className="pt-4 border-t border-gray-150 space-y-3">
                      <h4 className="font-extrabold text-xs uppercase text-gray-900">Choose Verified Payment Channel</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["Cash on Delivery", "JazzCash / EasyPaisa", "SaaS Wallet Points"].map(method => (
                          <div
                            key={method}
                            onClick={() => setPayMethod(method)}
                            className={`p-4 border rounded-2xl cursor-pointer flex flex-col items-center justify-center text-center gap-2 transition ${
                              payMethod === method
                                ? "border-[#0B7A33] bg-emerald-50/50 text-[#0B7A33] font-extrabold"
                                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            <CreditCard size={18} />
                            <span className="text-[10px] uppercase font-mono font-black">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column - cart preview */}
                  <div className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-gray-200 shadow-xs space-y-4">
                    <h3 className="font-extrabold text-sm text-gray-900 uppercase">Cart Compilation</h3>

                    <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                      {cart.map(item => (
                        <div key={item.product.id} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                          <div>
                            <h5 className="font-bold text-gray-800 truncate max-w-[150px]">{item.product.name}</h5>
                            <span className="text-[9px] font-mono text-gray-400">{item.quantity} x Rs. {item.product.price.toLocaleString()}</span>
                          </div>
                          <span className="font-mono font-bold text-gray-750">Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-150 pt-3 space-y-2 text-xs">
                      <div className="flex justify-between font-extrabold text-gray-900">
                        <span>Cart Total</span>
                        <strong className="font-mono text-sm text-[#0B7A33]">Rs. {getCartTotal().toLocaleString()}</strong>
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-[10px] block leading-relaxed text-amber-900">
                        🛒 Affiliate credit will trace back to: <strong>{resellerCode || "Platform Admin"}</strong>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-black uppercase tracking-wider text-center cursor-pointer transition shadow-sm"
                    >
                      Confirm Order & Dispatch (PKR {getCartTotal().toLocaleString()})
                    </button>
                  </div>

                </form>
              )}
            </motion.div>
          )}

          {/* TAB 6: ORDER TRACKING PAGE */}
          {activeTab === "tracking" && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left max-w-2xl mx-auto"
            >
              <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-200 shadow-sm space-y-6">
                <div>
                  <h2 className="font-black text-lg text-gray-950 uppercase tracking-tight">Order Tracking Console</h2>
                  <p className="text-[10px] text-gray-400 mt-0.5">Determine shipment status for physical dropship checkouts.</p>
                </div>

                <form onSubmit={handleTrackSubmit} className="space-y-4 text-xs font-mono font-bold">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">Customer Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. 03001234567"
                        value={trackingPhone}
                        onChange={(e) => setTrackingPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[#0B7A33] focus:border-[#0B7A33]"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">Order Reference ID</label>
                      <input
                        type="text"
                        placeholder="e.g. ord-pub-123456"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-[#0B7A33] focus:border-[#0B7A33]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={trackingLoading}
                    className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition flex items-center justify-center gap-2"
                  >
                    {trackingLoading ? "Tracing Order ledger..." : "Locate Shipment Status"}
                  </button>
                </form>

                {trackingStatusMsg && (
                  <div className="p-3.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl text-center text-xs font-medium font-mono">
                    {trackingStatusMsg}
                  </div>
                )}
              </div>

              {/* LIST MATCHING ORDERS */}
              {trackedOrders.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-xs uppercase tracking-widest text-gray-900">Tracing Results ({trackedOrders.length})</h3>

                  {trackedOrders.map(ord => (
                    <div key={ord.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                      <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-gray-100">
                        <div>
                          <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">Order Ledger ID</span>
                          <h4 className="text-sm font-black text-gray-900 font-mono">{ord.id}</h4>
                        </div>

                        <span className={`px-3 py-1 font-mono font-bold rounded-full text-[10px] uppercase tracking-widest border ${
                          ord.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : ord.status === "Cancelled"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          ● {ord.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 text-xs">
                        <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-wider font-bold">Consignment Box Details</span>
                        <div className="space-y-1 bg-gray-50/50 p-3 rounded-xl border border-gray-150">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-gray-700 font-medium">
                              <span>{it.name} <strong className="text-gray-400 ml-1">x{it.quantity}</strong></span>
                              <strong className="font-mono text-gray-900">Rs. {(it.price * it.quantity).toLocaleString()}</strong>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline status indicator */}
                      <div className="pt-2 text-xs">
                        <span className="text-[9px] uppercase font-black tracking-widest text-[#0B7A33] block mb-2 font-mono">Shipment status</span>
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono font-bold">
                          <div className="p-2 rounded-lg bg-emerald-50 text-[#0B7A33]">
                            <span>Confirmed</span>
                          </div>
                          <div className={`p-2 rounded-lg ${["Processing", "Shipped", "Delivered"].includes(ord.status) ? "bg-emerald-100 text-emerald-800" : "bg-gray-50 text-gray-400"}`}>
                            <span>Processing</span>
                          </div>
                          <div className={`p-2 rounded-lg ${["Shipped", "Delivered"].includes(ord.status) ? "bg-emerald-100 text-emerald-800" : "bg-gray-50 text-gray-400"}`}>
                            <span>In Transit</span>
                          </div>
                          <div className={`p-2 rounded-lg ${ord.status === "Delivered" ? "bg-emerald-100 text-emerald-800" : "bg-gray-50 text-gray-400"}`}>
                            <span>Delivered</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          )}

          {/* TAB 7: CUSTOMER HUB & WISHLIST */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 text-left"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Profile card left */}
                <div className="md:col-span-4 bg-white p-6 rounded-[24px] border border-gray-200 shadow-xs space-y-5">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-[#0B7A33]/10 text-[#0B7A33] rounded-full flex items-center justify-center mx-auto">
                      <User size={30} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900">Ecom Network Customer</h3>
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Client Account ID</span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 text-xs font-mono font-bold pt-2">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-gray-400 font-sans">Stored Wishlist Size</span>
                      <strong className="text-gray-800">{wishlist.length} items</strong>
                    </div>

                    <div className="py-2.5 flex justify-between">
                      <span className="text-gray-400 font-sans">Tax Exemption Code</span>
                      <strong className="text-[#0B7A33]">ACTIVE</strong>
                    </div>

                    <div className="py-2.5 flex justify-between">
                      <span className="text-gray-400 font-sans">Payment Method Pref</span>
                      <strong className="text-gray-800">JazzCash</strong>
                    </div>
                  </div>
                </div>

                {/* Wishlist grid right */}
                <div className="md:col-span-8 bg-white p-6 rounded-[24px] border border-gray-200 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-sm text-gray-900 uppercase">My Wishlist Items ({wishlist.length})</h3>

                  {wishlist.length === 0 ? (
                    <div className="py-12 border border-dashed border-gray-200 text-center text-xs font-bold font-mono text-gray-400 rounded-2xl">
                      Wishlist resides empty. Tap heart to save dropshipped catalog items!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlist.map(prod => (
                        <div key={prod.id} className="border border-gray-150 p-4 rounded-2xl flex items-center gap-3">
                          {prod.images?.[0] ? (
                            <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded-xl border border-gray-100" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300"><ShoppingBag size={18} /></div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h5 className="font-extrabold text-xs text-gray-900 truncate">{prod.name}</h5>
                            <span className="text-[10px] font-mono font-black text-emerald-600 block">Rs. {prod.price.toLocaleString()}</span>
                          </div>

                          <button
                            onClick={() => {
                              addToCart(prod, 1, false);
                              setWishlist(wishlist.filter(w => w.id !== prod.id));
                            }}
                            className="p-1 px-2.5 rounded-lg bg-[#0B7A33] hover:bg-[#12A84A] text-white text-[10px] font-black uppercase cursor-pointer"
                          >
                            + Bag
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};

// ========================================================
// INTERNAL HELPER: PRODUCT CARD COMPONENT
// ========================================================
interface CardProps {
  product: Product;
  onView: (p: Product) => void;
  onAddToBag: (p: Product) => void;
  wishlist: Product[];
  onToggleWishlist: (p: Product) => void;
}

const ProductCard: React.FC<CardProps> = ({ product, onView, onAddToBag, wishlist, onToggleWishlist }) => {
  const isWishlisted = wishlist.some(x => x.id === product.id);

  return (
    <div className="group bg-white rounded-3xl border border-gray-200/90 hover:border-emerald-604 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative text-left">
      
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.stock <= 0 && (
          <span className="px-2.5 py-0.5 rounded-lg bg-red-500 text-white font-mono font-extrabold text-[8px] uppercase tracking-wider">
            Out Of Stock
          </span>
        )}
        {product.stock > 0 && product.stock <= 3 && (
          <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-gray-950 font-mono font-bold text-[8px] uppercase tracking-widest">
            Low stock ({product.stock})
          </span>
        )}
      </div>

      {/* Wishlist toggle */}
      <button
        type="button"
        onClick={() => onToggleWishlist(product)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition shadow-xs cursor-pointer"
      >
        <Heart size={14} fill={isWishlisted ? "#ef4444" : "none"} className={isWishlisted ? "text-red-500 animate-pulse" : ""} />
      </button>

      {/* Actionable visual layout wrapper */}
      <div onClick={() => onView(product)} className="cursor-pointer space-y-4">
        
        {/* Core Media Container */}
        <div className="aspect-square bg-gray-50 relative overflow-hidden flex items-center justify-center border-b border-gray-100">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
            />
          ) : (
            <ShoppingBag size={50} className="text-gray-300" />
          )}
        </div>

        {/* Content detail padding */}
        <div className="px-4 pb-1 space-y-1.5">
          <span className="text-[9px] font-mono font-black text-gray-450 uppercase tracking-widest block">{product.category}</span>
          <h4 className="font-extrabold text-xs text-gray-950 truncate block group-hover:text-[#0B7A33] transition-colors">{product.name}</h4>
          
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-xs font-mono font-black text-gray-800">Rs. {product.price.toLocaleString()}</span>
            <span className="text-[10px] text-gray-400 font-mono line-through">Rs. {(product.price + 500).toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Bottom Button Actions */}
      <div className="p-4 pt-2">
        <button
          type="button"
          onClick={() => onAddToBag(product)}
          disabled={product.stock <= 0}
          className={`w-full py-2 px-4 rounded-xl text-[10px] uppercase font-black tracking-wider transition duration-150 cursor-pointer text-center ${
            product.stock <= 0
              ? "bg-gray-100 text-gray-400 border border-transparent cursor-not-allowed"
              : "bg-[#0B7A33] hover:bg-[#12A84A] text-white border border-[#0B7A33] hover:border-[#12A84A] hover:shadow-xs"
          }`}
        >
          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

    </div>
  );
};
