import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { YOURMART_CATALOG } from "./yourmart_data";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "ecom-network-ultra-secret-key-2026-06-11";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "ecom-network-ultra-refresh-secret-key-2026-06-11";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with graceful checking
let ai: GoogleGenAI | null = null;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("✓ Gemini API Client initialized successfully.");
  } catch (error) {
    console.error("⚠ Failed to initialize Gemini API client:", error);
  }
} else {
  console.log("⚠ GEMINI_API_KEY not found in environment, AI Copywriter will run on pre-configured templates.");
}

// ----------------------------------------------------
// FILE-BASED DATABASE STORAGE
// ----------------------------------------------------
const DB_FILE = path.join(process.cwd(), "ecom_network_db.json");

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  mobile: string;
  country: string;
  password?: string;
  referralCode: string;
  referredBy?: string; // sponsor referral code
  parentId?: string; // parent user id
  position?: "left" | "right" | "root"; // placement position
  role: "admin" | "user";
  rank: "Starter" | "Bronze" | "Silver" | "Gold" | "Diamond" | "Platinum" | "Crown Ambassador";
  isSuspended: boolean;
  isActivated?: boolean; // For E-Pin user activation verification
  createdAt: string;
  // Relational Database mapping / storage fields
  user_id?: string;
  full_name?: string;
  phone?: string;
  password_hash?: string;
  sponsor_id?: string;
  status?: string;
  updated_at?: string;
  created_at?: string;
}

interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number; // PKR
  commissionPercent: number; // Product base commission % (for admin configuration)
  stock: number;
  category: string;
  images: string[];
  supplier_price?: number;
  markup_price?: number;
  selling_price?: number;
  supplier?: string;
  status?: "Active" | "Hidden";
  created_at?: string;
  updated_at?: string;
  specifications?: Record<string, string>;
  variants?: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  commissionPercent: number;
}

interface Order {
  id: string;
  userId: string; // Reseller placing the order
  username: string;
  items: OrderItem[];
  totalAmount: number;
  totalCommissionGenerated: number;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  payMethod: "JazzCash" | "EasyPaisa" | "Bank Transfer";
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  commissionDistributed: boolean;
}

interface Customer {
  id: string;
  referredByUserId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  createdAt: string;
}

interface Commission {
  id: string;
  userId: string; // receiver
  username: string;
  fromUsername: string; // buyer/reseller who triggered the sale
  amount: number;
  orderId: string;
  level: number; // 1, 2, or 3
  status: "Pending" | "Approved" | "Paid" | "Rejected";
  createdAt: string;
}

interface Wallet {
  userId: string;
  available: number;
  pending: number;
  totalEarned: number;
}

interface Withdrawal {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: "Bank Transfer" | "JazzCash" | "EasyPaisa";
  details: string;
  status: "Pending" | "Approved" | "Paid" | "Rejected";
  createdAt: string;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "referral" | "commission" | "withdrawal" | "rank" | "order";
  isRead: boolean;
  createdAt: string;
}

interface EPin {
  id: string; // generated unique pin string, e.g. ECN-8F2A-5D91
  status: "Unused" | "Used" | "Deactivated";
  ownerId: string; // user ID who owns the pin
  ownerUsername: string; // user username details
  createdDate: string;
  activationDate?: string;
  activatedUserId?: string; // ID of user activated
  activatedUsername?: string; // Username of user activated
  sponsorId?: string; // Who was the sponsor during activation
  position?: "left" | "right"; // placement position in network tree
}

interface EPinRequest {
  id: string;
  userId: string;
  username: string;
  quantity: number;
  totalPrice: number; // auto PKR
  paymentMethod: "EasyPaisa" | "JazzCash" | "Bank Transfer" | "Crypto";
  transactionId: string;
  notes?: string;
  screenshotUrl?: string; // standard file or default description
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

interface EPinPaymentDetails {
  easyPaisaMobile: string;
  easyPaisaName: string;
  jazzCashMobile: string;
  jazzCashName: string;
  bankName: string;
  bankAccount: string;
  bankTitle: string;
  cryptoAddress: string;
}

interface DB {
  users: User[];
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  wallets: Wallet[];
  withdrawals: Withdrawal[];
  commissions: Commission[];
  commissionRates: {
    level1: number; // Level 1 commission rate %
    level2: number; // Level 2 commission rate %
    level3: number; // Level 3 commission rate %
    disableMultiLevel: boolean;
  };
  notifications: Notification[];
  epins: EPin[];
  epinRequests: EPinRequest[];
  paymentDetails: EPinPaymentDetails;
  cms: {
    heroTitle: string;
    heroSubtitle: string;
    aboutText: string;
    pricingStarter: number;
    pricingPro: number;
  };
  yourmartSettings?: {
    globalMarkup: number;
    categoryMarkups: Record<string, number>;
  };
}

// Premium Initial Seed Data for Ecom Network Pakistan
const INITIAL_DB: DB = {
  users: [
    {
      id: "u-admin",
      name: "Ecom Super Admin",
      username: "admin",
      email: "itsxharrysharry@gmail.com",
      mobile: "+923241651892",
      country: "Pakistan",
      password: "password123",
      referralCode: "HQNODE",
      role: "admin",
      rank: "Crown Ambassador",
      isSuspended: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "u-kamran",
      name: "Kamran Shah",
      username: "kamran",
      email: "kamran@ecomnetwork.pk",
      mobile: "03241651892",
      country: "Pakistan",
      password: "password123",
      referralCode: "KAMRAN123",
      referredBy: "HQNODE",
      role: "user",
      rank: "Diamond",
      isSuspended: false,
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "u-ayesha",
      name: "Ayesha Khan",
      username: "ayesha",
      email: "ayesha@ecomnetwork.pk",
      mobile: "03001234567",
      country: "Pakistan",
      password: "password123",
      referralCode: "AYESHA12",
      referredBy: "KAMRAN123", // Level 1 of kamran
      role: "user",
      rank: "Gold",
      isSuspended: false,
      createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "u-zain",
      name: "Zain Malik",
      username: "zain",
      email: "zain@gmail.com",
      mobile: "03112223344",
      country: "Pakistan",
      password: "password123",
      referralCode: "ZAIN99",
      referredBy: "AYESHA12", // Level 2 of kamran
      role: "user",
      rank: "Silver",
      isSuspended: false,
      createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "u-bilal",
      name: "Bilal Ahmad",
      username: "bilal",
      email: "bilal@yahoo.com",
      mobile: "03334445556",
      country: "Pakistan",
      password: "password123",
      referralCode: "BILAL5",
      referredBy: "ZAIN99", // Level 3 of kamran
      role: "user",
      rank: "Starter",
      isSuspended: false,
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    }
  ],
  products: [
    {
      id: "p-shawl",
      name: "Premium Silk Pashmina Shawl",
      description: "Sophisticated silk woven pashmina shawl handcrafted by artisan weavers in Northern valleys. Intricate traditional designs and extremely warm insulation.",
      price: 8500,
      commissionPercent: 10,
      stock: 45,
      category: "Fashion",
      images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=600"]
    },
    {
      id: "p-watch",
      name: "TrackFit GPS Elite Smartwatch",
      description: "Next-generation health tracker equipped with live GPS routing, continuous blood oxygen index, real-time sleep telemetry, and 14 days of lithium backup cell.",
      price: 14500,
      commissionPercent: 12,
      stock: 35,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=600"]
    },
    {
      id: "p-serum",
      name: "Pure Argan Organic Face Serum",
      description: "Deeply nourishing facial treatment extracted from cold-pressed Moroccan Argan seed kernels. Enriched with natural Vitamin E, anti-oxidants, and hyaluronic skin repair.",
      price: 3600,
      commissionPercent: 15,
      stock: 120,
      category: "Wellness",
      images: ["https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"]
    },
    {
      id: "p-buds",
      name: "AeroSonics ANC Pro Wireless Buds",
      description: "High-fidelity acoustics featuring active environmental noise cancellation, ultra-low latency gaming feed, touch shortcuts, and waterproofing.",
      price: 6400,
      commissionPercent: 10,
      stock: 75,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600"]
    },
    {
      id: "p-chappal",
      name: "Artisanal Double-Sole Peshawari Chappal",
      description: "Traditional premier Pakistani footwear hand-cut in genuine full-grain leather. Designed for superior posture support and classic royal design aesthetics.",
      price: 5800,
      commissionPercent: 15,
      stock: 25,
      category: "Fashion",
      images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600"]
    }
  ],
  categories: [
    { id: "c-fash", name: "Fashion", slug: "fashion" },
    { id: "c-elec", name: "Electronics", slug: "electronics" },
    { id: "c-well", name: "Wellness", slug: "wellness" }
  ],
  orders: [],
  customers: [
    {
      id: "cust-1",
      referredByUserId: "u-kamran",
      name: "Imran Ali",
      email: "imran@gmail.com",
      phone: "+923001230011",
      city: "Lahore",
      address: "Phase 5 DHA, Block K",
      createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "cust-2",
      referredByUserId: "u-ayesha",
      name: "Zoya Malik",
      email: "zoya@yahoo.com",
      phone: "+923214441234",
      city: "Karachi",
      address: "Clifton Block 4 Vardah Residence",
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
    }
  ],
  wallets: [
    { userId: "u-admin", available: 165000, pending: 0, totalEarned: 165000 },
    { userId: "u-kamran", available: 12400, pending: 4500, totalEarned: 48000 },
    { userId: "u-ayesha", available: 8900, pending: 1200, totalEarned: 15400 },
    { userId: "u-zain", available: 3200, pending: 800, totalEarned: 5000 },
    { userId: "u-bilal", available: 0, pending: 0, totalEarned: 0 }
  ],
  withdrawals: [],
  commissions: [],
  commissionRates: {
    level1: 10, // 10%
    level2: 5,  // 5%
    level3: 2,  // 2%
    disableMultiLevel: false
  },
  notifications: [],
  epins: [],
  epinRequests: [],
  paymentDetails: {
    easyPaisaMobile: "03001234567",
    easyPaisaName: "Ecom Admin Official",
    jazzCashMobile: "03217654321",
    jazzCashName: "Ecom Admin Official",
    bankName: "Meezan Bank Limited",
    bankAccount: "123401056789",
    bankTitle: "Ecom Network Private Limited",
    cryptoAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  },
  cms: {
    heroTitle: "Build A Premium E-Commerce Network Today",
    heroSubtitle: "Earn un-capped residual product commissions through social dropshipping and a professional 3-tier active affiliate network tree.",
    aboutText: "Ecom Network is the most advanced zero-overhead social drop-shipping system in Pakistan. Connect products to customers, generate automated direct shipping queues, and receive commissions paid on actual retail sales.",
    pricingStarter: 0,
    pricingPro: 0
  },
  yourmartSettings: {
    globalMarkup: 500,
    categoryMarkups: {
      "Mobile Phones": 500,
      "Smart Watches": 400,
      "Storage Devices": 300,
      "Power Banks & Chargers": 300,
      "Lifestyle Products": 300,
      "Accessories": 250,
      "Smart Gadgets": 400,
      "AirPods & Headsets": 300,
      "Home & Kitchen Products": 400,
      "Electronics": 500,
      "Fashion": 300,
      "Wellness": 400
    }
  }
};

// Unique pin generator supporting target format ECN-XXXX-XXXX
function generatePinCode(existingPins: string[] = []): string {
  let attempt = 0;
  while (attempt < 100) {
    const s1 = Math.random().toString(16).substr(2, 4).toUpperCase().padEnd(4, "F");
    const s2 = Math.random().toString(16).substr(2, 4).toUpperCase().padEnd(4, "E");
    const formatted = `ECN-${s1}-${s2}`;
    if (!existingPins.includes(formatted)) {
      return formatted;
    }
    attempt++;
  }
  return `ECN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Generate sequential User ID starting at ECN1001
function generateECNUserId(dbUsers: any[] = []): string {
  let maxNum = 1000;
  for (const u of dbUsers) {
    const uIdToCheck = u.user_id || u.id;
    if (uIdToCheck && typeof uIdToCheck === "string" && uIdToCheck.toUpperCase().startsWith("ECN")) {
      const match = uIdToCheck.toUpperCase().match(/^ECN(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }
  return `ECN${maxNum + 1}`;
}

// Database utility helpers
function readDB(): DB {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const dbCopy = JSON.parse(JSON.stringify(INITIAL_DB));
      normalizeTree(dbCopy);
      fs.writeFileSync(DB_FILE, JSON.stringify(dbCopy, null, 2));
      return dbCopy;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);

    // Make sure we carry forward any missing default arrays or values
    if (!parsed.products) parsed.products = INITIAL_DB.products;
    if (!parsed.categories) parsed.categories = INITIAL_DB.categories;
    if (!parsed.orders) parsed.orders = [];
    if (!parsed.customers) parsed.customers = INITIAL_DB.customers;
    if (!parsed.commissionRates) parsed.commissionRates = INITIAL_DB.commissionRates;
    if (!parsed.epins) parsed.epins = [];
    if (!parsed.epinRequests) parsed.epinRequests = [];
    if (!parsed.paymentDetails) {
      parsed.paymentDetails = {
        easyPaisaMobile: "03001234567",
        easyPaisaName: "Ecom Admin Official",
        jazzCashMobile: "03217654321",
        jazzCashName: "Ecom Admin Official",
        bankName: "Meezan Bank Limited",
        bankAccount: "123401056789",
        bankTitle: "Ecom Network Private Limited",
        cryptoAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
      };
    }
    
    if (!parsed.yourmartSettings) {
      parsed.yourmartSettings = INITIAL_DB.yourmartSettings;
    }
    
    // Automatically synchronize/import all products from YOURMART_CATALOG if they don't exist
    const settings = parsed.yourmartSettings || { globalMarkup: 500, categoryMarkups: {} };
    if (!parsed.products) parsed.products = [];
    if (!parsed.categories) parsed.categories = [];
    
    let dbChanged = false;
    for (const item of YOURMART_CATALOG) {
      if (!parsed.products.some((p: any) => p.id === item.id)) {
        let markup = settings.globalMarkup;
        if (settings.categoryMarkups && settings.categoryMarkups[item.category] !== undefined) {
          markup = Number(settings.categoryMarkups[item.category]);
        }
        const selling_price = item.supplier_price + markup;
        
        // Ensure category exists
        if (!parsed.categories.some((c: any) => c.name.toLowerCase() === item.category.toLowerCase())) {
          parsed.categories.push({
            id: "c-" + Math.random().toString(36).substr(2, 9),
            name: item.category,
            slug: item.category.toLowerCase().replace(/\s+/g, "-")
          });
        }
        
        parsed.products.push({
          id: item.id,
          name: item.name,
          slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: item.description,
          images: item.images,
          category: item.category,
          stock: item.stock,
          supplier_price: item.supplier_price,
          markup_price: markup,
          selling_price: selling_price,
          price: selling_price,
          commissionPercent: 10,
          supplier: "YourMart",
          status: "Active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          specifications: item.specifications,
          variants: item.variants
        });
        dbChanged = true;
      }
    }
    if (dbChanged) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2));
      } catch (err) {}
    }

    normalizeTree(parsed);
    return parsed;
  } catch (error) {
    console.error("Failed to read database, resetting to initial state", error);
    const dbCopy = JSON.parse(JSON.stringify(INITIAL_DB));
    normalizeTree(dbCopy);
    return dbCopy;
  }
}

function writeDB(data: DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to save database to disk:", err);
  }
}

function normalizeTree(db: DB) {
  // Find admin or make first user the root
  const rootUser = db.users.find(u => u.role === "admin" || u.username === "admin") || db.users[0];
  if (rootUser) {
    rootUser.parentId = undefined;
    rootUser.position = "root";
    if (rootUser.isActivated === undefined) rootUser.isActivated = true;
  }

  // Ensure pre-existing seeded users have isActivated set to true
  db.users.forEach(u => {
    if (u.isActivated === undefined) {
      if (u.role === "admin" || u.username === "kamran" || u.username === "ayesha" || u.username === "zain" || u.username === "bilal") {
        u.isActivated = true;
      } else {
        u.isActivated = false; // new custom registrations default to inactive
      }
    }
  });

  // Ensure all ACTIVATED users (except root) have a position and parentId assigned
  db.users.forEach(u => {
    if (!rootUser || u.id === rootUser.id) return;

    if (!u.isActivated) {
      // Unactivated users do not appear in the tree and can't have parent/positions
      u.parentId = undefined;
      u.position = undefined;
      return;
    }

    if (!u.parentId || !u.position) {
      // Find where to place this user.
      // We look at their sponsor (referredBy) as preferred parent, or root if not found or not activated.
      let sponsorUser = db.users.find(s => s.referralCode === u.referredBy);
      if (!sponsorUser || !sponsorUser.isActivated) {
        sponsorUser = rootUser;
      }

      // Find an open position under sponsor or down their tree (using activated users list only)
      const placement = findOpenPosition(db.users.filter(usr => usr.isActivated), sponsorUser.id);
      u.parentId = placement.parentId;
      u.position = placement.position;
    }
  });
}

function findOpenPosition(users: User[], sponsorId: string): { parentId: string; position: "left" | "right" } {
  const queue: string[] = [sponsorId];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const children = users.filter(u => u.parentId === currentId);
    
    const leftChild = children.find(c => c.position === "left");
    const rightChild = children.find(c => c.position === "right");

    if (!leftChild) {
      return { parentId: currentId, position: "left" };
    } else if (!rightChild) {
      return { parentId: currentId, position: "right" };
    } else {
      queue.push(leftChild.id);
      queue.push(rightChild.id);
    }
  }
  // Fallback
  return { parentId: sponsorId, position: "left" };
}

// Recalculates real-time Binary MLM commissions, leg counts, referral counts, and wallet balances under 950 PKR pin activation system.
function computeMLMStats(db: DB, userId: string) {
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return {
      leftTeamCount: 0,
      rightTeamCount: 0,
      totalTeamCount: 0,
      directReferralBonus: 0,
      pairIncome: 0,
      levelBonus: 0,
      totalEarned: 0,
      availableBalance: 0,
      availablePins: 0,
      usedPins: 0,
      pendingWithdrawals: 0,
      paidWithdrawals: 0,
      totalWithdrawals: 0,
      currentAchievementLevel: 0
    };
  }

  // Find all active users
  const activeUsers = db.users.filter(u => u.isActivated);

  // Helper to trace downline active users under sub-root recursively
  const getDownlineActiveCount = (rootId: string, side?: "left" | "right"): number => {
    let directChildren = activeUsers.filter(u => u.parentId === rootId);
    if (side) {
      directChildren = directChildren.filter(u => u.position === side);
    }
    
    let count = 0;
    const queue = [...directChildren];
    while (queue.length > 0) {
      const current = queue.shift()!;
      count++;
      const sub = activeUsers.filter(u => u.parentId === current.id);
      queue.push(...sub);
    }
    return count;
  };

  const leftTeamCount = getDownlineActiveCount(userId, "left");
  const rightTeamCount = getDownlineActiveCount(userId, "right");
  const totalTeamCount = leftTeamCount + rightTeamCount;

  // Direct referral calculation: sponsor matches user's referral code & is active
  const activeDirectReferralsCount = activeUsers.filter(u => u.referredBy === user.referralCode).length;
  const directReferralBonus = activeDirectReferralsCount * 200;

  // Pair Income: min(leftTeamCount, rightTeamCount) * 200
  const completedPairsCount = Math.min(leftTeamCount, rightTeamCount);
  const pairIncome = completedPairsCount * 200;

  // Level Achievement Bonus
  const LEVEL_BONUSES = [
    { level: 1, left: 10, right: 10, bonus: 500 },
    { level: 2, left: 25, right: 25, bonus: 1000 },
    { level: 3, left: 50, right: 50, bonus: 2000 },
    { level: 4, left: 100, right: 100, bonus: 3000 },
    { level: 5, left: 250, right: 250, bonus: 5000 },
    { level: 6, left: 500, right: 500, bonus: 25000 },
    { level: 7, left: 1000, right: 1000, bonus: 40000 },
    { level: 8, left: 2500, right: 2500, bonus: 125005 },
    { level: 9, left: 5000, right: 5000, bonus: 250000 },
    { level: 10, left: 10000, right: 10000, bonus: 500000 },
    { level: 11, left: 20000, right: 20000, bonus: 800000 },
    { level: 12, left: 35000, right: 35000, bonus: 1000000 },
    { level: 13, left: 50000, right: 50000, bonus: 1500000 },
  ];

  let levelBonus = 0;
  let currentAchievementLevel = 0;
  for (const lb of LEVEL_BONUSES) {
    if (leftTeamCount >= lb.left && rightTeamCount >= lb.right) {
      levelBonus += lb.bonus;
      currentAchievementLevel = lb.level;
    }
  }

  // Approved product sales commissions
  const productCommissionsAmount = db.commissions
    .filter(c => c.userId === userId && (c.status === "Approved" || c.status === "Paid"))
    .reduce((sum, c) => sum + c.amount, 0);

  const totalEarned = directReferralBonus + pairIncome + levelBonus + productCommissionsAmount;

  // Withdrawals
  const pendingWithdrawals = db.withdrawals
    .filter(w => w.userId === userId && w.status === "Pending")
    .reduce((sum, w) => sum + w.amount, 0);

  const paidWithdrawals = db.withdrawals
    .filter(w => w.userId === userId && w.status === "Paid")
    .reduce((sum, w) => sum + w.amount, 0);

  // A withdrawal deducts from available balance as soon as it is requested (either pending or paid/cleared)
  const totalDeductedWithdrawals = pendingWithdrawals + paidWithdrawals;
  const availableBalance = Math.max(0, totalEarned - totalDeductedWithdrawals);

  // E-pins belonging to this user
  const availablePins = db.epins.filter(p => p.ownerId === userId && p.status === "Unused").length;
  const usedPins = db.epins.filter(p => p.ownerId === userId && p.status === "Used").length;

  return {
    leftTeamCount,
    rightTeamCount,
    totalTeamCount,
    directReferralBonus,
    pairIncome,
    levelBonus,
    totalEarned,
    availableBalance,
    availablePins,
    usedPins,
    pendingWithdrawals,
    paidWithdrawals,
    totalWithdrawals: totalDeductedWithdrawals,
    currentAchievementLevel
  };
}

// Instantiate immediately index context
readDB();

// ----------------------------------------------------
// FULL-STACK MIDDLEWARE AUTHENTICATE
// ----------------------------------------------------
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Missing authentication bearer credentials" });
  }

  const db = readDB();
  let userId: string | null = null;

  // Dual validation: Support legacy "token-" formats alongside secure modern JWT verify
  if (token.startsWith("token-")) {
    userId = token.replace("token-", "");
  } else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      userId = decoded.userId || decoded.id;
    } catch (err: any) {
      return res.status(401).json({ error: "Invalid or expired session parameters. Please log in again." });
    }
  }

  if (!userId) {
    return res.status(401).json({ error: "Invalid token structure." });
  }

  const user = db.users.find((u) => u.id === userId || u.user_id === userId);

  if (!user) {
    return res.status(403).json({ error: "Invalid or expired session parameters." });
  }

  if (user.isSuspended) {
    return res.status(403).json({ error: "Your account is currently suspended for administrative review." });
  }

  req.user = user;
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Administrative privileges are mandatory for this panel." });
  }
  next();
}

// ----------------------------------------------------
// APIS: AUTHENTICATION
// ----------------------------------------------------
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username/Email and password parameters are mandatory." });
  }

  const db = readDB();
  const user = db.users.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() ||
      u.email.toLowerCase() === username.toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid username/email or password." });
  }

  if (user.isSuspended) {
    return res.status(403).json({ error: "This affiliate profile is currently suspended." });
  }

  // Dual Check: Hashed password compare via bcrypt, with plaintext fail-back for legacy seed users
  let passwordMatches = false;
  if (user.password_hash) {
    passwordMatches = bcryptjs.compareSync(password, user.password_hash);
  } else if (user.password) {
    passwordMatches = user.password === password;
  }

  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid username/email or password." });
  }

  // Generate 24 Hours Access Token and 30 Days Refresh Token
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  const { password: _, password_hash: __, ...userWithoutPassword } = user;
  res.json({ token, refreshToken, user: userWithoutPassword });
});

app.post("/api/auth/register", (req, res) => {
  const { name, username, email, mobile, country, password, referralCode } = req.body;
  if (!name || !username || !email || !mobile || !password) {
    return res.status(400).json({ error: "All registration details are essential." });
  }

  const db = readDB();
  const uLower = username.toLowerCase();
  const eLower = email.toLowerCase();
  const phoneTrim = mobile.trim();

  // 1. Check Duplicate Username
  if (db.users.some((u) => u.username.toLowerCase() === uLower)) {
    return res.status(400).json({ error: "Username already claimed. Specify another." });
  }

  // 2. Check Duplicate Email
  if (db.users.some((u) => u.email.toLowerCase() === eLower)) {
    return res.status(400).json({ error: "Email already registered. Proceed to login." });
  }

  // 3. Check Duplicate Phone/Mobile Number
  if (db.users.some((u) => (u.mobile || u.phone || "").trim() === phoneTrim)) {
    return res.status(400).json({ error: "Phone number already registered. Specify another." });
  }

  // Map Referrer Sponsor code
  let referredByCode: string | undefined = undefined;
  if (referralCode) {
    const sponsor = db.users.find(
      (u) =>
        u.referralCode.toUpperCase() === referralCode.toUpperCase() ||
        (u.user_id && u.user_id.toUpperCase() === referralCode.toUpperCase())
    );
    if (!sponsor) {
      return res.status(400).json({ error: "The provided sponsor referral code does not exist." });
    }
    referredByCode = sponsor.referralCode;
  }

  // Generate Automatically:
  // Sequential Unique format: ECN1001, ECN1002, etc.
  const sequentialUserId = generateECNUserId(db.users);
  const surrogateId = "u-" + Math.random().toString(36).substr(2, 9);
  const userRefCode = username.toUpperCase() + Math.floor(100 + Math.random() * 900);

  // Secure Password Hashing with exactly 12 rounds (never store plaintext)
  const salt = bcryptjs.genSaltSync(12);
  const hashed_password = bcryptjs.hashSync(password, salt);

  const timestamp = new Date().toISOString();

  const newUser: User = {
    id: surrogateId,
    name,
    username,
    email,
    mobile,
    country: country || "Pakistan",
    referralCode: userRefCode,
    referredBy: referredByCode,
    role: "user",
    rank: "Starter",
    isSuspended: false,
    isActivated: false, // New members are "Pending Activation"
    createdAt: timestamp,
    
    // Relational Database columns
    user_id: sequentialUserId,
    full_name: name,
    phone: mobile,
    password_hash: hashed_password,
    sponsor_id: referredByCode,
    position: "left", // Default placement position in MLM tree
    status: "pending", // active, suspended, pending
    created_at: timestamp,
    updated_at: timestamp
  };

  db.users.push(newUser);
  db.wallets.push({ userId: newUser.id, available: 0, pending: 0, totalEarned: 0 });

  // Add welcome notifications
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: newUser.id,
    title: "Welcome to Ecom Network! (Pending Activation)",
    message: `Welcome! Your partner office has been configured successfully. Your unique User ID is ${sequentialUserId}. Please purchase or request an E-Pin to activate your profile and unlock commission nodes.`,
    type: "referral",
    isRead: false,
    createdAt: timestamp
  });

  writeDB(db);

  // Auto-login upon registration: Generate JWT tokens immediately
  const token = jwt.sign(
    { userId: newUser.id, username: newUser.username, role: newUser.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { userId: newUser.id },
    JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  const { password: _, password_hash: __, ...userWithoutPassword } = newUser;
  res.status(201).json({ token, refreshToken, user: userWithoutPassword });
});

// Endpoint to handle token refreshes (Auto refresh sessions)
app.post("/api/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is mandatory." });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    const db = readDB();
    const user = db.users.find((u) => u.id === decoded.userId || u.user_id === decoded.userId);

    if (!user) {
      return res.status(403).json({ error: "User profile from token context not identified." });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: "This affiliate profile is suspended." });
    }

    // Sign new 24-hour Access Token
    const newAccessToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token: newAccessToken });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired refresh token." });
  }
});

// GET USER IDENTITY DETAILS & SUMMARY STATISTICS
app.get("/api/auth/me", authenticateToken, (req: any, res) => {
  const db = readDB();
  const currentUserId = req.user.id;

  const wallet = db.wallets.find((w) => w.userId === currentUserId) || {
    userId: currentUserId,
    available: 0,
    pending: 0,
    totalEarned: 0
  };

  // Resolve team tree levels structures L1, L2, L3 recursively
  const level1 = db.users.filter((u) => u.referredBy === req.user.referralCode);
  const l1Codes = level1.map((u) => u.referralCode);

  const level2 = db.users.filter((u) => u.referredBy && l1Codes.includes(u.referredBy));
  const l2Codes = level2.map((u) => u.referralCode);

  const level3 = db.users.filter((u) => u.referredBy && l2Codes.includes(u.referredBy));
  const l3IDs = level3.map((u) => u.id);
  const l2IDs = level2.map((u) => u.id);
  const l1IDs = level1.map((u) => u.id);

  const totalTeamIds = [...l1IDs, ...l2IDs, ...l3IDs];

  // COMMISSIONS FROM PRODUCT SALES ONLY (L1, L2, L3)
  const userCommissions = db.commissions.filter((c) => c.userId === currentUserId);
  const totalEarnedCommissions = userCommissions
    .filter((c) => c.status === "Approved" || c.status === "Paid")
    .reduce((sum, c) => sum + c.amount, 0);

  // USER DIRECT ORDERS
  const userOrders = db.orders.filter((o) => o.userId === currentUserId);
  const userSellsCount = userOrders.filter((o) => o.status === "Delivered" || o.status === "Processing" || o.status === "Shipped").length;
  const userSellsTotalAmount = userOrders
    .filter((o) => o.status === "Delivered" || o.status === "Processing" || o.status === "Shipped")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // CO-OP TEAM SALES GENERATED BY PRODUCT SELLING ONLY (Sum of all downline team sales + self direct)
  const teamOrders = db.orders.filter((o) => totalTeamIds.includes(o.userId));
  const activeTeamSalesAmount = teamOrders
    .filter((o) => o.status === "Delivered" || o.status === "Processing" || o.status === "Shipped")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const netTeamSalesTotalCombined = userSellsTotalAmount + activeTeamSalesAmount;

  // Auto rank promotion based strictly on actual physical product team sales
  let nextRank = req.user.rank;
  if (netTeamSalesTotalCombined >= 200000 && req.user.rank === "Starter") {
    nextRank = "Bronze";
  } else if (netTeamSalesTotalCombined >= 500000 && req.user.rank === "Bronze") {
    nextRank = "Silver";
  } else if (netTeamSalesTotalCombined >= 1200000 && req.user.rank === "Silver") {
    nextRank = "Gold";
  } else if (netTeamSalesTotalCombined >= 2500000 && req.user.rank === "Gold") {
    nextRank = "Diamond";
  } else if (netTeamSalesTotalCombined >= 6000000 && req.user.rank === "Diamond") {
    nextRank = "Crown Ambassador";
  }

  if (nextRank !== req.user.rank) {
    const idx = db.users.findIndex((u) => u.id === currentUserId);
    if (idx !== -1) {
      db.users[idx].rank = nextRank;
      db.notifications.push({
        id: "n-" + Math.random().toString(36).substr(2, 9),
        userId: currentUserId,
        title: "Rank Promoted!",
        message: `Outstanding performance! Your network product sales reached is over ${netTeamSalesTotalCombined.toLocaleString()} PKR. You are promoted to ${nextRank}!`,
        type: "rank",
        isRead: false,
        createdAt: new Date().toISOString()
      });
      writeDB(db);
    }
  }

  const mlm = computeMLMStats(db, currentUserId);
  
  // Sync DB records for wallet consistency
  let walletIdx = db.wallets.findIndex(wal => wal.userId === currentUserId);
  if (walletIdx === -1) {
    db.wallets.push({
      userId: currentUserId,
      available: mlm.availableBalance,
      pending: 0,
      totalEarned: mlm.totalEarned
    });
  } else {
    db.wallets[walletIdx].available = mlm.availableBalance;
    db.wallets[walletIdx].totalEarned = mlm.totalEarned;
  }
  // Try to write sync results silently
  try { writeDB(db); } catch (e) {}

  res.json({
    user: { ...req.user, rank: nextRank },
    wallet: {
      userId: currentUserId,
      available: mlm.availableBalance,
      pending: 0,
      totalEarned: mlm.totalEarned
    },
    referrals: {
      level1: level1.map((u) => ({ id: u.id, name: u.name, username: u.username, country: u.country, rank: u.rank, date: u.createdAt, isSuspended: u.isSuspended })),
      level2: level2.map((u) => ({ id: u.id, name: u.name, username: u.username, country: u.country, rank: u.rank, date: u.createdAt, isSuspended: u.isSuspended })),
      level3: level3.map((u) => ({ id: u.id, name: u.name, username: u.username, country: u.country, rank: u.rank, date: u.createdAt, isSuspended: u.isSuspended }))
    },
    stats: {
      totalSales: userSellsTotalAmount, // self orders approved
      totalOrders: userSellsCount,      // count of self active orders
      commissionEarned: totalEarnedCommissions,
      teamSize: mlm.totalTeamCount,
      leftTeamSize: mlm.leftTeamCount,
      rightTeamSize: mlm.rightTeamCount,
      walletBalance: mlm.availableBalance,
      pendingWallet: 0,
      totalEarned: mlm.totalEarned,
      teamSales: netTeamSalesTotalCombined, // direct + downline approved retail sales
      directBonus: mlm.directReferralBonus,
      pairIncome: mlm.pairIncome,
      levelBonus: mlm.levelBonus,
      availablePins: mlm.availablePins,
      usedPins: mlm.usedPins,
      withdrawalBalance: mlm.totalWithdrawals,
      pendingWithdrawals: mlm.pendingWithdrawals,
      paidWithdrawals: mlm.paidWithdrawals
    },
    orders: userOrders.reverse(),
    commissions: userCommissions.reverse(),
    withdrawals: db.withdrawals.filter((w) => w.userId === currentUserId).reverse(),
    notifications: db.notifications.filter((n) => n.userId === currentUserId).reverse(),
    customers: db.customers.filter((c) => c.referredByUserId === currentUserId).reverse()
  });
});

// ----------------------------------------------------
// TREE & GENEALOGY NETWORK SYSTEM APIS
// ----------------------------------------------------
app.get("/api/tree", authenticateToken, (req: any, res) => {
  const db = readDB();
  normalizeTree(db);

  // Compute stats for activated users only
  const nodes = db.users.filter((u) => u.isActivated).map((u) => {
    // 1. Direct sales (Delivered/Processing/Shipped orders)
    const userOrders = db.orders.filter(o => o.userId === u.id);
    const totalSales = userOrders
      .filter(o => o.status === "Delivered" || o.status === "Processing" || o.status === "Shipped")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // 2. Direct commission
    const totalCommission = db.commissions
      .filter(c => c.userId === u.id && (c.status === "Approved" || c.status === "Paid"))
      .reduce((sum, c) => sum + c.amount, 0);

    // 3. Direct referrals count
    const directReferralsCount = db.users.filter(other => other.referredBy === u.referralCode).length;

    // 4. Sponsor name
    const sponsor = db.users.find(other => other.referralCode === u.referredBy);
    const sponsorName = sponsor ? sponsor.name : "System";

    // 5. Total orders count
    const totalOrdersCount = userOrders.length;

    return {
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      phone: u.mobile,
      sponsorId: sponsor ? sponsor.id : null,
      sponsorName,
      parentId: u.parentId || null,
      position: u.position || "root",
      rank: u.rank,
      status: u.isSuspended ? "Suspended" : "Active",
      totalSales,
      commissionEarned: totalCommission,
      totalOrdersCount,
      joinDate: u.createdAt,
      directReferralsCount,
      role: u.role
    };
  });

  // Calculate team size and team sales recursively for each node
  const calculateRecursiveStats = (nodeId: string): { teamSize: number; teamSales: number } => {
    const children = nodes.filter(n => n.parentId === nodeId);
    let size = children.length;
    let sales = children.reduce((sum, c) => sum + c.totalSales, 0);

    children.forEach(c => {
      const childStats = calculateRecursiveStats(c.id);
      size += childStats.teamSize;
      sales += childStats.teamSales;
    });

    return { teamSize: size, teamSales: sales };
  };

  const nodesWithTeamStats = nodes.map(n => {
    const stats = calculateRecursiveStats(n.id);
    return {
      ...n,
      teamSize: stats.teamSize,
      totalTeamSales: stats.teamSales,
      totalTeamRevenue: n.totalSales + stats.teamSales
    };
  });

  res.json({ nodes: nodesWithTeamStats });
});

// Admin Add Tree Node / User
app.post("/api/admin/tree/add-user", authenticateToken, requireAdmin, (req, res) => {
  const { name, username, email, phone, sponsorCodeOrId, parentId, position } = req.body;
  if (!name || !username || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = readDB();
  const uLower = username.toLowerCase();
  const eLower = email.toLowerCase();

  if (db.users.some(u => u.username.toLowerCase() === uLower)) {
    return res.status(400).json({ error: "Username already claimed" });
  }
  if (db.users.some(u => u.email.toLowerCase() === eLower)) {
    return res.status(400).json({ error: "Email already registered" });
  }

  // Find Sponsor
  let sponsor = db.users.find(u => u.id === sponsorCodeOrId || u.referralCode === sponsorCodeOrId || u.username === sponsorCodeOrId);
  if (!sponsor) {
    sponsor = db.users.find(u => u.role === "admin") || db.users[0];
  }

  // Check position occupancy if parentId is provided
  if (parentId) {
    const parentNode = db.users.find(u => u.id === parentId);
    if (!parentNode) {
      return res.status(400).json({ error: "Specified parent node does not exist" });
    }
    const occupant = db.users.find(u => u.parentId === parentId && u.position === position);
    if (occupant) {
      return res.status(400).json({ error: `Position ${position} under ${parentNode.name} is already occupied by ${occupant.name}` });
    }
  }

  const newUser: User = {
    id: "ECN" + Math.floor(1001 + Math.random() * 8999), // formatted as ECN1XXX
    name,
    username,
    email,
    mobile: phone,
    country: "Pakistan",
    password: "password123", // default password
    referralCode: username.toUpperCase() + Math.floor(100 + Math.random() * 90),
    referredBy: sponsor.referralCode,
    parentId: parentId || undefined,
    position: parentId ? (position as "left" | "right") : undefined,
    role: "user",
    rank: "Starter",
    isSuspended: false,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  db.wallets.push({ userId: newUser.id, available: 0, pending: 0, totalEarned: 0 });
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: newUser.id,
    title: "Welcome to Ecom Network!",
    message: `You were placed in the tree structure under parent ${parentId || "root"}.`,
    type: "referral",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  // Call tree normalizer to assign parentId/position if we didn't specify
  normalizeTree(db);

  writeDB(db);
  res.status(201).json({ success: true, user: newUser });
});

// Admin Move Tree Node / User
app.post("/api/admin/tree/move-user", authenticateToken, requireAdmin, (req, res) => {
  const { userId, newParentId, position } = req.body;
  if (!userId || !newParentId || !position) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  const newParent = db.users.find(u => u.id === newParentId);

  if (!user) return res.status(404).json({ error: "User not found" });
  if (!newParent) return res.status(404).json({ error: "Parent user not found" });

  if (userId === newParentId) {
    return res.status(400).json({ error: "Cannot move user under themselves" });
  }

  // Check if target position is already occupied
  const occupant = db.users.find(u => u.parentId === newParentId && u.position === position && u.id !== userId);
  if (occupant) {
    return res.status(400).json({ error: `The ${position} slot under ${newParent.name} is already occupied by ${occupant.name}` });
  }

  // Check for circular dependency (newParent cannot be a descendant of user)
  const isDescendant = (parent: string, child: string): boolean => {
    let curr = db.users.find(u => u.id === child);
    while (curr && curr.parentId) {
      if (curr.parentId === parent) return true;
      curr = db.users.find(u => u.id === curr.parentId);
    }
    return false;
  };

  if (isDescendant(userId, newParentId)) {
    return res.status(400).json({ error: `Invalid operation: ${newParent.name} is a downline member of ${user.name}` });
  }

  user.parentId = newParentId;
  user.position = position as "left" | "right";

  writeDB(db);
  res.json({ success: true, message: `Successfully moved ${user.name} under ${newParent.name} (${position})` });
});

// Admin Change Sponsor of Tree Node
app.post("/api/admin/tree/change-sponsor", authenticateToken, requireAdmin, (req, res) => {
  const { userId, newSponsorId } = req.body;
  if (!userId || !newSponsorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  const newSponsor = db.users.find(u => u.id === newSponsorId);

  if (!user) return res.status(404).json({ error: "User not found" });
  if (!newSponsor) return res.status(404).json({ error: "Sponsor not found" });

  user.referredBy = newSponsor.referralCode;

  writeDB(db);
  res.json({ success: true, message: `Successfully updated sponsor of ${user.name} to ${newSponsor.name}` });
});

// ----------------------------------------------------
// PRODUCT & SHOP CATALOG APIS
// ----------------------------------------------------
app.get("/api/products", (req, res) => {
  const db = readDB();
  res.json({ products: db.products || [] });
});

// ----------------------------------------------------
// YOURMART INTEGRATION & SYNC APIS
// ----------------------------------------------------

// YOURMART_CATALOG is now imported from yourmart_data.ts at the top level of this file.

// Get YourMart product catalog via public proxy
app.get("/api/yourmart/catalog", (req, res) => {
  res.json({ products: YOURMART_CATALOG });
});

// Get current markup settings
app.get("/api/yourmart/settings", (req, res) => {
  const db = readDB();
  res.json({ settings: db.yourmartSettings || { globalMarkup: 500, categoryMarkups: {} } });
});

// Update markup settings
app.post("/api/admin/yourmart/settings", authenticateToken, requireAdmin, (req, res) => {
  const { globalMarkup, categoryMarkups } = req.body;
  if (globalMarkup === undefined || isNaN(Number(globalMarkup))) {
    return res.status(400).json({ error: "Global markup amount is mandatory and must be a valid number." });
  }

  const db = readDB();
  db.yourmartSettings = {
    globalMarkup: Number(globalMarkup),
    categoryMarkups: categoryMarkups || {}
  };

  writeDB(db);
  res.json({ success: true, settings: db.yourmartSettings });
});

// Synchronize or Import Products from YourMart
app.post("/api/admin/yourmart/sync", authenticateToken, requireAdmin, (req, res) => {
  const { productIds, overrideMarkup } = req.body;
  if (!productIds) {
    return res.status(400).json({ error: "Specify product coordinates to synchronize." });
  }

  const db = readDB();
  if (!db.categories) db.categories = [];
  if (!db.products) db.products = [];

  const settings = db.yourmartSettings || { globalMarkup: 500, categoryMarkups: {} };

  const targetList = productIds === "all"
    ? YOURMART_CATALOG
    : YOURMART_CATALOG.filter(p => productIds.includes(p.id));

  let syncedCount = 0;

  for (const item of targetList) {
    let markup = settings.globalMarkup;
    if (settings.categoryMarkups && settings.categoryMarkups[item.category] !== undefined) {
      markup = Number(settings.categoryMarkups[item.category]);
    }

    if (overrideMarkup !== undefined && !isNaN(Number(overrideMarkup))) {
      markup = Number(overrideMarkup);
    }

    const selling_price = item.supplier_price + markup;

    // Ensure category exists in Ecom Network
    if (!db.categories.some(c => c.name.toLowerCase() === item.category.toLowerCase())) {
      db.categories.push({
        id: "c-" + Math.random().toString(36).substr(2, 9),
        name: item.category,
        slug: item.category.toLowerCase().replace(/\s+/g, "-")
      });
    }

    // Check if product already exists
    const existingIdx = db.products.findIndex(p => p.id === item.id);

    const productPayload: Product = {
      id: item.id,
      name: item.name,
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: item.description,
      images: item.images,
      category: item.category,
      stock: item.stock,
      supplier_price: item.supplier_price,
      markup_price: markup,
      selling_price: selling_price,
      price: selling_price, // for legacy code compatibility
      commissionPercent: 10,
      supplier: "YourMart",
      status: "Active",
      created_at: existingIdx !== -1 ? (db.products[existingIdx].created_at || new Date().toISOString()) : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      specifications: item.specifications,
      variants: item.variants
    };

    if (existingIdx !== -1) {
      productPayload.status = db.products[existingIdx].status || "Active";
      productPayload.commissionPercent = db.products[existingIdx].commissionPercent ?? 10;
      db.products[existingIdx] = productPayload;
    } else {
      db.products.push(productPayload);
    }

    syncedCount++;
  }

  writeDB(db);
  res.json({ success: true, count: syncedCount });
});

// Price Overwriting Endpoints
app.post("/api/admin/yourmart/override-price", authenticateToken, requireAdmin, (req, res) => {
  const { productId, sellingPrice } = req.body;
  if (!productId || sellingPrice === undefined || isNaN(Number(sellingPrice))) {
    return res.status(400).json({ error: "Product id and pricing are required." });
  }

  const db = readDB();
  const idx = db.products.findIndex(p => p.id === productId);
  if (idx === -1) {
    return res.status(404).json({ error: "Product not found." });
  }

  const prod = db.products[idx];
  const newPrice = Number(sellingPrice);

  if (prod.supplier_price !== undefined) {
    prod.markup_price = newPrice - prod.supplier_price;
  }
  prod.selling_price = newPrice;
  prod.price = newPrice;
  prod.updated_at = new Date().toISOString();

  writeDB(db);
  res.json({ success: true, product: prod });
});

// Bulk action (synchronize/delete/hide selected)
app.post("/api/admin/yourmart/bulk-action", authenticateToken, requireAdmin, (req, res) => {
  const { action, productIds, extraValue } = req.body;
  if (!action || !productIds || !productIds.length) {
    return res.status(400).json({ error: "Action and target product IDs are essential." });
  }

  const db = readDB();
  let affectedCount = 0;

  if (action === "sync_stock") {
    productIds.forEach((pid: string) => {
      const ymItem = YOURMART_CATALOG.find(y => y.id === pid);
      if (ymItem) {
        const prod = db.products.find(p => p.id === pid);
        if (prod) {
          prod.stock = ymItem.stock;
          prod.updated_at = new Date().toISOString();
          affectedCount++;
        }
      }
    });
  } else if (action === "delete") {
    const originalLen = db.products.length;
    db.products = db.products.filter(p => !productIds.includes(p.id));
    affectedCount = originalLen - db.products.length;
  } else if (action === "hide") {
    productIds.forEach((pid: string) => {
      const prod = db.products.find(p => p.id === pid);
      if (prod) {
        prod.status = "Hidden";
        prod.updated_at = new Date().toISOString();
        affectedCount++;
      }
    });
  } else if (action === "show") {
    productIds.forEach((pid: string) => {
      const prod = db.products.find(p => p.id === pid);
      if (prod) {
        prod.status = "Active";
        prod.updated_at = new Date().toISOString();
        affectedCount++;
      }
    });
  } else if (action === "update_markup") {
    const markupAmt = Number(extraValue);
    if (!isNaN(markupAmt)) {
      productIds.forEach((pid: string) => {
        const prod = db.products.find(p => p.id === pid);
        if (prod && prod.supplier_price !== undefined) {
          prod.markup_price = markupAmt;
          prod.selling_price = prod.supplier_price + markupAmt;
          prod.price = prod.selling_price;
          prod.updated_at = new Date().toISOString();
          affectedCount++;
        }
      });
    }
  }

  writeDB(db);
  res.json({ success: true, count: affectedCount });
});

// Admin Add Product
app.post("/api/admin/products", authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, commissionPercent, stock, category, imageUrl } = req.body;
  if (!name || !price || !stock || !category) {
    return res.status(400).json({ error: "Base product fields are essential." });
  }

  const db = readDB();
  const newProduct: Product = {
    id: "p-" + Math.random().toString(36).substr(2, 9),
    name,
    description: description || "Premium selected network retail commodity.",
    price: Number(price),
    commissionPercent: Number(commissionPercent) || 10,
    stock: Number(stock),
    category,
    images: [imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600"]
  };

  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json({ success: true, product: newProduct });
});

// Admin Edit Product
app.put("/api/admin/products/:id", authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, commissionPercent, stock, category, imageUrl } = req.body;
  const db = readDB();
  const idx = db.products.findIndex((p) => p.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: "Product node not identified." });
  }

  db.products[idx] = {
    ...db.products[idx],
    name: name || db.products[idx].name,
    description: description || db.products[idx].description,
    price: price !== undefined ? Number(price) : db.products[idx].price,
    commissionPercent: commissionPercent !== undefined ? Number(commissionPercent) : db.products[idx].commissionPercent,
    stock: stock !== undefined ? Number(stock) : db.products[idx].stock,
    category: category || db.products[idx].category,
    images: imageUrl ? [imageUrl] : db.products[idx].images
  };

  writeDB(db);
  res.json({ success: true, product: db.products[idx] });
});

// Admin Delete Product
app.delete("/api/admin/products/:id", authenticateToken, requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex((p) => p.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: "Product node not resolved." });
  }

  db.products.splice(idx, 1);
  writeDB(db);
  res.json({ success: true });
});

// GET categories
app.get("/api/categories", (req, res) => {
  const db = readDB();
  res.json({ categories: db.categories || [] });
});

app.post("/api/admin/categories", authenticateToken, requireAdmin, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Category name input essential." });

  const db = readDB();
  const newCat = {
    id: "c-" + Math.random().toString(36).substr(2, 9),
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-")
  };
  db.categories.push(newCat);
  writeDB(db);
  res.json({ success: true, category: newCat });
});

// ----------------------------------------------------
// ORDER & RETAIL SALES CHANNELS APIS
// ----------------------------------------------------
// Get Direct order book
app.get("/api/orders", authenticateToken, (req: any, res) => {
  const db = readDB();
  const myOrders = db.orders.filter((o) => o.userId === req.user.id);
  res.json({ orders: myOrders });
});

// Reseller client Checkout
app.post("/api/orders/checkout", authenticateToken, (req: any, res) => {
  const { items, customerDetails, payMethod } = req.body;
  if (!items || !items.length || !customerDetails || !customerDetails.name || !customerDetails.phone) {
    return res.status(400).json({ error: "Complete items selection and shipping credentials are mandatory." });
  }

  const db = readDB();

  // Validate stock levels and map items
  const resolvedItems: OrderItem[] = [];
  let totalAmount = 0;

  for (const it of items) {
    const parentProduct = db.products.find((p) => p.id === it.productId);
    if (!parentProduct) {
      return res.status(404).json({ error: `Product node with ID ${it.productId} not located in directory.` });
    }
    if (parentProduct.stock < it.quantity) {
      return res.status(400).json({ error: `Insufficient inventory for physical item "${parentProduct.name}". Only ${parentProduct.stock} left in warehousing.` });
    }

    // Deduct stock
    parentProduct.stock -= it.quantity;

    resolvedItems.push({
      productId: parentProduct.id,
      name: parentProduct.name,
      price: parentProduct.price,
      quantity: it.quantity,
      commissionPercent: parentProduct.commissionPercent
    });

    totalAmount += parentProduct.price * it.quantity;
  }

  // Calculate base commission pool (e.g. 10% of totalAmount)
  const productSalesCommissionBaseAmt = totalAmount;

  const newOrder: Order = {
    id: "ord-" + Math.floor(100000 + Math.random() * 900000),
    userId: req.user.id,
    username: req.user.username,
    items: resolvedItems,
    totalAmount,
    totalCommissionGenerated: productSalesCommissionBaseAmt,
    customerDetails,
    payMethod: payMethod || "JazzCash",
    status: "Pending",
    createdAt: new Date().toISOString(),
    commissionDistributed: false
  };

  db.orders.push(newOrder);

  // Link as a registered retail customer if they don't already exist
  const existingCust = db.customers.find(
    (c) => c.referredByUserId === req.user.id && c.phone === customerDetails.phone
  );
  if (!existingCust) {
    db.customers.push({
      id: "cust-" + Math.random().toString(36).substr(2, 9),
      referredByUserId: req.user.id,
      name: customerDetails.name,
      email: customerDetails.email || `${customerDetails.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
      phone: customerDetails.phone,
      city: customerDetails.city || "Rawalpindi",
      address: customerDetails.address || "Main Street Address",
      createdAt: new Date().toISOString()
    });
  }

  // Generate multi-level sales overrides as PENDING. Approved/Distributed only when order transitions to active states!
  // LEVEL 1 Direct Sponsor
  const rates = db.commissionRates;
  let sponsorL1 = db.users.find((u) => u.referralCode === req.user.referredBy);

  if (sponsorL1) {
    const l1Amt = Math.round(productSalesCommissionBaseAmt * (rates.level1 / 100));
    db.commissions.push({
      id: "comm-" + Math.random().toString(36).substr(2, 9),
      userId: sponsorL1.id,
      username: sponsorL1.username,
      fromUsername: req.user.username,
      amount: l1Amt,
      orderId: newOrder.id,
      level: 1,
      status: "Pending",
      createdAt: new Date().toISOString()
    });

    // Update pending ledger wallet
    const w1 = db.wallets.find((w) => w.userId === sponsorL1!.id);
    if (w1) w1.pending += l1Amt;

    // LEVEL 2 Grand-Sponsor
    if (!rates.disableMultiLevel && sponsorL1.referredBy) {
      const sponsorL2 = db.users.find((u) => u.referralCode === sponsorL1!.referredBy);
      if (sponsorL2) {
        const l2Amt = Math.round(productSalesCommissionBaseAmt * (rates.level2 / 100));
        db.commissions.push({
          id: "comm-" + Math.random().toString(36).substr(2, 9),
          userId: sponsorL2.id,
          username: sponsorL2.username,
          fromUsername: req.user.username,
          amount: l2Amt,
          orderId: newOrder.id,
          level: 2,
          status: "Pending",
          createdAt: new Date().toISOString()
        });

        const w2 = db.wallets.find((w) => w.userId === sponsorL2.id);
        if (w2) w2.pending += l2Amt;

        // LEVEL 3 Great-Grand-Sponsor
        if (sponsorL2.referredBy) {
          const sponsorL3 = db.users.find((u) => u.referralCode === sponsorL2.referredBy);
          if (sponsorL3) {
            const l3Amt = Math.round(productSalesCommissionBaseAmt * (rates.level3 / 100));
            db.commissions.push({
              id: "comm-" + Math.random().toString(36).substr(2, 9),
              userId: sponsorL3.id,
              username: sponsorL3.username,
              fromUsername: req.user.username,
              amount: l3Amt,
              orderId: newOrder.id,
              level: 3,
              status: "Pending",
              createdAt: new Date().toISOString()
            });

            const w3 = db.wallets.find((w) => w.userId === sponsorL3.id);
            if (w3) w3.pending += l3Amt;
          }
        }
      }
    }
  }

  // Notify purchaser
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: req.user.id,
    title: "Order Submitted Successfully!",
    message: `Your client checkout dropship order reference #${newOrder.id} of ${totalAmount.toLocaleString()} PKR is recorded.`,
    type: "order",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  writeDB(db);
  res.status(201).json({ success: true, order: newOrder });
});

// Public customer checkout (storefront sales)
app.post("/api/public/orders/checkout", (req, res) => {
  const { items, customerDetails, payMethod, resellerCode } = req.body;
  if (!items || !items.length || !customerDetails || !customerDetails.name || !customerDetails.phone) {
    return res.status(400).json({ error: "Complete items selection and shipping credentials are mandatory." });
  }

  const db = readDB();

  // Find associated affiliate dropshipper by referral/reseller code
  let affiliateUser = null;
  if (resellerCode) {
    affiliateUser = db.users.find(u => u.referralCode === resellerCode);
  }
  // Fallback to first admin or first user if none provided or matched
  if (!affiliateUser) {
    affiliateUser = db.users.find(u => u.role === "admin") || db.users[0];
  }

  if (!affiliateUser) {
    return res.status(500).json({ error: "SaaS reseller structure is offline. Please contact manager support." });
  }

  // Validate stock levels and map items
  const resolvedItems: any[] = [];
  let totalAmount = 0;

  for (const it of items) {
    const parentProduct = db.products.find((p) => p.id === it.productId);
    if (!parentProduct) {
      return res.status(404).json({ error: `Product item ${it.productId} not found in inventory.` });
    }
    if (parentProduct.stock < it.quantity) {
      return res.status(400).json({ error: `Insufficient stock for "${parentProduct.name}". Only ${parentProduct.stock} left in warehouse.` });
    }

    // Deduct stock
    parentProduct.stock -= it.quantity;

    resolvedItems.push({
      productId: parentProduct.id,
      name: parentProduct.name,
      price: parentProduct.price,
      quantity: it.quantity,
      commissionPercent: parentProduct.commissionPercent || 10
    });

    totalAmount += parentProduct.price * it.quantity;
  }

  // Calculate base commission pool
  const productSalesCommissionBaseAmt = totalAmount;

  const newOrder: any = {
    id: "ord-pub-" + Math.floor(100000 + Math.random() * 900000),
    userId: affiliateUser.id,
    username: affiliateUser.username,
    items: resolvedItems,
    totalAmount,
    totalCommissionGenerated: productSalesCommissionBaseAmt,
    customerDetails,
    payMethod: payMethod || "JazzCash",
    status: "Pending",
    createdAt: new Date().toISOString(),
    commissionDistributed: false
  };

  db.orders.push(newOrder);

  // Link as a registered customer
  const existingCust = db.customers.find(
    (c) => c.referredByUserId === affiliateUser.id && c.phone === customerDetails.phone
  );
  if (!existingCust) {
    db.customers.push({
      id: "cust-" + Math.random().toString(36).substr(2, 9),
      referredByUserId: affiliateUser.id,
      name: customerDetails.name,
      email: customerDetails.email || `${customerDetails.name.toLowerCase().replace(/\s+/g, "")}@example.com`,
      phone: customerDetails.phone,
      city: customerDetails.city || "Rawalpindi",
      address: customerDetails.address || "Main Street Address",
      createdAt: new Date().toISOString()
    });
  }

  // Auto distribute MLM commission overrides
  const rates = db.commissionRates || { level1: 10, level2: 5, level3: 2.5 };
  
  // Direct referrer commission (affiliate itself receives L1 since it represents their customer!)
  const directCommissionAmt = Math.round(productSalesCommissionBaseAmt * (rates.level1 / 100));
  db.commissions.push({
    id: "comm-" + Math.random().toString(36).substr(2, 9),
    userId: affiliateUser.id,
    username: affiliateUser.username,
    fromUsername: "Customer Checkout",
    amount: directCommissionAmt,
    orderId: newOrder.id,
    level: 1,
    status: "Pending",
    createdAt: new Date().toISOString()
  });

  const wDirect = db.wallets.find(w => w.userId === affiliateUser.id);
  if (wDirect) {
    wDirect.pending += directCommissionAmt;
  }

  // Parent sponsor node gets Level 2
  let sponsorL2 = db.users.find(u => u.referralCode === affiliateUser.referredBy);
  if (sponsorL2) {
    const l2Amt = Math.round(productSalesCommissionBaseAmt * (rates.level2 / 100));
    db.commissions.push({
      id: "comm-" + Math.random().toString(36).substr(2, 9),
      userId: sponsorL2.id,
      username: sponsorL2.username,
      fromUsername: affiliateUser.username,
      amount: l2Amt,
      orderId: newOrder.id,
      level: 2,
      status: "Pending",
      createdAt: new Date().toISOString()
    });

    const w2 = db.wallets.find(w => w.userId === sponsorL2.id);
    if (w2) w2.pending += l2Amt;

    // Grandparent sponsor gets Level 3
    if (sponsorL2.referredBy) {
      const sponsorL3 = db.users.find(u => u.referralCode === sponsorL2.referredBy);
      if (sponsorL3) {
        const l3Amt = Math.round(productSalesCommissionBaseAmt * (rates.level3 / 100));
        db.commissions.push({
          id: "comm-" + Math.random().toString(36).substr(2, 9),
          userId: sponsorL3.id,
          username: sponsorL3.username,
          fromUsername: sponsorL2.username,
          amount: l3Amt,
          orderId: newOrder.id,
          level: 3,
          status: "Pending",
          createdAt: new Date().toISOString()
        });

        const w3 = db.wallets.find(w => w.userId === sponsorL3.id);
        if (w3) w3.pending += l3Amt;
      }
    }
  }

  // Notify the affiliate dropshipper
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: affiliateUser.id,
    title: "New Public Store Checkout!",
    message: `A client placed order #${newOrder.id} for ${totalAmount.toLocaleString()} PKR. Potential commission: ${directCommissionAmt} PKR!`,
    type: "order",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  writeDB(db);
  res.status(201).json({ success: true, order: newOrder });
});

// Public order tracking
app.get("/api/public/orders/track", (req, res) => {
  const { phone, id } = req.query;
  if (!phone && !id) {
    return res.status(400).json({ error: "Provide a registered phone number or order ID to trace." });
  }

  const db = readDB();
  let matches = db.orders;

  if (id) {
    matches = matches.filter(o => o.id.toLowerCase() === String(id).toLowerCase().trim());
  }

  if (phone) {
    matches = matches.filter(o => o.customerDetails && o.customerDetails.phone.trim() === String(phone).trim());
  }

  res.json({ orders: matches });
});

// ----------------------------------------------------
// CUSTOMERS APIS
// ----------------------------------------------------
app.get("/api/customers", authenticateToken, (req: any, res) => {
  const db = readDB();
  const myCust = db.customers.filter((c) => c.referredByUserId === req.user.id);
  res.json({ customers: myCust });
});

app.post("/api/customers", authenticateToken, (req: any, res) => {
  const { name, email, phone, city, address } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: "Customer name and phone indicators are obligatory." });
  }

  const db = readDB();
  
  if (db.customers.some((c) => c.referredByUserId === req.user.id && c.phone === phone)) {
    return res.status(400).json({ error: "This customer contact coordinates are already indexed." });
  }

  const newCust: Customer = {
    id: "cust-" + Math.random().toString(36).substr(2, 9),
    referredByUserId: req.user.id,
    name,
    email: email || `${name.toLowerCase().replace(/\s+/g, "")}@example.com`,
    phone,
    city: city || "Pakistan",
    address: address || "Residential Address",
    createdAt: new Date().toISOString()
  };

  db.customers.push(newCust);
  writeDB(db);
  res.status(201).json({ success: true, customer: newCust });
});

// ----------------------------------------------------
// WALLET WITHDRAWAL REQUESTS
// ----------------------------------------------------
app.post("/api/wallet/withdraw", authenticateToken, (req: any, res) => {
  const { amount, method, details } = req.body;
  if (!amount || !method || !details) {
    return res.status(400).json({ error: "Amount, method protocol and account details coordinates must be supplied." });
  }

  const numericAmt = Number(amount);
  if (isNaN(numericAmt) || numericAmt < 500) {
    return res.status(400).json({ error: "Minimum disbursement clearance threshold is 500 PKR." });
  }

  const db = readDB();
  const w = db.wallets.find((wal) => wal.userId === req.user.id);

  if (!w || w.available < numericAmt) {
    return res.status(400).json({ error: "Unavailable cleared funds. Complete more network sales to accrue payout credits." });
  }

  // Deduct available
  w.available -= numericAmt;

  const newWithdrawal: Withdrawal = {
    id: "w-" + Math.floor(100000 + Math.random() * 900000),
    userId: req.user.id,
    username: req.user.username,
    amount: numericAmt,
    method,
    details,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  db.withdrawals.push(newWithdrawal);

  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: req.user.id,
    title: "Disbursement Logged!",
    message: `Your disbursement ticket of ${numericAmt} PKR has been placed in validation queue.`,
    type: "withdrawal",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, withdrawal: newWithdrawal });
});

app.post("/api/notifications/read-all", authenticateToken, (req: any, res) => {
  const db = readDB();
  db.notifications.forEach((n) => {
    if (n.userId === req.user.id) n.isRead = true;
  });
  writeDB(db);
  res.json({ success: true });
});

// ----------------------------------------------------
// AI COPYWRITER PROXY (GEMINI AI Integration)
// ----------------------------------------------------
app.post("/api/gemini/copywriter", authenticateToken, async (req: any, res) => {
  const { format, product, targetAudience } = req.body;
  if (!format || !product) {
    return res.status(400).json({ error: "Format and product attributes are mandatory." });
  }

  const promptStr = `Draft a high-conversion social media retail ad template for:
Format: ${format} (options: WhatsApp Hook, TikTok Script, Facebook Ad copy, Instagram Caption)
Product Item Name: ${product}
Target Client Base: ${targetAudience || "Pakistani consumers seeking high quality modern premium items"}
Cooperative Sales Desk Brand: Ecom Network Pakistan

Include engaging retail copy guidelines, call-to-action to buy through the link, spacing, and appropriate tags. Make it modern, credible, and free of hype, emphasizing premium value. No get-rich-quick elements. Only product retail superiority.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptStr,
        config: {
          systemInstruction: "You are the lead product copywriter at Ecom Network Pakistan. You write credible, high-converting product descriptions and sales copy for social commerce resellers.",
        }
      });
      return res.json({ copy: response.text });
    } catch (err: any) {
      console.error("Gemini failed, using template:", err);
    }
  }

  // Precompiled Fallbacks
  const templates: Record<string, string> = {
    "WhatsApp Hook": `🛍️ *PREMIUM PRODUCT ARRIVAL!* 🛍️\n\nUpgrade your lifestyle index with the amazing *${product}* directly sourced on Ecom Network Pakistan! \n\n✨ *Why Everyone is Ordering This:*\n• Certified premium build quality.\n• Lightning-fast shipping delivered right to your doorstep.\n• Full 7-day money-back assurance.\n\n👇 *Browse and place orders instantly here:*\n🌐 ecomnetwork.pk/shop?store=${req.user.referralCode}\n\nCoordination desk is open for physical details! Send a chat!`,
    "TikTok Script": `🎬 [SHORT-VIDEO SALES SCRIPT]\n\n[Visual: Beautiful hands unpacking a high-quality cardboard packaging of ${product}. Close up focus on texture.]\n\n*VOICE OVER:*\n"Outdated generic items leak your budget. Meet the all-new ${product}—engineered strictly for premium everyday performance."\n\n[Visual: Live display mapping functional features.]\n\n*VOICE OVER:*\n"Fast cash-on-delivery nation-wide. Link in bio—claim exclusive client order discount today!"`,
    "Facebook Ad copy": `🔥 **DISCOVER EVERYDAY EXCELLENCE — DELIVERED GLOBALLY** 🔥\n\nReselling obsolete generic inventory is a drag. Introduce your clients to the remarkable launch of **${product}**:\n\n✔️ 100% Certified Authentic Quality Guarantee.\n✔️ Direct Local Doorstep fulfillment + secure online clearance rails.\n\n👉 **SAMPLES AND SECURE RESERVATIONS BELOW:**\nLink: ecomnetwork.pk?ref=${req.user.referralCode}`,
    "Instagram Caption": `Elevated value only. 🎯 \n\nNo clutter, no compromise. The launch of the luxury *${product}* bridges classic posturing with high technical utility.\n\n⚡️ Fast Cash on Delivery across Pakistan.\n⚡️ Premium reseller guarantee support.\n\n✨ Direct link in bio to checkout securely. Store affiliation: *${req.user.referralCode}*\n\n#EcomNetwork #ResellElite #PakistanEcom #GenuineCommodity #${product.replace(/\s+/g, "")}`
  };

  res.json({ copy: templates[format] || templates["WhatsApp Hook"] });
});

// ----------------------------------------------------
// SECURE ADMINISTRATIVE DESK CONSOLE ENDPOINTS
// ----------------------------------------------------

// Admin Analytics Overview
app.get("/api/admin/analytics", authenticateToken, requireAdmin, (req, res) => {
  const db = readDB();

  const totalUsers = db.users.length;
  const activeMembers = db.users.filter((u) => u.isActivated).length;
  const inactiveMembers = db.users.filter((u) => !u.isActivated).length;

  const totalPinsSold = db.epins.length;
  const totalRevenue = (totalPinsSold * 950) + db.orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // Compute total pair incomes and total bonuses paid across all registered users
  let totalPairIncomePaid = 0;
  let totalBonusPaid = 0;
  db.users.forEach(u => {
    const mlm = computeMLMStats(db, u.id);
    totalPairIncomePaid += mlm.pairIncome;
    totalBonusPaid += (mlm.directReferralBonus + mlm.levelBonus);
  });

  const pendingWithdrawalsCount = db.withdrawals.filter((w) => w.status === "Pending").length;
  const totalPendingWithdrawalsAmount = db.withdrawals
    .filter(w => w.status === "Pending")
    .reduce((sum, w) => sum + w.amount, 0);

  const totalClearedWithdrawals = db.withdrawals
    .filter((w) => w.status === "Paid")
    .reduce((sum, w) => sum + w.amount, 0);

  res.json({
    stats: {
      totalUsers,
      activeMembers,
      inactiveMembers,
      totalPinsSold,
      totalRevenue,
      totalPairIncomePaid,
      totalBonusPaid,
      pendingWithdrawalsCount,
      totalPendingWithdrawalsAmount,
      totalWithdrawalsSettled: totalClearedWithdrawals,
      totalCommissionsPaid: db.commissions.filter((c) => c.status === "Approved").reduce((sum, c) => sum + c.amount, 0)
    },
    users: db.users.map((u: any) => ({
      id: u.id,
      user_id: u.user_id || u.id,
      name: u.full_name || u.name,
      username: u.username,
      email: u.email,
      mobile: u.phone || u.mobile,
      country: u.country,
      rank: u.rank,
      role: u.role,
      status: u.isSuspended ? "suspended" : (u.isActivated ? "active" : "pending"),
      createdAt: u.created_at || u.createdAt
    })),
    orders: db.orders,
    withdrawals: db.withdrawals,
    commissions: db.commissions,
    commissionRates: db.commissionRates,
    products: db.products,
    categories: db.categories,
    cms: db.cms
  });
});

// Admin Update User
app.put("/api/admin/users/:id", authenticateToken, requireAdmin, (req, res) => {
  const { name, email, rank, role, isSuspended } = req.body;
  const db = readDB();
  const idx = db.users.findIndex((u) => u.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ error: "User profile not identified." });
  }

  db.users[idx] = {
    ...db.users[idx],
    name: name || db.users[idx].name,
    email: email || db.users[idx].email,
    rank: rank || db.users[idx].rank,
    role: role || db.users[idx].role,
    isSuspended: isSuspended !== undefined ? isSuspended : db.users[idx].isSuspended
  };

  writeDB(db);
  res.json({ success: true, user: db.users[idx] });
});

// Admin Suspend User (Toggle)
app.post("/api/admin/user-status", authenticateToken, requireAdmin, (req, res) => {
  const { userId, status } = req.body;
  if (!userId || !status) return res.status(400).json({ error: "Credentials essential." });

  const db = readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User node not defined." });

  user.isSuspended = status === "suspended";
  writeDB(db);
  res.json({ success: true, isSuspended: user.isSuspended });
});

// Admin: Delete User
app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found." });

  db.users.splice(idx, 1);
  writeDB(db);
  res.json({ success: true });
});

// Admin Approve/Reject Order (This updates status and handles commission transition)
app.put("/api/admin/orders/:id", authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body; // Pending | Processing | Shipped | Delivered | Cancelled
  if (!status) return res.status(400).json({ error: "Specify target status translation." });

  const db = readDB();
  const index = db.orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Order context not identified." });
  }

  const order = db.orders[index];
  const oldStatus = order.status;
  order.status = status;

  // Trigger commission changes based on the order lifecycle transitions
  const relatedComm = db.commissions.filter((c) => c.orderId === order.id);

  if ((status === "Delivered" || status === "Processing" || status === "Shipped") && (oldStatus === "Pending" || oldStatus === "Cancelled")) {
    // Approve and pay commissions to wallets available
    relatedComm.forEach((comm) => {
      if (comm.status !== "Approved") {
        comm.status = "Approved";
        const w = db.wallets.find((wal) => wal.userId === comm.userId);
        if (w) {
          w.pending = Math.max(0, w.pending - comm.amount);
          w.available += comm.amount;
          w.totalEarned += comm.amount;
        }

        // Send Notification
        db.notifications.push({
          id: "n-" + Math.random().toString(36).substr(2, 9),
          userId: comm.userId,
          title: "Commission Approved! 🎉",
          message: `Your L${comm.level} commission of ${comm.amount} PKR from order #${order.id} is cleared!`,
          type: "commission",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    });
  } else if (status === "Cancelled" && (oldStatus === "Delivered" || oldStatus === "Processing" || oldStatus === "Shipped")) {
    // Revert approved commissions
    relatedComm.forEach((comm) => {
      if (comm.status === "Approved") {
        comm.status = "Rejected";
        const w = db.wallets.find((wal) => wal.userId === comm.userId);
        if (w) {
          w.available = Math.max(0, w.available - comm.amount);
          w.totalEarned = Math.max(0, w.totalEarned - comm.amount);
        }
      }
    });
  } else if (status === "Cancelled" && oldStatus === "Pending") {
    // Reject pending commissions
    relatedComm.forEach((comm) => {
      comm.status = "Rejected";
      const w = db.wallets.find((wal) => wal.userId === comm.userId);
      if (w) {
        w.pending = Math.max(0, w.pending - comm.amount);
      }
    });
  }

  // Notify buyer of status update
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: order.userId,
    title: `Order #${order.id} Status: ${status}`,
    message: `Your order tracking status was updated to "${status}" by warehousing staff.`,
    type: "order",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, order });
});

// Admin approve withdrawal payout clearance
app.post("/api/admin/withdrawal-clear", authenticateToken, requireAdmin, (req, res) => {
  const { withdrawalId, action } = req.body; // Approved | Rejected
  if (!withdrawalId || !action) return res.status(400).json({ error: "Verify target withdrawal coordinates." });

  const db = readDB();
  const index = db.withdrawals.findIndex((w) => w.id === String(withdrawalId));
  if (index === -1) return res.status(404).json({ error: "Withdrawal not resolved." });

  const withdraw = db.withdrawals[index];
  const oldStatus = withdraw.status;
  
  if (action === "Approved") {
    withdraw.status = "Paid";
    
    // Add toast notifications
    db.notifications.push({
      id: "n-" + Math.random().toString(36).substr(2, 9),
      userId: withdraw.userId,
      title: "Bank Outflow Completed!",
      message: `Your disbursement of ${withdraw.amount} PKR via ${withdraw.method} is cleared. Check your account receipts.`,
      type: "withdrawal",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  } else if (action === "Rejected") {
    withdraw.status = "Rejected";
    
    // Refund available balance
    const w = db.wallets.find((wal) => wal.userId === withdraw.userId);
    if (w) w.available += withdraw.amount;

    db.notifications.push({
      id: "n-" + Math.random().toString(36).substr(2, 9),
      userId: withdraw.userId,
      title: "Withdrawal Cleared Reject",
      message: `Your clearance payouts ticket of ${withdraw.amount} PKR was declined. Funds reverted to ledger.`,
      type: "withdrawal",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  writeDB(db);
  res.json({ success: true, withdrawal: withdraw });
});

// ----------------------------------------------------
// INTEGRATED E-PIN ACTIVATION SYSTEM ENDPOINTS
// ----------------------------------------------------

// 1. Get payment details (available to public/registered users)
app.get("/api/epins/payment-details", (req, res) => {
  const db = readDB();
  res.json({ paymentDetails: db.paymentDetails });
});

// 2. Admin update payment details
app.post("/api/admin/epins/payment-details", authenticateToken, requireAdmin, (req, res) => {
  const { easyPaisaMobile, easyPaisaName, jazzCashMobile, jazzCashName, bankName, bankAccount, bankTitle, cryptoAddress } = req.body;
  const db = readDB();

  db.paymentDetails = {
    easyPaisaMobile: easyPaisaMobile || db.paymentDetails.easyPaisaMobile,
    easyPaisaName: easyPaisaName || db.paymentDetails.easyPaisaName,
    jazzCashMobile: jazzCashMobile || db.paymentDetails.jazzCashMobile,
    jazzCashName: jazzCashName || db.paymentDetails.jazzCashName,
    bankName: bankName || db.paymentDetails.bankName,
    bankAccount: bankAccount || db.paymentDetails.bankAccount,
    bankTitle: bankTitle || db.paymentDetails.bankTitle,
    cryptoAddress: cryptoAddress || db.paymentDetails.cryptoAddress
  };

  writeDB(db);
  res.json({ success: true, paymentDetails: db.paymentDetails });
});

// 3. User request E-Pins by uploading / filing payment details
app.post("/api/epins/request", authenticateToken, (req: any, res) => {
  const { quantity, paymentMethod, transactionId, screenshotUrl, notes } = req.body;
  
  const pinsCount = Number(quantity);
  if (isNaN(pinsCount) || pinsCount <= 0) {
    return res.status(400).json({ error: "Please enter a valid count of E-pins." });
  }

  if (!paymentMethod || !transactionId) {
    return res.status(400).json({ error: "Payment method and Transaction ID are required." });
  }

  const db = readDB();
  const totalPrice = pinsCount * 950; // 950 PKR per pin

  const newRequest: EPinRequest = {
    id: "epr-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    userId: req.user.id,
    username: req.user.username,
    quantity: pinsCount,
    totalPrice,
    paymentMethod,
    transactionId,
    notes: notes || "",
    screenshotUrl: screenshotUrl || "",
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  db.epinRequests.push(newRequest);
  
  // Inform admin via a system-level alert or logs
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: req.user.id,
    title: "E-Pin Purchase Submitted",
    message: `Your request for ${pinsCount} E-Pin(s) totaling Rs. ${totalPrice.toLocaleString()} has been queued. Verification usually takes 1-2 hours.`,
    type: "order",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, request: newRequest });
});

// 4. User retrieve their owned E-Pins
app.get("/api/epins/my-pins", authenticateToken, (req: any, res) => {
  const db = readDB();
  
  const userPins = db.epins.filter(pin => pin.ownerId === req.user.id);
  const userRequests = db.epinRequests.filter(reqs => reqs.userId === req.user.id);

  const availablePins = userPins.filter(p => p.status === "Unused");
  const usedPins = userPins.filter(p => p.status === "Used");

  res.json({
    pins: userPins,
    requests: userRequests,
    summary: {
      total: userPins.length,
      available: availablePins.length,
      used: usedPins.length
    }
  });
});

// 5. Pin Activation System: activate a member using an E-Pin
app.post("/api/epins/activate", authenticateToken, (req: any, res) => {
  const { pinNumber, targetUsername, sponsorUsername, position: desiredPosition } = req.body;

  if (!pinNumber || !targetUsername || !sponsorUsername || !desiredPosition) {
    return res.status(400).json({ error: "All activation parameters (Pin, Target Guest, Sponsor, Placement) are mandatory." });
  }

  if (desiredPosition !== "left" && desiredPosition !== "right") {
    return res.status(400).json({ error: "Invalid placement direction." });
  }

  const db = readDB();

  // Find and validate the E-Pin
  const pinIndex = db.epins.findIndex(pin => pin.id === pinNumber);
  if (pinIndex === -1) {
    return res.status(400).json({ error: "E-Pin code not found in the registers." });
  }

  const pin = db.epins[pinIndex];
  if (pin.status !== "Unused") {
    return res.status(400).json({ error: `Selected pin has status: ${pin.status} and cannot be reused.` });
  }

  // Authorize: Caller must own this pin OR be the super-admin
  if (pin.ownerId !== req.user.id && req.user.role !== "admin") {
    return res.status(400).json({ error: "You do not own this E-Pin and cannot use it." });
  }

  // Find Target User
  const targetUserIndex = db.users.findIndex(u => u.username.toLowerCase() === targetUsername.toLowerCase());
  if (targetUserIndex === -1) {
    return res.status(400).json({ error: "Target account username not found." });
  }

  const targetUser = db.users[targetUserIndex];
  if (targetUser.isActivated) {
    return res.status(400).json({ error: "Target registered member is already active." });
  }

  // Find Sponsor (must be active)
  const sponsorIndex = db.users.findIndex(u => u.username.toLowerCase() === sponsorUsername.toLowerCase());
  if (sponsorIndex === -1) {
    return res.status(400).json({ error: "Designated sponsor username does not exist." });
  }

  const sponsor = db.users[sponsorIndex];
  if (!sponsor.isActivated) {
    return res.status(400).json({ error: "Designated sponsor must be activated before introducing downlines." });
  }

  // Calculate MLM Tree Placement position under the sponsor's specified side leg
  let parentId = "";
  let placementPosition: "left" | "right" = "left";

  const isPosLeft = desiredPosition === "left";
  const legFilter = isPosLeft ? "left" : "right";

  // Find if there is already a direct child on that side of sponsor
  const directLegChild = db.users.find(u => u.parentId === sponsor.id && u.position === legFilter && u.isActivated);

  if (!directLegChild) {
    parentId = sponsor.id;
    placementPosition = isPosLeft ? "left" : "right";
  } else {
    // There is already a node down this leg. Trace down the leg to find the first open slot.
    const placementResult = findOpenPosition(db.users.filter(u => u.isActivated), directLegChild.id);
    parentId = placementResult.parentId;
    placementPosition = placementResult.position;
  }

  // Apply activation
  targetUser.isActivated = true;
  targetUser.referredBy = sponsor.referralCode;
  targetUser.parentId = parentId;
  targetUser.position = placementPosition;

  // Use up the E-Pin
  pin.status = "Used";
  pin.activationDate = new Date().toISOString();
  pin.activatedUserId = targetUser.id;
  pin.activatedUsername = targetUser.username;
  pin.sponsorId = sponsor.id;
  pin.position = desiredPosition;

  // Notify target user
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: targetUser.id,
    title: "Account Activated! 🎉",
    message: `Welcome! Your Ecom Network profile was activated using Pin ${pin.id}. You have been placed under parent node ID: ${parentId}.`,
    type: "referral",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  // Notify activator (if they activated someone else)
  if (req.user.id !== targetUser.id) {
    db.notifications.push({
      id: "n-" + Math.random().toString(36).substr(2, 9),
      userId: req.user.id,
      title: "Affiliate Activated Successfully",
      message: `You successfully activated the profile of ${targetUser.name} (${targetUser.username}) using E-Pin ${pin.id}.`,
      type: "referral",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  writeDB(db);
  res.json({
    success: true,
    message: "Member activated and placed in team tree successfully.",
    pin,
    targetUser: { id: targetUser.id, username: targetUser.username, isActivated: true, parentId, position: placementPosition }
  });
});

// Admin endpoints
// 6. Get all E-pins & requests (Admin Control Room)
app.get("/api/admin/epins/all", authenticateToken, requireAdmin, (req, res) => {
  const db = readDB();
  res.json({
    epins: db.epins,
    requests: db.epinRequests
  });
});

// 7. Directly generate E-Pins (Admin bypass generate tool)
app.post("/api/admin/epins/generate", authenticateToken, requireAdmin, (req, res) => {
  const { quantity, ownerUsername } = req.body;
  const pinsCount = Number(quantity);
  
  if (isNaN(pinsCount) || pinsCount <= 0) {
    return res.status(400).json({ error: "Verify target quantity count." });
  }

  const db = readDB();
  
  // Find owner (or defaults to admin)
  let targetUser = db.users.find(u => u.username.toLowerCase() === (ownerUsername || "").toLowerCase());
  if (!targetUser) {
    targetUser = db.users.find(u => u.role === "admin") || db.users[0];
  }

  const existingPinCodes = db.epins.map(p => p.id);
  const newPins: EPin[] = [];

  for (let i = 0; i < pinsCount; i++) {
    const code = generatePinCode(existingPinCodes.concat(newPins.map(np => np.id)));
    const newPin: EPin = {
      id: code,
      status: "Unused",
      ownerId: targetUser.id,
      ownerUsername: targetUser.username,
      createdDate: new Date().toISOString()
    };
    newPins.push(newPin);
  }

  db.epins = db.epins.concat(newPins);

  // Notify the owner
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: targetUser.id,
    title: "E-Pins Deposited!",
    message: `${pinsCount} new E-Pin(s) was directly deposited into your cabinet by Ecom Admin.`,
    type: "referral",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, count: newPins.length, pins: newPins });
});

// 8. Approve client requested e-pins
app.post("/api/admin/epins/approve-request", authenticateToken, requireAdmin, (req, res) => {
  const { requestId } = req.body;
  
  const db = readDB();
  const reqIdx = db.epinRequests.findIndex(r => r.id === requestId);
  if (reqIdx === -1) {
    return res.status(404).json({ error: "E-Pin Purchase request not found." });
  }

  const purchaseReq = db.epinRequests[reqIdx];
  if (purchaseReq.status !== "Pending") {
    return res.status(400).json({ error: `Purchase request already ${purchaseReq.status}` });
  }

  // Find target requesting user
  const requestingUser = db.users.find(u => u.id === purchaseReq.userId);
  if (!requestingUser) {
    return res.status(400).json({ error: "The requesting user account no longer exists." });
  }

  // Approve purchase request
  purchaseReq.status = "Approved";

  // Generate requested pins inside owner account
  const existingPinCodes = db.epins.map(p => p.id);
  const newPins: EPin[] = [];

  for (let i = 0; i < purchaseReq.quantity; i++) {
    const code = generatePinCode(existingPinCodes.concat(newPins.map(np => np.id)));
    const pin: EPin = {
      id: code,
      status: "Unused",
      ownerId: seekingUserOrFallbackId(requestingUser.id),
      ownerUsername: requestingUser.username,
      createdDate: new Date().toISOString()
    };
    newPins.push(pin);
  }

  function seekingUserOrFallbackId(providedId: string) {
    return providedId || requestingUser.id;
  }

  db.epins = db.epins.concat(newPins);

  // Notify owner
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: requestingUser.id,
    title: "E-Pin Request Approved! 🟢",
    message: `Admin approved your deposit. ${purchaseReq.quantity} E-Pins (total Rs. ${purchaseReq.totalPrice.toLocaleString()}) have been credited to your cabin!`,
    type: "referral",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, request: purchaseReq, pinsCreatedCount: newPins.length });
});

// 9. Reject client requested pins
app.post("/api/admin/epins/reject-request", authenticateToken, requireAdmin, (req, res) => {
  const { requestId, reason } = req.body;

  const db = readDB();
  const reqIdx = db.epinRequests.findIndex(r => r.id === requestId);
  if (reqIdx === -1) {
    return res.status(404).json({ error: "Purchase request not found." });
  }

  const purchaseReq = db.epinRequests[reqIdx];
  if (purchaseReq.status !== "Pending") {
    return res.status(400).json({ error: `Purchase request already has status: ${purchaseReq.status}` });
  }

  // Reject
  purchaseReq.status = "Rejected";
  if (reason) {
    purchaseReq.notes = (purchaseReq.notes ? purchaseReq.notes + " | " : "") + "Reject reason: " + reason;
  }

  // Notify
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: purchaseReq.userId,
    title: "E-Pin Request Rejected 🔴",
    message: `Your deposit inquiry for ${purchaseReq.quantity} E-Pin(s) was declined. Details: ${reason || "Verification mismatch"}`,
    type: "referral",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, request: purchaseReq });
});

// 10. Transfer E-Pin from current owner to another
app.post("/api/admin/epins/transfer", authenticateToken, requireAdmin, (req, res) => {
  const { pinNumber, recipientUsername } = req.body;
  if (!pinNumber || !recipientUsername) {
    return res.status(400).json({ error: "Specify E-Pin number and recipient username." });
  }

  const db = readDB();
  const pinIdx = db.epins.findIndex(p => p.id === pinNumber);
  if (pinIdx === -1) {
    return res.status(404).json({ error: "Selected pin not found." });
  }

  const pin = db.epins[pinIdx];
  if (pin.status !== "Unused") {
    return res.status(400).json({ error: `Cannot transfer pin that has status: ${pin.status}` });
  }

  // Find recipient
  const recipient = db.users.find(u => u.username.toLowerCase() === recipientUsername.toLowerCase());
  if (!recipient) {
    return res.status(404).json({ error: "Recipient username does not exist." });
  }

  const oldOwnerId = pin.ownerId;
  pin.ownerId = recipient.id;
  pin.ownerUsername = recipient.username;

  // Notify recipient
  db.notifications.push({
    id: "n-" + Math.random().toString(36).substr(2, 9),
    userId: recipient.id,
    title: "E-Pin Transferred To You",
    message: `You received E-Pin ${pin.id} from Ecom Network Admin.`,
    type: "referral",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, pin });
});

// 11. Deactivate/Activate E-Pin
app.post("/api/admin/epins/deactivate", authenticateToken, requireAdmin, (req, res) => {
  const { pinNumber, action } = req.body; // "deactivate" | "delete"
  if (!pinNumber) return res.status(400).json({ error: "Pin number coordinates missing." });

  const db = readDB();
  const pinIdx = db.epins.findIndex(p => p.id === pinNumber);
  if (pinIdx === -1) return res.status(404).json({ error: "Pin not found." });

  const pin = db.epins[pinIdx];

  if (action === "delete") {
    db.epins.splice(pinIdx, 1);
    writeDB(db);
    return res.json({ success: true, message: "E-Pin deleted successfully." });
  } else {
    pin.status = pin.status === "Deactivated" ? "Unused" : "Deactivated";
    writeDB(db);
    return res.json({ success: true, pin });
  }
});

// Admin: Edit Commission rates
app.post("/api/admin/commission-rates", authenticateToken, requireAdmin, (req, res) => {
  const { level1, level2, level3, disableMultiLevel } = req.body;
  const db = readDB();

  db.commissionRates = {
    level1: level1 !== undefined ? Number(level1) : db.commissionRates.level1,
    level2: level2 !== undefined ? Number(level2) : db.commissionRates.level2,
    level3: level3 !== undefined ? Number(level3) : db.commissionRates.level3,
    disableMultiLevel: disableMultiLevel !== undefined ? Boolean(disableMultiLevel) : db.commissionRates.disableMultiLevel
  };

  writeDB(db);
  res.json({ success: true, rates: db.commissionRates });
});

// Admin Broadcast Push Coordinates
app.post("/api/admin/broadcast", authenticateToken, requireAdmin, (req, res) => {
  const { title, message, targetRole } = req.body;
  if (!title || !message) return res.status(400).json({ error: "Broadcast text essential." });

  const db = readDB();
  const targetedUsers = db.users.filter((u) => {
    if (targetRole === "admin") return u.role === "admin";
    if (targetRole === "member") return u.role === "user";
    return true; // all
  });

  targetedUsers.forEach((u) => {
    db.notifications.push({
      id: "n-" + Math.random().toString(36).substr(2, 9),
      userId: u.id,
      title: `📣 Platform Bulletin: ${title}`,
      message,
      type: "referral",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  });

  writeDB(db);
  res.json({ success: true, count: targetedUsers.length });
});

// Admin Edit Website content
app.get("/api/admin/cms", (req, res) => {
  const db = readDB();
  res.json({ cms: db.cms });
});

app.post("/api/admin/cms", authenticateToken, requireAdmin, (req, res) => {
  const { heroTitle, heroSubtitle, aboutText } = req.body;
  const db = readDB();

  db.cms = {
    ...db.cms,
    heroTitle: heroTitle || db.cms.heroTitle,
    heroSubtitle: heroSubtitle || db.cms.heroSubtitle,
    aboutText: aboutText || db.cms.aboutText
  };

  writeDB(db);
  res.json({ success: true, cms: db.cms });
});

// ----------------------------------------------------
// VITE DEV SERVER / STATIC PRODUCTION FALLBACK
// ----------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Ecom Network full-stack application running in DEV on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Ecom Network full-stack application running in PROD on http://localhost:${PORT}`);
  });
}
