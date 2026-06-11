export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // Resolves to LucideIcon
  badge?: string;
  delay: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  avatarUrl: string;
  rating: number;
  quote: string;
  metricLabel: string;
  metricValue: string;
}

export interface HowItWorksStep {
  id: number;
  title: string;
  description: string;
  iconName: string;
  details: string[];
}

export interface EcosystemNode {
  id: string;
  title: string;
  description: string;
  iconName: string;
  x: number; // Percent position in dashboard container
  y: number; // Percent position in dashboard container
  colorClass: string;
  detailsList: string[];
}

export interface ComparisonRow {
  benefit: string;
  traditionalJob: string;
  traditionalMLM: string;
  ecomNetwork: string;
  isPositive: boolean[];
}
