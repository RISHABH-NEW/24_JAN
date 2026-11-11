// LEVEL UP 73 - Settings & Supabase Setup Wizard
import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Database,
  Moon,
  Sun,
  Download,
  Upload,
  Copy,
  Check,
  RotateCcw,
  Shield,
  Bell,
  Target,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { storage } from '../services/storageEngine';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isSupabaseConfigured, getSupabaseConfigStatus } from '../services/supabase';
import { triggerConfetti } from '../components/common/Confetti';

export const Settings: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const supabaseStatus = getSupabaseConfigStatus();

  // Profile Form
  const [fullName, setFullName] = useState(user?.full_name || 'Rishabh');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Targets
  const currentSettings = storage.getSettings();
  const [targetDSA, setTargetDSA] = useState(currentSettings.target_dsa_problems || 100);
  const [targetEditing, setTargetEditing] = useState(currentSettings.target_editing_projects || 8);
  const [targetWeb, setTargetWeb] = useState(currentSettings.target_web_projects || 3);
  const [reviewTime, setReviewTime] = useState(currentSettings.daily_review_time || '21:00');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // SQL Copy state
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      full_name: fullName.trim(),
      email: email.trim(),
      avatar_url: avatarUrl.trim() || undefined,
    });
    setProfileSaved(true);
    triggerConfetti();
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateSettings({
      target_dsa_problems: Number(targetDSA),
      target_editing_projects: Number(targetEditing),
      target_web_projects: Number(targetWeb),
      daily_review_time: reviewTime,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = storage.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LEVEL_UP_73_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    if (!importText.trim()) return;
    const success = storage.importData(importText.trim());
    if (success) {
      setImportStatus('Backup successfully imported! Refreshing state...');
      triggerConfetti();
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setImportStatus('Invalid JSON backup format. Please check and try again.');
    }
  };

  const handleCopySQL = () => {
    const sqlScript = `-- LEVEL UP 73 Supabase PostgreSQL Setup
-- Run this in your Supabase SQL Editor:
-- (Full schema is saved in supabase/schema.sql)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT DEFAULT 'Rishabh',
  avatar_url TEXT,
  current_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  streak_count INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  exam_mode TEXT NOT NULL DEFAULT 'normal',
  challenge_start_date DATE NOT NULL DEFAULT '2026-11-11',
  challenge_end_date DATE NOT NULL DEFAULT '2027-01-23'
);
-- See supabase/schema.sql in the project root for all 19 tables and RLS policies.`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset application data to initial challenge baseline state? This cannot be undone.')) {
      storage.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            <SettingsIcon className="w-4 h-4" />
            System Preferences & Data Architecture
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Application Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal profile, challenge benchmarks, theme aesthetics, and database persistence.
          </p>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-dark-secondary hover:bg-rose-500/10 text-slate-600 dark:text-slate-300 hover:text-rose-500 text-xs font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* SUPABASE CONNECTION STATUS & SETUP WIZARD */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-dark-border/60">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                supabaseStatus.isConfigured
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              <Database className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Database & Backend Status
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    supabaseStatus.isConfigured
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                      : 'bg-blue-500/10 text-primary border border-primary/30'
                  }`}
                >
                  {supabaseStatus.isConfigured ? '● Supabase PostgreSQL Live' : '● Local Persistent Reactive Engine Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {supabaseStatus.isConfigured
                  ? `Connected to remote Supabase instance (${supabaseStatus.url}) with Row-Level Security.`
                  : 'Data is persistently stored in local storage and survives refreshes. Connect your free Supabase PostgreSQL instance anytime.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySQL}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-dark-secondary hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            {copiedSQL ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                SQL Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Supabase Migration SQL
              </>
            )}
          </button>
        </div>

        {/* Step-by-step setup guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-secondary/40 border border-slate-200/60 dark:border-dark-border/60 space-y-1">
            <span className="font-mono text-primary font-bold">Step 1: Create Supabase Project</span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Go to supabase.com and launch a free project named "LEVEL-UP-73".
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-secondary/40 border border-slate-200/60 dark:border-dark-border/60 space-y-1">
            <span className="font-mono text-primary font-bold">Step 2: Run Migration SQL</span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Paste the contents of <span className="font-mono text-white">supabase/schema.sql</span> into the Supabase SQL Editor and execute.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-secondary/40 border border-slate-200/60 dark:border-dark-border/60 space-y-1">
            <span className="font-mono text-primary font-bold">Step 3: Add Credentials to .env</span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Set <span className="font-mono text-white">VITE_SUPABASE_URL</span> & <span className="font-mono text-white">VITE_SUPABASE_ANON_KEY</span> in your environment.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Management Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-dark-border/60">
          <User className="w-4 h-4 text-primary" />
          Profile Information
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-emerald-500 font-bold">
              {profileSaved && '✓ Profile saved successfully!'}
            </span>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm transition-all"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {/* Target Benchmarks & Daily Review Schedule */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-dark-border/60">
          <Target className="w-4 h-4 text-secondary" />
          Challenge Targets & 9:00 PM Review Setting
        </h3>

        <form onSubmit={handleSaveTargets} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">DSA Target Problems</label>
              <input
                type="number"
                min="10"
                max="500"
                value={targetDSA}
                onChange={(e) => setTargetDSA(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Editing Target Projects</label>
              <input
                type="number"
                min="1"
                max="50"
                value={targetEditing}
                onChange={(e) => setTargetEditing(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Web Target Milestones</label>
              <input
                type="number"
                min="1"
                max="20"
                value={targetWeb}
                onChange={(e) => setTargetWeb(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Daily Review Time</label>
              <input
                type="time"
                value={reviewTime}
                onChange={(e) => setReviewTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-emerald-500 font-bold">
              {settingsSaved && '✓ Target goals updated!'}
            </span>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-secondary hover:bg-purple-700 text-xs font-bold text-white shadow-sm transition-all"
            >
              Save Target Benchmarks
            </button>
          </div>
        </form>
      </div>

      {/* Theme & Display Mode */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Display Appearance
          </h3>
          <p className="text-xs text-slate-400">
            Switch between futuristic cyber dark mode and modern clean light mode.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border">
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            Dark
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Light
          </button>
        </div>
      </div>

      {/* Data Backup & Disaster Recovery */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-dark-border/60">
          <Download className="w-4 h-4 text-emerald-500" />
          Data Backup, Export & Restore
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Export Complete State</h4>
            <p className="text-xs text-slate-400">
              Download your entire personal transformation dataset (logs, solved problems, workouts, projects, XP).
            </p>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Download JSON Backup
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white">Restore from Backup</h4>
            <textarea
              rows={2}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste exported JSON backup text here..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            />
            {importStatus && (
              <div className="text-xs font-bold text-primary">{importStatus}</div>
            )}
            <button
              onClick={handleImportJSON}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              Restore Dataset
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-dark-border/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Need to reset everything to initial challenge day baseline?
          </div>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Baseline
          </button>
        </div>
      </div>
    </div>
  );
};

