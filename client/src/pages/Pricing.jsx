import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Check, ShieldAlert, Sparkles, Loader } from 'lucide-react';

const Pricing = () => {
  const { user, checkoutPremium } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setMessage('');
    try {
      const res = await checkoutPremium();
      if (res.success) {
        setMessage('Congratulations! You are now a Premium user.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Upgrade failed. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Flexible Plans for every <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Student</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Upgrade to Premium for full unlimited access to project code generation, document compilation, and examiner viva mocks.
        </p>
      </div>

      {message && (
        <div className="mb-8 p-4 rounded-xl max-w-md mx-auto bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
        {/* Free Plan */}
        <div className="p-8 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
            <p className="text-gray-400 text-xs mb-6">Standard student toolkit essentials.</p>
            <div className="text-3xl font-extrabold text-white mb-8">$0 <span className="text-sm font-normal text-gray-500">/ forever</span></div>
            
            <ul className="space-y-3 text-xs text-gray-300 mb-8">
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> 1 ATS Resume Template</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> 1 Public Portfolio Webpage</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> 1 AI Project Outline Generation</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> 2 AI Homework Assignments</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Floating AI Assistant guidance</li>
            </ul>
          </div>
          
          <button disabled className="w-full py-3 border border-white/10 rounded-xl text-xs font-semibold text-gray-400 text-center cursor-not-allowed">
            Current Free Tier
          </button>
        </div>

        {/* Premium Plan */}
        <div className="p-8 rounded-2xl bg-gradient-to-b from-purple-900/10 to-[#121626] border border-purple-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[9px] uppercase tracking-wider font-extrabold text-purple-400 flex items-center gap-1">
            <Sparkles size={8} /> Popular
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Plan</h3>
            <p className="text-gray-400 text-xs mb-6">Unlimited thesis writing and interview simulators.</p>
            <div className="text-3xl font-extrabold text-white mb-8">$10 <span className="text-sm font-normal text-gray-500">/ month</span></div>

            <ul className="space-y-3 text-xs text-gray-300 mb-8">
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Unlimited ATS Resumes (All Templates)</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Unlimited Published Portfolio Webs</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Custom Subdomain/Paths & Code Export</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Unlimited Final Year Project generation</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Unlimited Assignments & DOCX Exporters</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Thesis chapters writer (UML, SRS)</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-purple-400" /> Unlimited Examiner Viva Prep sessions</li>
            </ul>
          </div>

          {user?.plan === 'premium' ? (
            <button disabled className="w-full py-3 bg-purple-600/20 border border-purple-500/30 rounded-xl text-xs font-semibold text-purple-400 text-center cursor-not-allowed">
              You Have Premium
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 btn-cyber flex items-center justify-center gap-2 font-semibold text-xs transition-transform"
            >
              {loading ? (
                <>
                  <Loader size={14} className="animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Upgrade to Premium</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
