import React from 'react';
import { 
  Video, 
  MessageSquare, 
  Briefcase, 
  Image as ImageIcon, 
  Lightbulb, 
  Anchor, 
  Quote, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const QuickCards: React.FC = () => {
  const { setActiveTab } = useAuth();

  const cards = [
    {
      id: 'scripts',
      title: 'TikTok & Video Scripts',
      desc: 'Emotional, educational, funny, faceless, & anime scripts with 3-second hooks.',
      icon: Video,
      gradient: 'from-violet-500 to-indigo-600',
      badge: 'VIRAL',
      popular: true,
    },
    {
      id: 'social',
      title: 'Social Posts & Captions',
      desc: 'Engaging captions with line-breaks and 20 curated hashtags for Instagram & TikTok.',
      icon: MessageSquare,
      gradient: 'from-pink-500 to-rose-600',
      badge: 'POPULAR',
      popular: true,
    },
    {
      id: 'ads',
      title: 'Business Advertisements',
      desc: 'Persuasive Facebook & WhatsApp promo copy with AIDA and PAS frameworks.',
      icon: Briefcase,
      gradient: 'from-emerald-500 to-teal-600',
      badge: 'HIGH ROI',
      popular: true,
    },
    {
      id: 'posters',
      title: 'AI Posters & Graphics',
      desc: 'Design and download high-resolution marketing flyers, banners, and product graphics.',
      icon: ImageIcon,
      gradient: 'from-purple-500 to-fuchsia-600',
      badge: 'STUDIO',
      popular: false,
    },
    {
      id: 'ideas',
      title: 'Content Ideas Generator',
      desc: 'Daily viral content calendar for business, education, tech, relationships & fitness.',
      icon: Lightbulb,
      gradient: 'from-amber-500 to-orange-600',
      badge: 'DAILY',
      popular: false,
    },
    {
      id: 'hooks_quotes',
      title: 'Hooks, Quotes & Descriptions',
      desc: '10 viral video hooks, motivational carousel quotes, and selling product descriptions.',
      icon: Anchor,
      gradient: 'from-blue-500 to-cyan-600',
      badge: 'TOOLBOX',
      popular: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk']">
            AI Content Creation Tools
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a specialized tool below to craft targeted content with tailored parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${c.gradient} text-white flex items-center justify-center shadow-md shadow-indigo-500/10 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 tracking-wider">
                    {c.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Open Tool</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
