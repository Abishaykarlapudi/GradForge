import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Key, Loader, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const VerifyEmail = () => {
  const { verifyEmail } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Resend OTP variables
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(10);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Load URL parameters on mount
  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    if (urlToken) setToken(urlToken);
    if (urlEmail) {
      setEmail(urlEmail);
    } else {
      setShowEmailInput(true); // Let them type if email isn't in URL
    }
  }, [searchParams]);

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await verifyEmail(token);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setError(res.message || 'Email verification failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !email.trim()) return;
    
    setResending(true);
    setResendMsg('');
    setError('');

    try {
      const res = await axios.post('/api/auth/resend-verification', { email });
      if (res.data.success) {
        setResendMsg('A new verification code has been generated!');
        if (res.data.verificationToken) {
          setToken(res.data.verificationToken); // Autofill for preview testing bypass
        }
        setTimer(10); // Restart countdown timer
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Resending failed. Verify email belongs to registered user.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-left">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Verify Email</h1>
        <p className="text-gray-400 text-xs">Enter your registration verification token to unlock access.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {resendMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{resendMsg}</span>
        </div>
      )}

      {success ? (
        <div className="p-8 rounded-2xl glass-panel text-center flex flex-col items-center gap-4">
          <CheckCircle className="text-emerald-400" size={40} />
          <h3 className="text-lg font-bold text-white">Account Verified!</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Your email is now verified. Redirecting you to login...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-panel space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-300">Verification Token</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste code from console logs"
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
                />
              </div>
            </div>

            <button type="submit" disabled={loading || !token.trim()} className="w-full py-3 btn-cyber flex items-center justify-center gap-2 font-semibold text-sm">
              {loading ? (
                <Loader size={16} className="animate-spin text-white" />
              ) : (
                <span>Verify Account</span>
              )}
            </button>
          </form>

          {/* Resend mail block */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <div className="flex flex-col gap-3">
              {showEmailInput && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Resend Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@university.edu"
                    className="glass-input text-xs"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-400">Didn't receive the email?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0 || resending || !email.trim()}
                  className="text-purple-400 font-bold hover:text-purple-300 disabled:text-gray-500 flex items-center gap-1 transition"
                >
                  {resending ? (
                    <Loader size={12} className="animate-spin" />
                  ) : (
                    <RefreshCw size={12} />
                  )}
                  <span>
                    {timer > 0 ? `Resend Code (${timer}s)` : 'Resend Code'}
                  </span>
                </button>
              </div>

              {!showEmailInput && (
                <button 
                  onClick={() => setShowEmailInput(true)} 
                  className="text-left text-[10px] text-purple-400/80 hover:text-purple-300 transition underline"
                >
                  Send to a different email address?
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
