import React, { useEffect, useState } from 'react';
import { Check, Zap, Sparkles, X, ShieldAlert, Award } from 'lucide-react';
import { api } from '../services/api';
import { PlanInfo } from '../types';
import { useAuth } from '../context/AuthContext';

export const PricingModal: React.FC = () => {
  const { user, pricingModalOpen, closePricingModal, refreshUser, openAuthModal } = useAuth();
  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (pricingModalOpen) {
      api.getPlans().then(res => setPlans(res.plans)).catch(console.error);
    }
  }, [pricingModalOpen]);

  if (!pricingModalOpen) return null;

  const handleSelectPlan = async (planId: 'free' | 'pro' | 'enterprise') => {
    if (!user) {
      closePricingModal();
      openAuthModal('register');
      return;
    }

    if (user.plan === planId) {
      return;
    }

    setIsUpgrading(true);
    setUpgradeSuccess(null);
    try {
      const res = await api.upgradePlan(planId, billingCycle);
      setUpgradeSuccess(res.message);
      await refreshUser();
      setTimeout(() => {
        closePricingModal();
        setUpgradeSuccess(null);
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Upgrade failed');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative my-8">
        {/* Close Button */}
        <button
          onClick={closePricingModal}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-lg mx-auto space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>Freemium & Scaling Plans</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Space_Grotesk']">
            Supercharge Your Content Creation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Choose the plan that fits your creator workflow. Transparent pricing, scale anytime.
          </p>

          {/* Billing Switch */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(prev => (prev === 'monthly' ? 'yearly' : 'monthly'))}
              className="w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 p-1 flex items-center transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-full bg-indigo-600 transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold ${billingCycle === 'yearly' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
              Yearly <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-bold ml-1">SAVE 20%</span>
            </span>
          </div>
        </div>

        {/* Regulatory/Payment Notice */}
        <div className="mb-6 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-bold">Sandbox Test Mode Notice: </span>
            In accordance with commercial guidelines, real credit card charges are not processed until our direct local & global payment gateway integration completes testing. Clicking upgrade immediately activates test limits without charging real money.
          </div>
        </div>

        {upgradeSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold text-center animate-fade-in">
            {upgradeSuccess}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => {
            const isCurrent = user?.plan === p.id;
            const isPopular = p.badge === 'POPULAR';
            const price = billingCycle === 'monthly' ? p.priceMonthly : Math.round(p.priceYearly / 12);

            return (
              <div
                key={p.id}
                className={`rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'border-2 border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xl'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-600 text-white tracking-widest shadow-md">
                    {p.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Space_Grotesk']">
                        ${price}
                      </span>
                      <span className="text-xs text-slate-500">/ month</span>
                    </div>
                    {billingCycle === 'yearly' && p.priceYearly > 0 && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        Billed annually (${p.priceYearly}/yr)
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    onClick={() => handleSelectPlan(p.id)}
                    disabled={isCurrent || isUpgrading}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                        : isPopular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white'
                    }`}
                  >
                    {isCurrent ? 'Current Active Plan' : user ? `Switch to ${p.name}` : 'Get Started Free'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
