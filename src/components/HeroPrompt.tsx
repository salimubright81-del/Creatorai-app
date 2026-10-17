import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, Zap, Play, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { GeneratedItem } from '../types';
import { ResultCard } from './ResultCard';

interface HeroPromptProps {
  onGenerated?: (item: GeneratedItem) => void;
}

export const HeroPrompt: React.FC<HeroPromptProps> = ({ onGenerated }) => {
  const { setActiveTab, refreshUser } = useAuth();
  const [promptText, setPromptText] = useState('');
  const [selectedType, setSelectedType] = useState('social_post');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fastResult, setFastResult] = useState<GeneratedItem | null>(null);

  const quickChips = [
    { label: 'Viral TikTok Script', type: 'tiktok_script', topic: 'How to make your first $1,000 online with high-income skills' },
    { label: 'Instagram Caption', type: 'caption', topic: 'Launching our luxury organic skincare line this Friday' },
    { label: 'Facebook Sneaker Ad', type: 'business_ad', topic: 'UrbanGlide Breathable Streetwear Sneakers $49 with Pay on Delivery' },
    { label: 'Daily Content Ideas', type: 'content_ideas', topic: '7-day viral video calendar for personal finance & small business' },
    { label: 'Attention-Grabbing Hook', type: 'video_hook', topic: 'Why 99% of people quit their online business in the first 30 days' },
  ];

  const handleChipClick = (chip: typeof quickChips[0]) => {
    setSelectedType(chip.type);
    setPromptText(chip.topic);
  };

  const handleFastGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) {
      setError('Please tell us what content you want to create.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.generateContent({
        type: selectedType,
        topic: promptText,
        platform: selectedType === 'tiktok_script' ? 'tiktok' : 'all',
      });

      setFastResult(res.item);
      if (onGenerated) onGenerated(res.item);
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-6 sm:p-10 text-white shadow-2xl border border-indigo-500/20">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md border border-white/10">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>AI Content Studio for Global Creators & Small Businesses</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-['Space_Grotesk'] leading-tight">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">CreatorAI</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Create high-converting TikTok scripts, Instagram captions, Facebook ads, and creative posters in seconds. Engineered for entrepreneurs and creators worldwide.
          </p>

          {/* Omni prompt input */}
          <form onSubmit={handleFastGenerate} className="pt-2">
            <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">
              What content do you want to create?
            </label>
            <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-inner">
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g. Write a viral TikTok script on how to sell digital products with $0 budget..."
                className="flex-1 px-4 py-3 text-sm text-white placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Writing Copy...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Content</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick inspiration chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium">Quick Ideas:</span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors"
              >
                + {chip.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Generated Instant Result if available */}
      {fastResult && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Latest AI Creation
            </span>
            <button
              onClick={() => setFastResult(null)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Close Output
            </button>
          </div>
          <ResultCard
            item={fastResult}
            onRegenerate={(tweak) => {
              setPromptText(prev => tweak ? `${prev} (${tweak})` : prev);
              handleFastGenerate();
            }}
            onUpdated={(updated) => setFastResult(updated)}
          />
        </div>
      )}
    </div>
  );
};
