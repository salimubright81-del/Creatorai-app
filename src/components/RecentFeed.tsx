import React, { useEffect, useState } from 'react';
import { History, Copy, Check, Heart, ExternalLink, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { GeneratedItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const RecentFeed: React.FC = () => {
  const { setActiveTab } = useAuth();
  const [recentItems, setRecentItems] = useState<GeneratedItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchRecent = async () => {
    try {
      const res = await api.getHistory();
      setRecentItems((res.items || []).slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (recentItems.length === 0) return null;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk']">
            Recently Generated Content
          </h2>
        </div>
        <button
          onClick={() => setActiveTab('saved')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>View All in Library</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recentItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {item.type.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {item.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                {item.content.split(/\s+/).length} words
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(item.id, item.content)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('saved')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Open in Library"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
