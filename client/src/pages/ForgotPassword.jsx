import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Loader, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setResetToken(res.resetToken || '');
        setSuccess(true);
      } else {
        setError(res.message || 'Something went wrong.');
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
        <h1 className="text-3xl font-extrabold text-white mb-2">Forgot Password</h1>
        <p className="text-gray-400 text-xs">Request a reset link for your account password.</p>
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
          <h3 className="text-lg font-bold text-white">Reset Token Generated</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Since we do not send emails, your reset token has been generated and is shown below. Please copy it or proceed directly to reset your password.
          </p>
          {resetToken && (
            <div className="w-full p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs font-mono text-purple-400 select-all font-bold">
              {resetToken}
            </div>
          )}
          <Link to={`/reset-password?token=${resetToken}`} className="mt-4 w-full py-3 btn-cyber text-xs font-semibold">
            Proceed to Reset Password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-panel space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">Registered Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@university.edu"
                className="w-full pl-10 pr-4 py-2.5 glass-input text-sm"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 btn-cyber flex items-center justify-center gap-2 font-semibold text-sm">
            {loading ? (
              <Loader size={16} className="animate-spin text-white" />
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Back to{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">Sign in</Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
