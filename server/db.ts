import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'creator';
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended';
  createdAt: string;
  generationsCount: number;
  generationsToday: number;
  lastGenerationDate: string; // YYYY-MM-DD
  bio?: string;
  niche?: string;
  country?: string;
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
  };
  isFavorite: boolean;
  createdAt: string;
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

export interface DatabaseSchema {
  users: User[];
  items: GeneratedItem[];
  config: SystemConfig;
  guestUsage: Record<string, { count: number; date: string }>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Simple fast hash for demo credentials
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash)}_${password.length}`;
}

const DEFAULT_CONFIG: SystemConfig = {
  freeDailyLimit: 5,
  proDailyLimit: 150,
  enterpriseDailyLimit: 9999,
  proMonthlyPrice: 19,
  proYearlyPrice: 190,
  enterpriseMonthlyPrice: 49,
  maintenanceMode: false,
  announcement: "🚀 Welcome to CreatorAI! Generate viral scripts, posts, ads & captions in seconds.",
  allowGuestGenerations: true,
  guestDailyLimit: 3,
};

const DEFAULT_USERS: User[] = [
  {
    id: 'user_admin_01',
    name: 'CreatorAI Administrator',
    email: 'admin@creatorai.com',
    passwordHash: hashPassword('admin123'),
    role: 'admin',
    plan: 'enterprise',
    status: 'active',
    createdAt: new Date().toISOString(),
    generationsCount: 42,
    generationsToday: 0,
    lastGenerationDate: new Date().toISOString().split('T')[0],
    bio: 'System Administrator & CreatorAI Operations',
    niche: 'Technology',
    country: 'Global'
  },
  {
    id: 'user_demo_02',
    name: 'Salimu Bright',
    email: 'salimubright81@gmail.com',
    passwordHash: hashPassword('creator123'),
    role: 'creator',
    plan: 'pro',
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    generationsCount: 18,
    generationsToday: 1,
    lastGenerationDate: new Date().toISOString().split('T')[0],
    bio: 'Digital Entrepreneur & Content Creator',
    niche: 'Business & eCommerce',
    country: 'Nigeria'
  }
];

const DEFAULT_ITEMS: GeneratedItem[] = [
  {
    id: 'item_sample_01',
    userId: 'user_demo_02',
    type: 'tiktok_script',
    title: 'How to scale your small business with zero ads in 2026',
    topic: 'Small business growth on TikTok',
    platform: 'tiktok',
    content: `🔥 HOOK (0-3s):
"If you are running a business in 2026 and still waiting for customers to walk into your shop, you are losing money every single hour."

🎬 SCENE 1 (Visual: Creator pointing at smartphone with dashboard):
"Look at this. Over 70% of high-converting sales now come from short-form videos showing behind-the-scenes authenticity, not fancy studio commercials."

🎬 SCENE 2 (Visual: Quick cuts of packaging an order and customer unboxing):
"Step 1: Stop selling the product. Start selling the transformation.
Step 2: Show your actual process—the hustle, packaging the parcel, answering customer DMs.
Step 3: Pin a comment with your direct WhatsApp or order link."

🎯 CALL TO ACTION:
"Drop your business niche in the comments and I'll reply with 3 viral video ideas you can film today!"`,
    structured: {
      hook: "If you are running a business in 2026 and still waiting for customers to walk into your shop, you are losing money every single hour.",
      callToAction: "Drop your business niche in the comments and I'll reply with 3 viral video ideas you can film today!",
      hashtags: ['#SmallBusinessTips', '#TikTokGrowth', '#EntrepreneurLife', '#ContentCreation', '#BusinessOwner'],
      estimatedDuration: '45 seconds',
      wordCount: 140
    },
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'item_sample_02',
    userId: 'user_demo_02',
    type: 'business_ad',
    title: 'Urban Kicks Sneaker Drop - Facebook & WhatsApp Promo',
    topic: 'Urban Kicks Premium Streetwear Sneakers',
    platform: 'facebook',
    content: `👟 SNEAKERHEAD ALERT: Step Up Your Style Without Breaking The Bank!

Tired of stiff, overpriced kicks that hurt your feet after 2 hours? 

Meet the UrbanGlide Pro 2026 Sneakers:
✨ CloudFoam cushioning for all-day comfort
✨ Breathable mesh design engineered for hot weather
✨ Ultra-durable grip sole ready for street or gym

Special Limited Offer: $49 / ₦45,000 (Was $85) + Pay on Delivery Available in select cities!

👉 Limited batch: Only 40 pairs left in stock.
📲 Tap 'Send Message' on WhatsApp now to claim your size before it sells out!`,
    structured: {
      hook: "👟 SNEAKERHEAD ALERT: Step Up Your Style Without Breaking The Bank!",
      callToAction: "📲 Tap 'Send Message' on WhatsApp now to claim your size before it sells out!",
      hashtags: ['#SneakerCulture', '#StreetwearFashion', '#MensFashion', '#PayOnDelivery', '#UrbanStyle'],
      wordCount: 110
    },
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || DEFAULT_USERS,
          items: parsed.items || DEFAULT_ITEMS,
          config: { ...DEFAULT_CONFIG, ...(parsed.config || {}) },
          guestUsage: parsed.guestUsage || {}
        };
      }
    } catch (err) {
      console.error('Failed to load database, falling back to defaults:', err);
    }
    const initial: DatabaseSchema = {
      users: DEFAULT_USERS,
      items: DEFAULT_ITEMS,
      config: DEFAULT_CONFIG,
      guestUsage: {}
    };
    this.save(initial);
    return initial;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db:', err);
    }
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<User, 'id' | 'createdAt' | 'generationsCount' | 'generationsToday' | 'lastGenerationDate' | 'status'> & { id?: string; status?: 'active' | 'suspended'; role?: 'admin' | 'creator'; plan?: 'free' | 'pro' | 'enterprise' }): User {
    const today = new Date().toISOString().split('T')[0];
    const newUser: User = {
      id: user.id || `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: user.name,
      email: user.email.toLowerCase().trim(),
      passwordHash: user.passwordHash,
      role: user.role || 'creator',
      plan: user.plan || 'free',
      status: user.status || 'active',
      createdAt: new Date().toISOString(),
      generationsCount: 0,
      generationsToday: 0,
      lastGenerationDate: today,
      bio: user.bio || '',
      niche: user.niche || 'General',
      country: user.country || 'Global'
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  public checkAndUpdateDailyUsage(userId: string): { allowed: boolean; remaining: number; limit: number } {
    const user = this.findUserById(userId);
    if (!user) return { allowed: false, remaining: 0, limit: 0 };

    const today = new Date().toISOString().split('T')[0];
    if (user.lastGenerationDate !== today) {
      user.generationsToday = 0;
      user.lastGenerationDate = today;
    }

    let limit = this.data.config.freeDailyLimit;
    if (user.plan === 'pro') limit = this.data.config.proDailyLimit;
    if (user.plan === 'enterprise' || user.role === 'admin') limit = this.data.config.enterpriseDailyLimit;

    if (user.generationsToday >= limit) {
      return { allowed: false, remaining: 0, limit };
    }

    user.generationsToday += 1;
    user.generationsCount += 1;
    this.save();

    return {
      allowed: true,
      remaining: Math.max(0, limit - user.generationsToday),
      limit
    };
  }

  public checkGuestUsage(ipOrSession: string): { allowed: boolean; remaining: number; limit: number } {
    const today = new Date().toISOString().split('T')[0];
    const record = this.data.guestUsage[ipOrSession];
    const limit = this.data.config.guestDailyLimit;

    if (!record || record.date !== today) {
      this.data.guestUsage[ipOrSession] = { count: 1, date: today };
      this.save();
      return { allowed: true, remaining: limit - 1, limit };
    }

    if (record.count >= limit) {
      return { allowed: false, remaining: 0, limit };
    }

    record.count += 1;
    this.save();
    return { allowed: true, remaining: limit - record.count, limit };
  }

  public getItems(userId?: string): GeneratedItem[] {
    if (!userId) return this.data.items;
    return this.data.items.filter(item => item.userId === userId);
  }

  public addItem(item: Omit<GeneratedItem, 'id' | 'createdAt'>): GeneratedItem {
    const newItem: GeneratedItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    this.data.items.unshift(newItem);
    this.save();
    return newItem;
  }

  public updateItem(id: string, updates: Partial<GeneratedItem>): GeneratedItem | undefined {
    const idx = this.data.items.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    this.data.items[idx] = { ...this.data.items[idx], ...updates };
    this.save();
    return this.data.items[idx];
  }

  public deleteItem(id: string, userId?: string): boolean {
    const initialLen = this.data.items.length;
    this.data.items = this.data.items.filter(i => {
      if (i.id !== id) return true;
      if (userId && i.userId !== userId) return true; // unauthorized to delete another's
      return false;
    });
    const removed = this.data.items.length < initialLen;
    if (removed) this.save();
    return removed;
  }

  public getConfig(): SystemConfig {
    return this.data.config;
  }

  public updateConfig(newConfig: Partial<SystemConfig>): SystemConfig {
    this.data.config = { ...this.data.config, ...newConfig };
    this.save();
    return this.data.config;
  }

  public getAnalytics() {
    const totalGenerations = this.data.items.length + this.data.users.reduce((acc, u) => acc + (u.generationsCount || 0), 0);
    const totalUsers = this.data.users.length;
    const planCounts = {
      free: this.data.users.filter(u => u.plan === 'free').length,
      pro: this.data.users.filter(u => u.plan === 'pro').length,
      enterprise: this.data.users.filter(u => u.plan === 'enterprise').length
    };

    const typeBreakdown: Record<string, number> = {};
    for (const item of this.data.items) {
      typeBreakdown[item.type] = (typeBreakdown[item.type] || 0) + 1;
    }

    return {
      totalUsers,
      totalGenerations,
      planCounts,
      typeBreakdown,
      recentUsers: this.data.users.slice(-10).reverse().map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        plan: u.plan,
        role: u.role,
        status: u.status,
        generationsCount: u.generationsCount,
        generationsToday: u.generationsToday,
        createdAt: u.createdAt
      })),
      recentGenerations: this.data.items.slice(0, 10).map(i => ({
        id: i.id,
        title: i.title,
        type: i.type,
        platform: i.platform,
        createdAt: i.createdAt,
        userId: i.userId
      }))
    };
  }
}

export const db = new Database();
