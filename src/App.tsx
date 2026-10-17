import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { HeroPrompt } from './components/HeroPrompt';
import { QuickCards } from './components/QuickCards';
import { RecentFeed } from './components/RecentFeed';
import { ScriptGenerator } from './components/generators/ScriptGenerator';
import { BusinessAdGenerator } from './components/generators/BusinessAdGenerator';
import { SocialCaptionGenerator } from './components/generators/SocialCaptionGenerator';
import { ContentIdeasGenerator } from './components/generators/ContentIdeasGenerator';
import { PosterStudio } from './components/generators/PosterStudio';
import { HooksQuotesGenerator } from './components/generators/HooksQuotesGenerator';
import { SavedHistory } from './components/SavedHistory';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { PricingModal } from './components/PricingModal';
import { ProfileModal } from './components/ProfileModal';
import { api } from './services/api';
import { Sparkles, Megaphone, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

function MainApp() {
  const { activeTab, setActiveTab, user } = useAuth();
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    api.getSystemStatus().then(status => {
      if (status.announcement) {
        setAnnouncement(status.announcement);
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Optional Broadcast Announcement */}
      {announcement && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-xs">
          <Megaphone className="w-3.5 h-3.5 animate-bounce" />
          <span>{announcement}</span>
        </div>
      )}

      {/* Main Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'hub' && (
          <div className="space-y-10">
            <HeroPrompt />
            <QuickCards />
            <RecentFeed />
          </div>
        )}

        {activeTab === 'scripts' && <ScriptGenerator />}
        {activeTab === 'ads' && <BusinessAdGenerator />}
        {activeTab === 'social' && <SocialCaptionGenerator />}
        {activeTab === 'ideas' && <ContentIdeasGenerator />}
        {activeTab === 'posters' && <PosterStudio />}
        {activeTab === 'hooks_quotes' && <HooksQuotesGenerator />}
        {activeTab === 'saved' && <SavedHistory />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-800 dark:text-slate-200 font-['Space_Grotesk'] text-sm">
              CreatorAI
            </span>
            <span>— Modern AI Content Creation for Global Creators & Businesses</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('hub')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Creation Hub
            </button>
            <button
              onClick={() => setActiveTab('scripts')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Video Scripts
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Business Ads
            </button>
            <button
              onClick={() => setActiveTab('posters')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              AI Posters
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className="text-purple-600 dark:text-purple-400 font-bold"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal />
      <PricingModal />
      <ProfileModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
