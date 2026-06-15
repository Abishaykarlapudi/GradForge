import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Key, Lock, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Automatically fetch token from URL if present
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await resetPassword(token, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.message || 'Reset password failed.');
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
        <h1 className="text-3xl font-extrabold text-white mb-2">Reset Password</h1>
        <p className="text-gray-400 text-xs">Enter your reset token and your new password details.</p>
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
          <h3 className="text-lg font-bold text-white">Password Updated!</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Your credentials have been successfully updated. Redirecting to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-panel space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">Reset Token</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token here"
                className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 btn-cyber flex items-center justify-center gap-2 font-semibold text-sm">
            {loading ? (
              <Loader size={16} className="animate-spin text-white" />
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
