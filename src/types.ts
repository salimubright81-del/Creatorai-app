export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator';
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended';
  createdAt: string;
  generationsCount: number;
  generationsToday: number;
  lastGenerationDate: string;
  bio?: string;
  niche?: string;
  country?: string;
}

export interface UserLimits {
  dailyLimit: number;
  generationsToday: number;
  remainingToday: number;
}

export interface GeneratedItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  topic: string;
  platform?: string;
  content: string;
  structured?: {
    hook?: string;
    body?: string;
    callToAction?: string;
    hashtags?: string[];
    scenes?: Array<{ scene: number; visual: string; audio: string }>;
    visualPrompts?: string;
    estimatedDuration?: string;
    wordCount?: number;
  };
  posterData?: {
    headline: string;
    subheadline?: string;
    badge?: string;
    cta?: string;
    brandName?: string;
    theme: string;
    aspectRatio: string;
    imageUrl?: string;
    prompt?: string;
  };
  isFavorite: boolean;
  createdAt: string;
}

export interface PlanInfo {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  badge?: string;
  priceMonthly: number;
  priceYearly: number;
  dailyGenerations: number;
  features: string[];
}

export interface AdminAnalytics {
  totalUsers: number;
  totalGenerations: number;
  planCounts: {
    free: number;
    pro: number;
    enterprise: number;
  };
  typeBreakdown: Record<string, number>;
  recentUsers: Partial<User>[];
  recentGenerations: Partial<GeneratedItem>[];
}

export interface SystemConfig {
  freeDailyLimit: number;
  proDailyLimit: number;
  enterpriseDailyLimit: number;
  proMonthlyPrice: number;
  proYearlyPrice: number;
  enterpriseMonthlyPrice: number;
  maintenanceMode: boolean;
  announcement: string;
  allowGuestGenerations: boolean;
  guestDailyLimit: number;
}
