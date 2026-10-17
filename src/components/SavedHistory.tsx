import React, { useEffect, useState } from 'react';
import { Bookmark, Heart, Search, Filter, Trash2, Download, Copy, Sparkles, FolderArchive } from 'lucide-react';
import { api } from '../services/api';
import { GeneratedItem } from '../types';
import { ResultCard } from './ResultCard';

export const SavedHistory: React.FC = () => {
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory();
      setItems(res.items || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleted = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdated = (updated: GeneratedItem) => {
    setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
  };

  const filteredItems = items.filter(item => {
    if (onlyFavorites && !item.isFavorite) return false;
    if (typeFilter !== 'all' && !item.type.includes(typeFilter)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchTopic = item.topic?.toLowerCase().includes(q);
      const matchContent = item.content?.toLowerCase().includes(q);
      return matchTitle || matchTopic || matchContent;
    }
    return true;
  });

  const exportAll = () => {
    const dataStr = JSON.stringify(filteredItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creatorai_exports_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk']">
              Saved Projects & History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {items.length} total generated items ({items.filter(i => i.isFavorite).length} favorites)
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={exportAll}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export All ({filteredItems.length})</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved scripts, ads, captions, or hooks..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Content Types</option>
            <option value="script">Video Scripts</option>
            <option value="caption">Captions</option>
            <option value="business_ad">Business Ads</option>
            <option value="hook">Hooks & Quotes</option>
            <option value="ideas">Content Ideas</option>
            <option value="poster">Posters</option>
          </select>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              onlyFavorites
                ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current text-rose-500' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* List Feed */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading your saved content...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
          <FolderArchive className="w-10 h-10 text-slate-400" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No Content Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {searchQuery || onlyFavorites || typeFilter !== 'all'
              ? 'No projects match your current filters. Try resetting the search or category.'
              : 'You haven’t generated any content yet! Use the Creator Hub to generate your first TikTok script, ad, or post.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredItems.map(item => (
            <ResultCard
              key={item.id}
              item={item}
              onDeleted={handleDeleted}
              onUpdated={handleUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
};
