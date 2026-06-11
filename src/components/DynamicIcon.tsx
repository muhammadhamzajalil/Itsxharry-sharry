import React from "react";
import { 
  UserPlus, 
  Users, 
  TrendingUp, 
  Link2, 
  ShoppingBag, 
  Share2, 
  Sparkles, 
  Gift, 
  GitMerge, 
  Award,
  Globe, 
  Cpu, 
  BookOpen, 
  Wallet, 
  Shuffle, 
  LineChart, 
  PieChart, 
  Headphones,
  Zap,
  CheckCircle2,
  ChevronRight,
  Play,
  ArrowRight,
  DollarSign,
  Calendar,
  RefreshCw,
  Star,
  Moon,
  Sun,
  ArrowUpRight,
  Check,
  X,
  PhoneCall,
  Mail,
  MapPin,
  Copy,
  ExternalLink,
  ShieldCheck,
  Clock,
  Menu,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
  UserPlus,
  Users,
  TrendingUp,
  Link2,
  ShoppingBag,
  Share2,
  Sparkles,
  Gift,
  GitMerge,
  Award,
  Globe,
  Cpu,
  BookOpen,
  Wallet,
  Shuffle,
  LineChart,
  PieChart,
  Headphones,
  Zap,
  CheckCircle2,
  ChevronRight,
  Play,
  ArrowRight,
  DollarSign,
  Calendar,
  RefreshCw,
  Star,
  Moon,
  Sun,
  ArrowUpRight,
  Check,
  X,
  PhoneCall,
  Mail,
  MapPin,
  Copy,
  ExternalLink,
  ShieldCheck,
  Clock,
  Menu,
  ChevronDown,
  ChevronUp
};

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "", size }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    // Fallback icon
    return <Zap className={className} size={size} />;
  }
  return <IconComponent className={className} size={size} />;
};
