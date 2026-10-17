import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Sliders, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Save, 
  BarChart3, 
  RefreshCw,
  Search,
  Zap,
  Globe
} from 'lucide-react';
import { api } from '../services/api';
import { AdminAnalytics, SystemConfig, User } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings'>('overview');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes, configRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getAdminConfig()
      ]);
      setAnalytics(overviewRes.analytics);
      setUsersList(usersRes.users);
      setConfig(configRes.config);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900 text-center space-y-3">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Authorization Required</h3>
        <p className="text-xs text-slate-500">
          This area is restricted to system administrators. Log in with an administrator account (e.g. admin@creatorai.com) to access system telemetry and controls.
        </p>
      </div>
    );
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.updateAdminUserStatus(userId, nextStatus);
      setUsersList(prev => prev.map(u => (u.id === userId ? { ...u, status: nextStatus } : u)));
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  const handlePlanChange = async (userId: string, newPlan: 'free' | 'pro' | 'enterprise') => {
    try {
      await api.updateAdminUserPlan(userId, newPlan);
      setUsersList(prev => prev.map(u => (u.id === userId ? { ...u, plan: newPlan } : u)));
    } catch (err: any) {
      alert(err.message || 'Plan update failed');
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      await api.updateAdminConfig(config);
      setSaveStatus('System settings updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update config');
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.plan.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-purple-300">
              CreatorAI Administrator Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk']">
            Operations & Control Panel
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Monitor API throughput, configure tier limits, manage registered users, and update platform announcements.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md self-end sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 px-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics & Usage
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Tier Limits & Config
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && analytics && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Registered Users</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {analytics.totalUsers}
              </p>
              <div className="mt-2 text-[11px] text-slate-400">
                {analytics.planCounts.free} Free • {analytics.planCounts.pro} Pro • {analytics.planCounts.enterprise} Enterprise
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Content Generated</span>
              <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {analytics.totalGenerations}
              </p>
              <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Active high-converting outputs
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Pro Subscriptions</span>
              <p className="text-2xl font-extrabold text-amber-500 mt-1">
                {analytics.planCounts.pro + analytics.planCounts.enterprise}
              </p>
              <div className="mt-2 text-[11px] text-slate-400">
                Active sandbox simulated tier
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">AI Model Connected</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                gemini-3.8-flash
              </p>
              <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live Server Production API
              </div>
            </div>
          </div>

          {/* Breakdown by Type */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Content Generation Breakdown By Category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(analytics.typeBreakdown).map(([type, count]) => (
                <div key={type} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 capitalize">{type.replace(/_/g, ' ')}</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white self-start sm:self-auto">
              Registered Creator Accounts
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, email, or plan..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Usage Today</th>
                  <th className="p-4">Total Generations</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                      {u.country && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Globe className="w-3 h-3" />
                          {u.country}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={u.plan}
                        onChange={(e) => handlePlanChange(u.id, e.target.value as any)}
                        className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {u.generationsToday}
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {u.generationsCount}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      }`}>
                        {u.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            u.status === 'active'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && config && (
        <form onSubmit={handleSaveConfig} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Platform Usage Limits & Subscriptions
              </h3>
              <p className="text-xs text-slate-500">
                Configure rate limits, daily quotas per tier, and platform announcements.
              </p>
            </div>
            {saveStatus && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-fade-in">
                {saveStatus}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Free Tier Daily Generations
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={config.freeDailyLimit}
                onChange={(e) => setConfig({ ...config, freeDailyLimit: Number(e.target.value) })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pro Tier Daily Generations
              </label>
              <input
                type="number"
                min={10}
                max={1000}
                value={config.proDailyLimit}
                onChange={(e) => setConfig({ ...config, proDailyLimit: Number(e.target.value) })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Guest Limit Before Signup
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={config.guestDailyLimit}
                onChange={(e) => setConfig({ ...config, guestDailyLimit: Number(e.target.value) })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pro Monthly Subscription Price ($ USD)
              </label>
              <input
                type="number"
                value={config.proMonthlyPrice}
                onChange={(e) => setConfig({ ...config, proMonthlyPrice: Number(e.target.value) })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Enterprise Monthly Subscription Price ($ USD)
              </label>
              <input
                type="number"
                value={config.enterpriseMonthlyPrice}
                onChange={(e) => setConfig({ ...config, enterpriseMonthlyPrice: Number(e.target.value) })}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Broadcast Announcement Banner
            </label>
            <input
              type="text"
              value={config.announcement}
              onChange={(e) => setConfig({ ...config, announcement: e.target.value })}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
