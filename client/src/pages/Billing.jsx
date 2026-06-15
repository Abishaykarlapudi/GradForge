import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Check, Sparkles, Loader, ShieldCheck } from 'lucide-react';

const Billing = () => {
  const { user, checkoutPremium } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setMsg('');
    try {
      const res = await checkoutPremium();
      if (res.success) {
        setMsg('Successfully upgraded to Premium Plan! All tier boundaries removed.');
      }
    } catch (err) {
      console.error(err);
      setMsg('Upgrade failed. Verify MongoDB server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-left space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Subscription Billing</h1>
        <p className="text-gray-400 text-xs mt-1">Upgrade or manage your subscription tier details.</p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Plan status overview */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Current Status</h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Selected Plan</span>
                <h4 className="text-lg font-extrabold text-white capitalize mt-0.5">{user?.plan || 'Free'} Plan</h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400">
                Active
              </span>
            </div>
            <p className="text-gray-400 text-[10px] leading-relaxed">
              Your subscription plan manages limit allocations on resumes, portfolios, final year project Blueprints, viva exams, and document drafts.
            </p>
          </div>
          
          {user?.plan === 'free' ? (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full mt-6 py-3 btn-cyber flex items-center justify-center gap-2 font-semibold text-xs"
            >
              {loading ? (
                <Loader size={14} className="animate-spin text-white" />
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Simulate Premium Upgrade</span>
                </>
              )}
            </button>
          ) : (
            <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>Full Premium Tier Unlocked</span>
            </div>
          )}
        </div>

        {/* Feature benefits card */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-900/10 to-[#121626] border border-purple-500/35 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles size={16} className="text-purple-400" /> Premium Benefits
            </h3>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-center gap-2"><Check size={12} className="text-purple-400" /> Create unlimited ATS CV sheets</li>
              <li className="flex items-center gap-2"><Check size={12} className="text-purple-400" /> Build unlimited custom subdomain portfolios</li>
              <li className="flex items-center gap-2"><Check size={12} className="text-purple-400" /> Generate unlimited project codebases</li>
              <li className="flex items-center gap-2"><Check size={12} className="text-purple-400" /> Write assignments and thesis chapters</li>
              <li className="flex items-center gap-2"><Check size={12} className="text-purple-400" /> Unlock mock viva practice interviews</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Billing;
