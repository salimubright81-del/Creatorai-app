import React, { useState } from 'react';
import { MessageSquare, Hash, Sparkles, Wand2, Copy, Send, Smartphone } from 'lucide-react';
import { api } from '../../services/api';
import { GeneratedItem } from '../../types';
import { ResultCard } from '../ResultCard';
import { useAuth } from '../../context/AuthContext';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', desc: 'Aesthetic hooks & carousel captions' },
  { id: 'tiktok', label: 'TikTok', desc: 'Short, search-optimized captions' },
  { id: 'facebook', label: 'Facebook', desc: 'Conversational community posts' },
  { id: 'linkedin', label: 'LinkedIn', desc: 'Professional insights & industry thought leadership' },
  { id: 'twitter', label: 'X (Twitter)', desc: 'Punchy one-liners & viral threads' },
  { id: 'whatsapp', label: 'WhatsApp', desc: 'Direct broadcast & status updates' },
];

export const SocialCaptionGenerator: React.FC = () => {
  const { refreshUser } = useAuth();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('engaging and friendly');
  const [callToAction, setCallToAction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedItem | null>(null);

  const sampleIdeas = [
    "New product launch: Handcrafted luxury scented candles",
    "Monday motivation: Overcoming fear of starting before you feel ready",
    "3 unexpected mistakes you are making with your daily skincare",
    "Behind the scenes of our creative studio and fulfillment process",
    "Customer appreciation shoutout and milestone celebration",
  ];

  const handleGenerate = async (tweakPrompt?: string) => {
    if (!topic.trim()) {
      setError('Please enter a caption topic or post concept.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.generateContent({
        type: 'caption',
        topic: tweakPrompt ? `${topic} (${tweakPrompt})` : topic,
        platform,
        tone,
        callToAction: callToAction || 'Drop a comment or check link in bio',
      });

      setGeneratedResult(res.item);
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Caption generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Social Studio
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
          AI Social Captions & Viral Hashtags
        </h2>
        <p className="mt-2 text-rose-100 text-sm sm:text-base max-w-2xl">
          Create aesthetic, high-engagement captions with scroll-stopping first lines, formatting, and high-ranking hashtags tailored for each social network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              What is your post about? <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Announcing our limited drop of organic coffee beans with notes of hazelnut..."
              rows={3}
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 resize-none"
            />
            {/* Quick Inspiration Pills */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Try:</span>
              {sampleIdeas.slice(0, 2).map((si, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopic(si)}
                  className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline text-left truncate max-w-[200px]"
                >
                  "{si.slice(0, 25)}..."
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Social Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    platform === p.id
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <p className="text-xs font-bold">{p.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tone & Vibe
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="engaging and friendly">Warm & Friendly</option>
                <option value="aesthetic and minimalist">Aesthetic & Minimalist</option>
                <option value="bold, high-energy and exciting">Bold & High-Energy</option>
                <option value="thoughtful and professional">Professional & Insightful</option>
                <option value="humorous and witty">Humorous & Witty</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Call to Action
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g. Comment YES, tap bio link"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Captions & Tags...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate 3 Captions & Hashtags</span>
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Hash className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  Writing Viral Captions
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Formatting line-breaks, story arcs, and researching high-engagement hashtags...
                </p>
              </div>
              <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full animate-pulse w-3/4" />
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
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Engage Your Followers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Enter your topic, choose your platform, and CreatorAI will write 3 caption styles (story-driven, punchy, and educational) with clean line-breaks and 20 curated hashtags.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
