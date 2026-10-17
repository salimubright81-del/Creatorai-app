import React, { useState } from 'react';
import { Lightbulb, Calendar, Compass, Flame, Wand2, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { GeneratedItem } from '../../types';
import { ResultCard } from '../ResultCard';
import { useAuth } from '../../context/AuthContext';

const NICHES = [
  { id: 'business', label: 'Business & Entrepreneurship', icon: '💼', desc: 'Marketing, sales, client acquisition, startup hustle' },
  { id: 'education', label: 'Education & Career Skills', icon: '📚', desc: 'Tutorials, study hacks, career advice, high-income skills' },
  { id: 'relationships', label: 'Relationships & Social Dynamics', icon: '❤️', desc: 'Dating, communication, boundary setting, self-worth' },
  { id: 'entertainment', label: 'Entertainment & Comedy', icon: '🎭', desc: 'Relatable skits, viral trends, commentary, funny POVs' },
  { id: 'technology', label: 'Technology & AI Tools', icon: '⚡', desc: 'Software hacks, new AI tools, futuristic trends, workflow automation' },
  { id: 'personal_development', label: 'Personal Development & Fitness', icon: '🌱', desc: 'Mindset shifts, daily habits, fitness routines, mental health' },
];

export const ContentIdeasGenerator: React.FC = () => {
  const { refreshUser } = useAuth();
  const [selectedNiche, setSelectedNiche] = useState('business');
  const [customFocus, setCustomFocus] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedItem | null>(null);

  const handleGenerate = async (tweakPrompt?: string) => {
    setError(null);
    setIsLoading(true);

    const nicheObj = NICHES.find(n => n.id === selectedNiche);
    const nicheName = nicheObj ? nicheObj.label : selectedNiche;

    try {
      const res = await api.generateContent({
        type: 'content_ideas',
        topic: customFocus ? `${nicheName}: ${customFocus}` : `${nicheName} Daily Content Strategy`,
        niche: nicheName,
        targetAudience: targetAudience || 'Active social media creators & audience',
        extraDetails: tweakPrompt || ''
      });

      setGeneratedResult(res.item);
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Idea generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Inspiration Engine
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">
          Daily Content Ideas Generator
        </h2>
        <p className="mt-2 text-amber-100 text-sm sm:text-base max-w-2xl">
          Never run out of content to post. Generate a full calendar of high-engagement video ideas, carousels, and viral talking points based on your specific niche.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Your Niche
            </label>
            <div className="space-y-2">
              {NICHES.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNiche(n.id)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                    selectedNiche === n.id
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xl">{n.icon}</span>
                  <div>
                    <p className="text-xs font-bold">{n.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Specific Angle or Sub-Topic (Optional)
            </label>
            <input
              type="text"
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              placeholder="e.g. Remote work, budget fashion, high-protein African meals"
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Beginners, corporate workers, young creators"
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
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Brainstorming Viral Concepts...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate 10 Content Ideas</span>
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500">
                <Lightbulb className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  Curating 10 Viral Content Angles
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Analyzing trend velocity, viewer pain points, and high-share formats...
                </p>
              </div>
              <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full animate-pulse w-3/4" />
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
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                Get Fresh Ideas Daily
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Choose your niche from the left column to receive 10 custom video, carousel, and post concepts complete with hooks and formats ready to film today.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
