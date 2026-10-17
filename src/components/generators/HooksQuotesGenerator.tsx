import React, { useState } from 'react';
import { Anchor, Quote, ShoppingBag, BookOpen, Wand2, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { GeneratedItem } from '../../types';
import { ResultCard } from '../ResultCard';
import { useAuth } from '../../context/AuthContext';

type SubTool = 'hooks' | 'quotes' | 'storytelling' | 'product_description';

export const HooksQuotesGenerator: React.FC = () => {
  const { refreshUser } = useAuth();
  const [activeSubTool, setActiveSubTool] = useState<SubTool>('hooks');
  const [topic, setTopic] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [tone, setTone] = useState('punchy and conversational');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedItem | null>(null);

  const subTools = [
    { id: 'hooks', label: 'Viral 3s Video Hooks', icon: Anchor, desc: '10 curiosity & contrarian hooks to stop the scroll' },
    { id: 'quotes', label: 'Motivational Quotes', icon: Quote, desc: 'Inspiring quotes & reflections for carousels & reels' },
    { id: 'storytelling', label: 'Storytelling Content', icon: BookOpen, desc: 'Emotionally compelling stories with transformative lessons' },
    { id: 'product_description', label: 'Product Descriptions', icon: ShoppingBag, desc: 'Benefit-driven eCommerce descriptions that convert' },
  ];

  const handleGenerate = async (tweakPrompt?: string) => {
    if (!topic.trim()) {
      setError('Please provide a topic, product, or theme.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      let type = 'video_hook';
      if (activeSubTool === 'quotes') type = 'motivational_quote';
      if (activeSubTool === 'storytelling') type = 'storytelling';
      if (activeSubTool === 'product_description') type = 'product_description';

      const res = await api.generateContent({
        type,
        topic: tweakPrompt ? `${topic} (${tweakPrompt})` : topic,
        tone,
        extraDetails: extraInfo,
      });

      setGeneratedResult(res.item);
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Subtool selector tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {subTools.map((st) => {
          const Icon = st.icon;
          const isActive = activeSubTool === st.id;
          return (
            <button
              key={st.id}
              onClick={() => {
                setActiveSubTool(st.id as SubTool);
                setGeneratedResult(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <p className="text-xs font-bold">{st.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{st.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {activeSubTool === 'hooks' && 'Topic / Video Angle'}
              {activeSubTool === 'quotes' && 'Theme or Life Struggle'}
              {activeSubTool === 'storytelling' && 'Personal Experience or Story Concept'}
              {activeSubTool === 'product_description' && 'Product Name & Highlights'}
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                activeSubTool === 'hooks'
                  ? 'e.g. Why most people stay broke in their 20s...'
                  : activeSubTool === 'quotes'
                  ? 'e.g. Resilience, starting from zero, quiet discipline...'
                  : activeSubTool === 'storytelling'
                  ? 'e.g. How I got fired from my 9-5 job and made my first $1,000 online...'
                  : 'e.g. Minimalist Matte Black Stainless Steel Coffee Tumbler...'
              }
              rows={3}
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {activeSubTool === 'product_description' ? 'Price & Key Features' : 'Additional Nuance (Optional)'}
            </label>
            <input
              type="text"
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              placeholder="e.g. $35, double wall insulation, leakproof lid"
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tone of Voice
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="punchy, bold and high-retention">Punchy & High-Retention</option>
              <option value="deeply inspiring and philosophical">Deeply Inspiring & Philosophical</option>
              <option value="conversational and authentic">Conversational & Authentic</option>
              <option value="persuasive, premium luxury">Persuasive & Premium Luxury</option>
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Content...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>
                  Generate{' '}
                  {activeSubTool === 'hooks'
                    ? '10 Viral Hooks'
                    : activeSubTool === 'quotes'
                    ? 'Quotes & Reflections'
                    : activeSubTool === 'storytelling'
                    ? 'Storytelling Post'
                    : 'Product Description'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  CreatorAI is Drafting Your Content
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Synthesizing psychological hooks and high-retention phrasing...
                </p>
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
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Choose a Specialized Tool Above
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Quickly generate 10 viral hooks, motivational carousel quotes, heartfelt personal stories, or high-converting product descriptions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
