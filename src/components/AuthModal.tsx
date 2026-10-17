import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalTab, openAuthModal, closeAuthModal, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('Business & Marketing');
  const [country, setCountry] = useState('Global');
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (authModalTab === 'login') {
        await login(email, password);
      } else if (authModalTab === 'register') {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register({ name, email, password, niche, country });
      } else {
        // Reset password
        setResetMessage(`Password reset link simulated for ${email}. Check your inbox!`);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@creatorai.com');
    setPassword('admin123');
  };

  const fillDemoCreator = () => {
    setEmail('salimubright81@gmail.com');
    setPassword('creator123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative my-8">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk']">
          {authModalTab === 'login' && 'Welcome Back to CreatorAI'}
          {authModalTab === 'register' && 'Start Creating with AI'}
          {authModalTab === 'forgot' && 'Reset Your Password'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
          {authModalTab === 'login' && 'Log in to access your saved scripts, history, and Pro limits.'}
          {authModalTab === 'register' && 'Create your free account to unlock daily viral generations.'}
          {authModalTab === 'forgot' && 'Enter your email address to recover your account.'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        {resetMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            {resetMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalTab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Salimu Bright"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {authModalTab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {authModalTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot')}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {authModalTab === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Niche
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Business & eCommerce">Business & eCommerce</option>
                  <option value="Tech & AI">Tech & AI</option>
                  <option value="Personal Growth">Personal Growth</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Region
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Global">Global / Worldwide</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Ghana">Ghana</option>
                  <option value="South Africa">South Africa</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {authModalTab === 'login' && 'Sign In'}
                  {authModalTab === 'register' && 'Create Account'}
                  {authModalTab === 'forgot' && 'Send Reset Instructions'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins for Testing */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 mb-2 text-center uppercase tracking-wider">
            Quick Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-purple-100 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Account</span>
            </button>
            <button
              type="button"
              onClick={fillDemoCreator}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Creator Pro</span>
            </button>
          </div>
        </div>

        {/* Switch mode */}
        <div className="mt-4 text-center">
          {authModalTab === 'login' ? (
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                onClick={() => openAuthModal('register')}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                onClick={() => openAuthModal('login')}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
