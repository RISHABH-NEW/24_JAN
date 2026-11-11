// LEVEL UP 73 - Authentication View
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { triggerConfetti } from '../components/common/Confetti';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, signUp, resetPassword, isSupabaseConnected } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          triggerConfetti();
          navigate('/');
        } else {
          setError(res.error || 'Login failed. Please check credentials.');
        }
      } else if (mode === 'signup') {
        const res = await signUp(email, password, fullName);
        if (res.success) {
          triggerConfetti();
          navigate('/');
        } else {
          setError(res.error || 'Signup failed.');
        }
      } else {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMessage('Password reset link sent to your email.');
        } else {
          setError(res.error || 'Failed to send reset email.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-indigo-600 to-secondary flex items-center justify-center shadow-glow-primary mb-3">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white font-mono">
            LEVEL UP <span className="text-primary">73</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            Personal Transformation & Mastery
          </p>

          <div className="mt-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
              Challenge Deadline: 23 Jan 2027
            </span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-2xl p-6 sm:p-8 backdrop-blur-xl text-white">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-800/80 p-1 mb-6 border border-slate-700/60">
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'login' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'signup' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => {
                setMode('forgot');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'forgot' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Your Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rishabh"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rishabh@levelup73.dev"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-medium"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-medium"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-xs font-bold text-white shadow-glow-primary transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                'Processing...'
              ) : mode === 'login' ? (
                <>
                  Sign In to Tracker <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'signup' ? (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>

          {/* Security & Architecture Note */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full PostgreSQL RLS Ready • Encrypted Session Isolated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

