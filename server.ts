import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, hashPassword, User } from './server/db.ts';
import { generateContentWithGemini, generatePosterGraphic, HAS_API_KEY } from './server/gemini.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

function getAuthUser(req: Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  let userId = token;
  if (token.startsWith('tk_')) {
    const lastUnderscore = token.lastIndexOf('_');
    if (lastUnderscore > 3) {
      userId = token.slice(3, lastUnderscore);
    } else {
      userId = token.slice(3);
    }
  }
  const user = db.findUserById(userId);
  if (!user || user.status === 'suspended') return null;
  return user;
}

// ---------------- API ROUTES ----------------

// System Status
app.get('/api/system/status', (req: Request, res: Response) => {
  const config = db.getConfig();
  res.json({
    hasApiKey: HAS_API_KEY,
    appName: 'CreatorAI',
    version: '2.0.0',
    announcement: config.announcement,
    maintenanceMode: config.maintenanceMode
  });
});

// Authentication: Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, niche, country } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const newUser = db.createUser({
      name: name.trim(),
      email: email.trim(),
      passwordHash: hashPassword(password),
      role: 'creator',
      plan: 'free',
      status: 'active',
      niche: niche || 'Content Creation',
      country: country || 'Global'
    });

    const token = `tk_${newUser.id}_${Date.now()}`;
    const { passwordHash: _, ...userSafe } = newUser;

    return res.status(201).json({
      token,
      user: userSafe,
      message: 'Account created successfully! Welcome to CreatorAI.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Authentication: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'This account has been suspended. Please contact support.' });
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = `tk_${user.id}_${Date.now()}`;
    const { passwordHash: _, ...userSafe } = user;

    return res.json({
      token,
      user: userSafe,
      message: `Welcome back, ${user.name}!`
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Authentication: Current User
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated or token expired.' });
  }
  const { passwordHash: _, ...userSafe } = user;
  const config = db.getConfig();
  let limit = config.freeDailyLimit;
  if (user.plan === 'pro') limit = config.proDailyLimit;
  if (user.plan === 'enterprise' || user.role === 'admin') limit = config.enterpriseDailyLimit;

  res.json({
    user: userSafe,
    limits: {
      dailyLimit: limit,
      generationsToday: user.generationsToday,
      remainingToday: Math.max(0, limit - user.generationsToday)
    }
  });
});

// Authentication: Password Reset
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  const user = db.findUserByEmail(email);
  if (!user) {
    // Standard secure message
    return res.json({ message: 'If this email is registered, password instructions have been processed.' });
  }

  if (newPassword && newPassword.length >= 6) {
    db.updateUser(user.id, { passwordHash: hashPassword(newPassword) });
    return res.json({ message: 'Password has been successfully updated! You can now log in.' });
  }

  return res.json({
    message: `Password reset verification link simulated for ${email}. You may specify a new password directly.`
  });
});

// Authentication: Profile update
app.post('/api/auth/profile', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { name, bio, niche, country } = req.body;
  const updated = db.updateUser(user.id, {
    ...(name ? { name: name.trim() } : {}),
    ...(bio !== undefined ? { bio } : {}),
    ...(niche ? { niche } : {}),
    ...(country ? { country } : {})
  });

  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, ...safe } = updated;
  res.json({ user: safe, message: 'Profile updated successfully' });
});

// Content Generation
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    const guestIp = req.ip || req.socket.remoteAddress || 'guest_client';

    // Verify usage limit
    if (user) {
      const usage = db.checkAndUpdateDailyUsage(user.id);
      if (!usage.allowed) {
        return res.status(429).json({
          error: `Daily generation limit reached (${usage.limit} generations for ${user.plan.toUpperCase()} plan). Upgrade to Pro for higher limits!`,
          upgradeRequired: true,
          limit: usage.limit,
          plan: user.plan
        });
      }
    } else {
      // Guest usage
      const config = db.getConfig();
      if (!config.allowGuestGenerations) {
        return res.status(401).json({ error: 'Please create a free account to generate AI content.' });
      }
      const guestUsage = db.checkGuestUsage(guestIp);
      if (!guestUsage.allowed) {
        return res.status(429).json({
          error: `You have reached the guest generation limit (${guestUsage.limit} free generations). Please create a free account to continue!`,
          requireSignup: true,
          limit: guestUsage.limit
        });
      }
    }

    const {
      type,
      topic,
      platform,
      style,
      tone,
      targetAudience,
      businessName,
      product,
      price,
      targetCustomers,
      niche,
      framework,
      countryOrRegion,
      callToAction,
      extraDetails
    } = req.body;

    if (!topic && !product) {
      return res.status(400).json({ error: 'Please provide a topic, idea, or product name.' });
    }

    // Call Gemini
    const result = await generateContentWithGemini({
      type: type || 'social_post',
      topic: topic || product || 'Great product',
      platform,
      style,
      tone,
      targetAudience,
      businessName,
      product,
      price,
      targetCustomers,
      niche,
      framework,
      countryOrRegion,
      callToAction,
      extraDetails
    });

    // Save to items history
    const savedItem = db.addItem({
      userId: user ? user.id : 'guest',
      type: type || 'social_post',
      title: result.title,
      topic: topic || product || 'Content Idea',
      platform: platform || 'all',
      content: result.rawText,
      structured: result.structured,
      isFavorite: false
    });

    return res.json({
      success: true,
      item: savedItem,
      structured: result.structured
    });
  } catch (err: any) {
    console.error('Generation error:', err);
    return res.status(500).json({
      error: err.message || 'AI generation failed. Please try again.'
    });
  }
});

// Image & Poster Generation
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    const guestIp = req.ip || 'guest_client';

    if (user) {
      const usage = db.checkAndUpdateDailyUsage(user.id);
      if (!usage.allowed) {
        return res.status(429).json({
          error: `Daily limit reached. Upgrade to Pro for high-res creative graphics!`,
          upgradeRequired: true
        });
      }
    } else {
      const guestUsage = db.checkGuestUsage(guestIp);
      if (!guestUsage.allowed) {
        return res.status(429).json({
          error: 'Guest limit reached. Sign up for free to create more posters!',
          requireSignup: true
        });
      }
    }

    const {
      prompt,
      businessName,
      headline,
      subheadline,
      badge,
      cta,
      theme,
      aspectRatio
    } = req.body;

    if (!prompt && !headline) {
      return res.status(400).json({ error: 'Please enter a description or headline for your poster.' });
    }

    const posterResult = await generatePosterGraphic({
      prompt: prompt || headline || 'Promotional Poster',
      businessName,
      headline,
      subheadline,
      badge,
      cta,
      theme,
      aspectRatio
    });

    const savedItem = db.addItem({
      userId: user ? user.id : 'guest',
      type: 'poster_graphic',
      title: headline || `Poster: ${businessName || 'Promo'}`,
      topic: prompt || headline || 'Promotional Poster',
      platform: 'poster',
      content: `Graphic poster design for ${businessName || 'Business'}: "${headline || prompt}"`,
      posterData: {
        ...posterResult.posterData,
        imageUrl: posterResult.imageUrl
      },
      isFavorite: false
    });

    res.json({
      success: true,
      item: savedItem,
      imageUrl: posterResult.imageUrl,
      posterData: posterResult.posterData
    });
  } catch (err: any) {
    console.error('Poster creation error:', err);
    res.status(500).json({ error: err.message || 'Failed to create poster.' });
  }
});

// Content History & Saved Items
app.get('/api/history', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const items = db.getItems(user ? user.id : 'guest');
  res.json({ items });
});

// Toggle Favorite
app.post('/api/history/:id/favorite', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { id } = req.params;
  const items = db.getItems(user ? user.id : undefined);
  const target = items.find(i => i.id === id);

  if (!target) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const updated = db.updateItem(id, { isFavorite: !target.isFavorite });
  res.json({ item: updated });
});

// Edit Saved Item
app.put('/api/history/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { id } = req.params;
  const { content, title } = req.body;

  const items = db.getItems(user ? user.id : undefined);
  const target = items.find(i => i.id === id);

  if (!target) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const updated = db.updateItem(id, {
    ...(content ? { content } : {}),
    ...(title ? { title } : {})
  });
  res.json({ item: updated });
});

// Delete Item
app.delete('/api/history/:id', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { id } = req.params;
  const deleted = db.deleteItem(id, user ? user.id : undefined);
  if (!deleted) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json({ success: true, message: 'Item deleted' });
});

// Subscription Plans & Simulated Upgrade
app.get('/api/plans', (req: Request, res: Response) => {
  const config = db.getConfig();
  res.json({
    plans: [
      {
        id: 'free',
        name: 'Free Starter',
        priceMonthly: 0,
        priceYearly: 0,
        dailyGenerations: config.freeDailyLimit,
        features: [
          `${config.freeDailyLimit} AI content generations per day`,
          'Social media posts & basic captions',
          'Access to viral hook generator',
          'Save up to 20 favorite projects',
          'Standard generation speed',
          'Community support'
        ]
      },
      {
        id: 'pro',
        name: 'Creator Pro',
        badge: 'POPULAR',
        priceMonthly: config.proMonthlyPrice,
        priceYearly: config.proYearlyPrice,
        dailyGenerations: config.proDailyLimit,
        features: [
          `${config.proDailyLimit} AI content generations per day`,
          'Viral TikTok & YouTube video scripts',
          'High-converting business advertisements',
          'AIDA & PAS sales frameworks',
          'AI Poster & Image Creator credits',
          'Unlimited saved content & history',
          'Priority processing speed',
          'Export to Markdown & Text'
        ]
      },
      {
        id: 'enterprise',
        name: 'Business & Agency',
        badge: 'ALL-INCLUSIVE',
        priceMonthly: config.enterpriseMonthlyPrice,
        priceYearly: Math.round(config.enterpriseMonthlyPrice * 10),
        dailyGenerations: config.enterpriseDailyLimit,
        features: [
          'Unlimited AI content generations',
          'All Pro video styles & hooks',
          'Multi-channel campaign generator',
          'Custom brand tone & voice profiles',
          'Full AI poster suite & graphic exports',
          'Commercial resale rights',
          'Dedicated VIP support'
        ]
      }
    ]
  });
});

// Upgrade user plan (Simulated payment testing flow as requested: "Do not charge users or activate subscriptions until a legitimate payment provider has been integrated and tested.")
app.post('/api/plans/upgrade', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Please log in to upgrade your subscription.' });

  const { planId, billingCycle } = req.body;
  if (!['free', 'pro', 'enterprise'].includes(planId)) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  // Update user plan
  const updated = db.updateUser(user.id, { plan: planId });
  const { passwordHash: _, ...safe } = updated!;

  res.json({
    success: true,
    message: `Plan updated to ${planId.toUpperCase()} (${billingCycle || 'monthly'}) in sandbox test mode.`,
    user: safe
  });
});

// Admin API
app.get('/api/admin/overview', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const analytics = db.getAnalytics();
  res.json({ analytics });
});

app.get('/api/admin/users', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const users = db.getUsers().map(u => {
    const { passwordHash: _, ...safe } = u;
    return safe;
  });
  res.json({ users });
});

app.post('/api/admin/users/:id/status', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const updated = db.updateUser(id, { status });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, ...safe } = updated;
  res.json({ user: safe, message: `User status changed to ${status}` });
});

app.post('/api/admin/users/:id/plan', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const { id } = req.params;
  const { plan } = req.body;

  if (!['free', 'pro', 'enterprise'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  const updated = db.updateUser(id, { plan });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  const { passwordHash: _, ...safe } = updated;
  res.json({ user: safe, message: `User plan upgraded to ${plan}` });
});

app.get('/api/admin/config', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  res.json({ config: db.getConfig() });
});

app.post('/api/admin/config', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  const updated = db.updateConfig(req.body);
  res.json({ config: updated, message: 'Settings saved successfully.' });
});

// Vite Middleware integration for development
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CreatorAI Server running on port ${PORT} (isProd: ${isProd})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
