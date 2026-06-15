import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Key, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
  const { verifyEmail } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

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

      {success ? (
        <div className="p-8 rounded-2xl glass-panel text-center flex flex-col items-center gap-4">
          <CheckCircle className="text-emerald-400" size={40} />
          <h3 className="text-lg font-bold text-white">Account Verified!</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Your email is now verified. Redirecting you to login...
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default VerifyEmail;
