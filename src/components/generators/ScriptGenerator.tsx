import React, { useState } from 'react';
import { Video, Sparkles, Wand2, PlayCircle, Layers, Clapperboard } from 'lucide-react';
import { api } from '../../services/api';
import { GeneratedItem } from '../../types';
import { ResultCard } from '../ResultCard';
import { useAuth } from '../../context/AuthContext';

const SCRIPT_STYLES = [
  { id: 'emotional', label: 'Emotional Storytelling', desc: 'Vulnerable, high-empathy narrative with a life lesson' },
  { id: 'educational', label: 'Educational & How-To', desc: 'Step-by-step valuable breakdown that viewers save' },
  { id: 'motivational', label: 'Motivational & Inspirational', desc: 'High-energy, mindset-shifting inspirational speech' },
  { id: 'funny', label: 'Funny & Relatable Skit', desc: 'Humorous, comedic relatable scenario or POV' },
  { id: 'business_ad', label: 'Business Advertisement', desc: 'Direct problem-agitate-solve commercial script' },
  { id: 'faceless', label: 'Faceless Video (Voiceover & B-roll)', desc: 'Optimized for stock video, AI voiceover & text slides' },
  { id: 'anime', label: 'Anime Storytelling & Lore', desc: 'Dramatic anime-style narrative pacing and cliffhangers' },
];

const PLATFORMS = [
  { id: 'tiktok', label: 'TikTok' },
  { id: 'reels', label: 'Instagram Reels' },
  { id: 'shorts', label: 'YouTube Shorts' },
  { id: 'youtube', label: 'Long-form YouTube' },
];

export const ScriptGenerator: React.FC = () => {
  const { refreshUser } = useAuth();
  const [topic, setTopic] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('emotional');
  const [platform, setPlatform] = useState('tiktok');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('authentic and engaging');
  const [regionContext, setRegionContext] = useState('global');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedItem | null>(null);

  const sampleTopics = [
    "How I built a digital business from my phone with $0",
    "3 psychological hacks to stop procrastinating today",
    "Why 90% of small brands fail on social media in 2026",
    "Behind the scenes: Packaging a customer's custom order",
    "The harsh truth about university degrees vs high-income skills",
  ];

  const handleGenerate = async (tweakPrompt?: string) => {
    if (!topic.trim()) {
      setError('Please enter a video topic or concept.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.generateContent({
        type: platform === 'youtube' ? 'youtube_script' : 'tiktok_script',
        topic: tweakPrompt ? `${topic} (${tweakPrompt})` : topic,
        platform,
        style: selectedStyle,
        tone,
        targetAudience: targetAudience || 'General social media viewers',
        countryOrRegion: regionContext
      });

      setGeneratedResult(res.item);
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Script generation failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Video Studio
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
          AI Video Script Generator
        </h2>
        <p className="mt-2 text-indigo-100 text-sm sm:text-base max-w-2xl">
          Create viral, high-retention video scripts for TikTok, Reels, and YouTube with scroll-stopping 3-second hooks, visual cues, and high-conversion CTAs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Configuration Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Topic input */}
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              What is your video about?
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 mistakes new eCommerce store owners make when running Facebook ads..."
              rows={3}
              className="w-full p-3.5 rounded-2xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />
            {/* Quick Inspiration Pills */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Try:</span>
              {sampleTopics.slice(0, 2).map((st, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopic(st)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline text-left truncate max-w-[200px]"
                >
                  "{st.slice(0, 26)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
              Select Video Style
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {SCRIPT_STYLES.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStyle(st.id)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedStyle === st.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">{st.label}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform selector */}
          <div>
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Target Platform
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    platform === p.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audience & Region Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Gen Z, small business owners"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Audience Region
              </label>
              <select
                value={regionContext}
                onChange={(e) => setRegionContext(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="global">Worldwide / Global</option>
                <option value="Africa (Nigeria, Kenya, Ghana, SA)">Africa & Diaspora</option>
                <option value="US & North America">US & North America</option>
                <option value="UK & Europe">UK & Europe</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Writing Viral Script...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Video Script</span>
              </>
            )}
          </button>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Clapperboard className="w-8 h-8 animate-bounce" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  Crafting Your {selectedStyle.toUpperCase()} Script
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Writing high-CTR hooks, retention reset triggers, and scene-by-scene visual camera directions...
                </p>
              </div>
              <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full animate-pulse w-3/4" />
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
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Ready to Record Viral Content
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Select your video style on the left, type what you want to talk about, and CreatorAI will format a complete script with 3 viral hooks, b-roll directions, and call-to-actions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
