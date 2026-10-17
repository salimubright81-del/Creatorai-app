import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Heart, 
  Download, 
  Share2, 
  RotateCw, 
  Edit3, 
  Clock, 
  Hash, 
  FileText, 
  Sparkles,
  Save,
  X
} from 'lucide-react';
import { GeneratedItem } from '../types';
import { api } from '../services/api';

interface ResultCardProps {
  item: GeneratedItem;
  onRegenerate?: (tweak?: string) => void;
  onDeleted?: (id: string) => void;
  onUpdated?: (item: GeneratedItem) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  item, 
  onRegenerate, 
  onDeleted,
  onUpdated 
}) => {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [editTitle, setEditTitle] = useState(item.title);
  const [isSaving, setIsSaving] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const wordCount = editContent.trim().split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.ceil(wordCount / 2.5);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = editContent;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const res = await api.toggleFavorite(item.id);
      setIsFavorite(res.item.isFavorite);
      if (onUpdated) onUpdated(res.item);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const res = await api.updateItem(item.id, {
        content: editContent,
        title: editTitle
      });
      setIsEditing(false);
      if (onUpdated) onUpdated(res.item);
    } catch (err) {
      console.error('Failed to save edit:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const filename = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30) || 'creatorai_content'}.txt`;
    const blob = new Blob([editContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: editContent,
        });
        setShareFeedback('Shared successfully!');
        setTimeout(() => setShareFeedback(null), 2500);
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      // Fallback copy
      handleCopy();
      setShareFeedback('Content copied to clipboard for sharing!');
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              {item.type.replace(/_/g, ' ')}
            </span>
            {item.platform && item.platform !== 'all' && (
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {item.platform}
              </span>
            )}
            <span className="text-xs text-slate-400">
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-base font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 w-full"
            />
          ) : (
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
              {editTitle}
            </h3>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={handleToggleFavorite}
            aria-label="Toggle favorite"
            className={`p-2 rounded-xl transition-colors ${
              isFavorite
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isEditing ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' : ''
            }`}
            title="Edit content"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCopy}
            className={`p-2 rounded-xl transition-all ${
              copied
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 font-medium'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Share content"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Download as text file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Structured metrics bar */}
      <div className="px-5 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            {wordCount} words
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            ~{estimatedSeconds}s reading time
          </span>
        </div>
        {shareFeedback && (
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs animate-fade-in">
            {shareFeedback}
          </span>
        )}
      </div>

      {/* Main content body */}
      <div className="p-5 flex-1 overflow-auto">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={12}
              className="w-full p-4 rounded-xl text-sm leading-relaxed border border-indigo-300 dark:border-indigo-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap select-text font-normal">
            {editContent}
          </div>
        )}

        {/* Structured Tags if available */}
        {item.structured?.hashtags && item.structured.hashtags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <Hash className="w-3.5 h-3.5 text-indigo-500" />
              <span>Recommended Viral Hashtags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.structured.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition-colors cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(tag);
                  }}
                  title="Click to copy tag"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer controls & Regenerate shortcuts */}
      <div className="p-3 sm:px-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Refine:</span>
          {onRegenerate && (
            <>
              <button
                onClick={() => onRegenerate('Make it punchier and shorter')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
              >
                ⚡ Punchier
              </button>
              <button
                onClick={() => onRegenerate('Add stronger urgency and sales call to action')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
              >
                🔥 High Conversion
              </button>
              <button
                onClick={() => onRegenerate('Make it more emotional and relatable')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors hidden sm:inline-block"
              >
                ❤️ Emotional
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={() => onRegenerate()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
