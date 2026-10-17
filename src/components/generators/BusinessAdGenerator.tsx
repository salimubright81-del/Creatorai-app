import React, { useState } from 'react';
import { Briefcase, ShoppingBag, DollarSign, Target, MessageCircle, Sparkles, Wand2, Tag } from 'lucide-react';
import { api } from '../../services/api';
import { GeneratedItem } from '../../types';
import { ResultCard } from '../ResultCard';
import { useAuth } from '../../context/AuthContext';

export const BusinessAdGenerator: React.FC = () => {
  const { refreshUser } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');
  const [targetCustomers, setTargetCustomers] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [framework, setFramework] = useState('AIDA');
  const [regionContext, setRegionContext] = useState('global');
  const [extraOffer, setExtraOffer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedItem | null>(null);

  const samplePresets = [
    {
      name: "Sneaker Drop",
      biz: "SoleStreet Kicks",
      prod: "Breathable Street Running Sneakers",
      price: "$49 / ₦45,000 (Free Delivery)",
      audience: "Fashion-conscious young adults, athletes, college students",
      offer: "Pay on Delivery available + Free pair of performance socks",
      region: "Africa (Nigeria, Kenya, Ghana, SA)"
    },
    {
      name: "Organic Glow Skincare",
      biz: "Zola Naturals",
      prod: "Hydrating Vitamin C Serum & Brightening Cream",
      price: "$29 / ₦25,000",
      audience: "Women aged 20-45 dealing with hyperpigmentation & dry skin",
      offer: "Buy 1 Get 1 at 30% off this weekend only",
      region: "global"
    },
    {
      name: "Web Design Agency",
      biz: "Apex Digital Solutions",
      prod: "High-Converting Shopify & WordPress Websites in 5 Days",
      price: "Starting at $250 / ₦200,000",
      audience: "Small business owners, boutique owners, restaurant founders",
      offer: "Includes free logo & WhatsApp checkout setup",
      region: "global"
    }
  ];

  const applyPreset = (preset: typeof samplePresets[0]) => {
    setBusinessName(preset.biz);
    setProduct(preset.prod);
    setPrice(preset.price);
    setTargetCustomers(preset.audience);
    setExtraOffer(preset.offer);
    setRegionContext(preset.region);
  };

  const handleGenerate = async (tweakPrompt?: string) => {
    if (!product.trim()) {
      setError('Please specify the product or service you want to advertise.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.generateContent({
        type: 'business_ad',
        topic: `${businessName ? businessName + ' - ' : ''}${product}`,
        businessName: businessName || 'My Business',
        product,
        price,
        targetCustomers,
        platform,
        framework,
        countryOrRegion: regionContext,
        extraDetails: tweakPrompt ? `${extraOffer} (Note: ${tweakPrompt})` : extraOffer
      });

      setGeneratedResult(res.item);
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Ad generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Commerce & Sales
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
          AI Business Advertisement Generator
        </h2>
        <p className="mt-2 text-teal-100 text-sm sm:text-base max-w-2xl">
          Turn your products and services into persuasive, high-converting social media ads, WhatsApp sales messages, and promotional campaigns.
        </p>

        {/* Quick presets */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-teal-100">Quick Business Presets:</span>
          {samplePresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="text-xs px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs transition-all border border-white/20"
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Business or Brand Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Lagos Trendz, Urban Kicks, Apex Agency"
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Product or Service Name <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g. Premium orthotic running sneakers with breathable mesh and shock-absorbing sole..."
              rows={2}
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Price or Discount
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. $45, ₦40,000, 30% Off"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="facebook">Facebook Ads & Feed</option>
                <option value="instagram">Instagram Ads & Bio</option>
                <option value="whatsapp">WhatsApp Business Broadcast</option>
                <option value="tiktok">TikTok Commercial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Customers
            </label>
            <input
              type="text"
              value={targetCustomers}
              onChange={(e) => setTargetCustomers(e.target.value)}
              placeholder="e.g. Busy mothers, fitness lovers, college students"
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Marketing Framework
              </label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="AIDA">AIDA (Attention, Interest, Desire, Action)</option>
                <option value="PAS">PAS (Problem, Agitate, Solve)</option>
                <option value="Direct">Direct Punchy Sales Offer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Market Location
              </label>
              <select
                value={regionContext}
                onChange={(e) => setRegionContext(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="global">Global / International</option>
                <option value="Africa (Nigeria, Kenya, Ghana, SA)">Africa (Pay on Delivery & WhatsApp)</option>
                <option value="US & UK">US, UK & Europe</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Special Bonus / Guarantee (Optional)
            </label>
            <input
              type="text"
              value={extraOffer}
              onChange={(e) => setExtraOffer(e.target.value)}
              placeholder="e.g. Free shipping, 30-day money back guarantee, free gift"
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Writing Sales Ads...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate High-Converting Ad</span>
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShoppingBag className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  Writing Your Ad Campaign
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Applying {framework} sales psychology, customer pain points, and closing triggers...
                </p>
              </div>
              <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          ) : generatedResult ? (
            <ResultCard
              item={generatedResult}
              onRegenerate={(tweak) => handleGenerate(tweak)}
              onUpdated={(updated) => setGeneratedResult(updated)}
            />
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3 min-h-[400px]">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Ready to Sell Your Products
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Fill in your product and pricing details on the left, or click one of the quick business presets to generate persuasive Facebook ads, WhatsApp sales messages, and customer closing scripts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
