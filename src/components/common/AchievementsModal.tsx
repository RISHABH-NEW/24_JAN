// LEVEL UP 73 - Achievements & Badges Showcase Modal
import React, { useState, useEffect } from 'react';
import {
  Trophy,
  X,
  Lock,
  CheckCircle2,
  Sparkles,
  Zap,
  Code2,
  Film,
  Mic,
  Dumbbell,
  Globe,
  GraduationCap,
  Flame,
  Crown,
} from 'lucide-react';
import { storage } from '../../services/storageEngine';
import { Achievement, XPTransaction } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { calculateLevel } from '../../utils/xpSystem';
import { useAuth } from '../../context/AuthContext';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, any> = {
  Code2,
  Film,
  Mic,
  Dumbbell,
  Globe,
  GraduationCap,
  Flame,
  Crown,
  Zap,
  Cpu: Code2,
  Award: Film,
  BookOpen: Mic,
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [xpTransactions, setXpTransactions] = useState<XPTransaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      setAchievements(storage.getAchievements());
      setXpTransactions(storage.getXPTransactions());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const levelInfo = calculateLevel(user?.current_xp || 0);
  const unlockedCount = achievements.filter((a) => a.unlocked_at).length;
  const totalCount = achievements.length;
  const unlockedPercent = Math.round((unlockedCount / totalCount) * 100);

  const categories = ['all', 'dsa', 'academics', 'editing', 'english', 'gym', 'web', 'streak'];

  const filteredAchievements = achievements.filter((a) =>
    selectedCategory === 'all' ? true : a.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 dark:border-dark-border p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-primary shadow-glow-primary">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Trophy Room & Badges</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                  {unlockedCount} / {totalCount} Unlocked ({unlockedPercent}%)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Milestone accomplishments across the 73-day personal transformation challenge.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Progression Summary */}
        <div className="my-5 p-4 rounded-xl bg-slate-800/50 dark:bg-dark-secondary/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Current Title:</span>
              <span className="text-sm font-extrabold text-primary font-mono">{levelInfo.title}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              Level {levelInfo.level} • {user?.current_xp || 0} Total XP Earned • {levelInfo.xpToNextLevel} XP to Level {levelInfo.level + 1}
            </div>
          </div>

          <div className="min-w-[180px]">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mb-1">
              <span>Next Level Progress</span>
              <span>{levelInfo.progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all font-mono ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredAchievements.map((ach) => {
            const IconComponent = ICON_MAP[ach.icon] || Trophy;
            const isUnlocked = !!ach.unlocked_at;

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-slate-800/80 dark:bg-dark-secondary/80 border-amber-500/30 text-white shadow-sm'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-glow-primary'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isUnlocked ? (
                    <IconComponent className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white truncate">
                      {ach.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold flex-shrink-0">
                      +{ach.xp_reward} XP
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                    {ach.description}
                  </p>

                  <div className="mt-2 text-[10px] font-mono flex items-center justify-between">
                    <span className="uppercase text-slate-500">{ach.category}</span>
                    {isUnlocked ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Unlocked {formatDate(ach.unlocked_at!, 'dd MMM')}
                      </span>
                    ) : (
                      <span className="text-slate-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent XP Activity Stream */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            Recent XP Transactions Ledger
          </h3>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {xpTransactions.slice(0, 6).map((tx) => (
              <div
                key={tx.id}
                className="px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">+{tx.amount} XP</span>
                  <span className="text-slate-300 truncate max-w-sm">{tx.description}</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {formatDate(tx.created_at, 'dd MMM, HH:mm')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

