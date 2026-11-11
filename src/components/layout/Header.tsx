// LEVEL UP 73 - Header Component
import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Moon,
  Sun,
  Flame,
  Award,
  Zap,
  ShieldAlert,
  ChevronDown,
  Menu,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getChallengeStats } from '../../utils/dateUtils';
import { calculateLevel } from '../../utils/xpSystem';
import { EXAM_MODES_CONFIG } from '../../data/defaultSchedule';
import { ExamMode } from '../../types';
import { storage } from '../../services/storageEngine';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenDailyReview: () => void;
  onOpenAchievements?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, onOpenDailyReview, onOpenAchievements }) => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showExamDropdown, setShowExamDropdown] = useState(false);

  const stats = getChallengeStats();
  const levelInfo = calculateLevel(user?.current_xp || 0);
  const currentExamMode = user?.exam_mode || 'normal';
  const currentExamConfig = EXAM_MODES_CONFIG[currentExamMode];

  const handleSelectExamMode = (mode: ExamMode) => {
    storage.setExamMode(mode);
    updateUser({ exam_mode: mode });
    setShowExamDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-dark-border/80 dark:border-dark-border/80 bg-white/80 dark:bg-dark-bg/85 backdrop-blur-md transition-colors duration-200 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Date / Countdown */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-secondary focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary font-mono flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              {stats.todayFormatted}
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600"></span>
            {/* Streak Badge */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-500 animate-flame" />
              <span>{user?.streak_count || 0} Day Streak</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              Day {stats.daysCompleted + 1} of {stats.totalDays}
            </span>
            <span>•</span>
            <span className="text-emerald-500 font-semibold">
              {stats.remainingDays} Days Left
            </span>
            <span className="hidden md:inline text-slate-400">• Deadline: 23 Jan 2027</span>
          </div>
        </div>
      </div>

      {/* Center: Exam Mode Pill Switcher */}
      <div className="relative">
        <button
          onClick={() => setShowExamDropdown(!showExamDropdown)}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
            currentExamMode !== 'normal'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 shadow-glow-primary'
              : 'bg-dark-secondary/60 border-dark-border text-slate-300 hover:bg-dark-card'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>MODE: <span className="text-white font-extrabold">{currentExamConfig.name}</span></span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>

        {/* Dropdown */}
        {showExamDropdown && (
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-dark-card border border-dark-border shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-2 border-b border-dark-border/60">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Exam Mode Switcher</p>
              <p className="text-[11px] text-slate-400">Dynamic daily routine prioritization</p>
            </div>
            <div className="space-y-1 mt-1.5">
              {(['normal', 'put', 'practical', 'end_sem'] as ExamMode[]).map((mode) => {
                const conf = EXAM_MODES_CONFIG[mode];
                const isSelected = currentExamMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => handleSelectExamMode(mode)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-primary/20 text-white border border-primary/40'
                        : 'text-slate-300 hover:bg-dark-secondary hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        {conf.name}
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{conf.badge}</div>
                    </div>
                    {conf.planningDurationDays > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        ~{conf.planningDurationDays}d
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right: 9 PM Daily Review, Theme Toggle, XP & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 9 PM Daily Review Button */}
        <button
          onClick={onOpenDailyReview}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-glow-primary hover:opacity-95 transition-all active:scale-95"
          title="Open Daily 9 PM Review"
        >
          <BellRing className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Daily Review</span>
          <span className="sm:hidden">Review</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-secondary transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Level & XP Pill */}
        <button
          onClick={onOpenAchievements}
          className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-dark-border hover:opacity-85 transition-opacity text-left"
          title="Open Trophy Room & Achievements"
        >
          <div className="hidden md:flex flex-col items-end text-right">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-white">
              <span>{user?.full_name || 'Rishabh'}</span>
              <span className="px-1.5 py-0.2 rounded bg-secondary/20 text-secondary text-[10px] font-extrabold border border-secondary/30">
                LVL {levelInfo.level}
              </span>
            </div>
            <div className="text-[11px] text-primary font-mono font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 fill-primary" />
              {user?.current_xp || 0} XP
            </div>
          </div>

          <div className="relative">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.full_name || 'User'}
              className="w-9 h-9 rounded-full ring-2 ring-primary/40 object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-dark-bg flex items-center justify-center text-[9px] font-bold text-white">
              {levelInfo.level}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};

