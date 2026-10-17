import React, { useState } from 'react';
import { X, User as UserIcon, Zap, Check, Globe, Tag, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ProfileModal: React.FC = () => {
  const { user, limits, profileModalOpen, closeProfileModal, refreshUser, openPricingModal } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [niche, setNiche] = useState(user?.niche || 'Content Creation');
  const [country, setCountry] = useState(user?.country || 'Global');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!profileModalOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await api.updateProfile({ name, bio, niche, country });
      await refreshUser();
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative my-8">
        <button
          onClick={closeProfileModal}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md shadow-indigo-600/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk']">
              {user.name}
            </h3>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {user.plan} Plan
              </span>
              <span className="text-[11px] text-slate-400">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Usage Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Daily Generation Quota</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {limits?.remainingToday ?? 0}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {limits?.dailyLimit ?? 5} remaining today
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {user.generationsCount} all-time AI generations
            </p>
          </div>

          <button
            onClick={() => {
              closeProfileModal();
              openPricingModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Manage Plan</span>
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Creator Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about what you build, film, or sell..."
              rows={2}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Content Niche
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
