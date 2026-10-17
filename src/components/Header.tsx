import React, { useState } from 'react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  User as UserIcon, 
  LogOut, 
  Zap, 
  ShieldCheck, 
  Menu, 
  X, 
  Bookmark, 
  Video, 
  MessageSquare, 
  Briefcase, 
  Lightbulb, 
  Image as ImageIcon,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { 
    user, 
    limits, 
    theme, 
    toggleTheme, 
    logout, 
    openAuthModal, 
    openPricingModal, 
    openProfileModal,
    activeTab,
    setActiveTab 
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'hub', label: 'Create Hub', icon: Compass },
    { id: 'scripts', label: 'Video Scripts', icon: Video },
    { id: 'social', label: 'Posts & Captions', icon: MessageSquare },
    { id: 'ads', label: 'Business Ads', icon: Briefcase },
    { id: 'ideas', label: 'Content Ideas', icon: Lightbulb },
    { id: 'posters', label: 'AI Posters', icon: ImageIcon },
    { id: 'saved', label: 'Saved Library', icon: Bookmark },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Portal', icon: ShieldCheck });
  }

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const getPlanBadge = () => {
    if (!user) return { label: 'Guest', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
    if (user.plan === 'enterprise') return { label: 'Enterprise', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' };
    if (user.plan === 'pro') return { label: 'Pro', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' };
    return { label: 'Free', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' };
  };

  const planBadge = getPlanBadge();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('hub')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-['Space_Grotesk']">
                  Creator<span className="text-indigo-600 dark:text-indigo-400">AI</span>
                </span>
                <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${planBadge.color}`}>
                  {planBadge.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Worldwide AI Content & Viral Studio
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Daily Usage indicator */}
            {limits ? (
              <div 
                onClick={openPricingModal} 
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer border border-slate-200 dark:border-slate-700 transition-all"
                title="Click to manage subscription or upgrade limits"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {limits.remainingToday} / {limits.dailyLimit} left today
                </span>
                {user?.plan === 'free' && (
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold ml-1">
                    UPGRADE
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={openPricingModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xs hover:opacity-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                Upgrade
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Account / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline-block text-xs font-medium max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${planBadge.color}`}>
                        {user.plan} plan
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openProfileModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Profile & Usage
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openPricingModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left"
                    >
                      <Zap className="w-4 h-4 text-amber-500" />
                      Subscription Plans
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setActiveTab('admin');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-left font-medium"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
                >
                  Join Free
                </button>
              </div>
            )}

            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-1">
            <span className="text-xs text-slate-500">Plan: {user?.plan || 'Free'}</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openPricingModal();
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
            >
              View Pricing & Upgrades →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
