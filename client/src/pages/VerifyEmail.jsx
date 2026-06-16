import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Key, Loader, CheckCircle, AlertCircle, RefreshCw, Timer } from 'lucide-react';

const VerifyEmail = () => {
  const { verifyEmail, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Resend OTP variables
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(60); // 60s cooldown for resending
  const [expiryTimer, setExpiryTimer] = useState(600); // 10 minutes OTP lifespan
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  // Load URL parameters on mount
  useEffect(() => {
    const urlEmail = searchParams.get('email');
    if (urlEmail) {
      setEmail(urlEmail);
    } else if (user && user.email) {
      setEmail(user.email);
    }
  }, [searchParams, user]);

  // Countdown timer effect for resend cooldown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Expiry timer effect
  useEffect(() => {
    let interval = null;
    if (expiryTimer > 0 && !success) {
      interval = setInterval(() => {
        setExpiryTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expiryTimer, success]);

  const formatExpiryTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim() || expiryTimer <= 0) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await verifyEmail(token, email);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 2000);
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
        setResendMsg('A new verification code has been sent to your email!');
        setTimer(60); // Restart 60s cooldown timer
        setExpiryTimer(600); // Reset OTP expiry to 10 minutes
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Resending failed.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-left">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-white mb-2">Verify Email</h1>
        <p className="text-gray-400 text-xs leading-relaxed">
          We have sent a 6-digit verification code to <span className="text-purple-400 font-semibold">{email || 'your email'}</span>. Enter the code below to complete your registration.
        </p>
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

      {expiryTimer <= 0 && !success && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>Verification code has expired. Please register again to request a new code.</span>
        </div>
      )}

      {success ? (
        <div className="p-8 rounded-2xl glass-panel text-center flex flex-col items-center gap-4">
          <CheckCircle className="text-emerald-400" size={40} />
          <h3 className="text-lg font-bold text-white">Registration Successful!</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Your registration is now complete and your email has been verified. Redirecting to your dashboard...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-panel space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-300">Enter 6-Digit OTP</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  disabled={expiryTimer <= 0}
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 482015"
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-sm tracking-widest font-mono text-center font-bold disabled:opacity-50"
                />
              </div>
            </div>

            {/* Expiry timer display */}
            <div className="flex justify-between items-center text-xs text-gray-400 border-t border-white/5 pt-4">
              <span className="flex items-center gap-1.5"><Timer size={14} /> Code Expires In:</span>
              <span className={`font-mono font-bold ${expiryTimer < 60 ? 'text-red-400 animate-pulse' : 'text-purple-400'}`}>
                {expiryTimer > 0 ? formatExpiryTime(expiryTimer) : 'Expired'}
              </span>
            </div>

            <button 
              type="submit" 
              disabled={loading || token.length !== 6 || expiryTimer <= 0} 
              className="w-full py-3 btn-cyber flex items-center justify-center gap-2 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader size={16} className="animate-spin text-white" />
              ) : (
                <span>Verify Account</span>
              )}
            </button>
          </form>

          {/* Resend mail block */}
          <div className="flex items-center justify-between text-xs pt-4 border-t border-white/5">
            <span className="text-gray-400">Need a new code?</span>
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

          <div className="text-center pt-4 border-t border-white/5">
            <Link to="/register" className="text-xs text-gray-500 hover:text-purple-400 transition font-semibold">
              ← Back to Sign Up / Change Email
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
