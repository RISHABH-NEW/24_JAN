// LEVEL UP 73 - 9 PM In-App Daily Review Modal
import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Smile,
  Save,
  Trophy,
  Flame,
} from 'lucide-react';
import { storage } from '../../services/storageEngine';
import { getChallengeStats } from '../../utils/dateUtils';
import { triggerConfetti } from './Confetti';

interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const stats = getChallengeStats();
  const todayTasks = storage.getDailyTasks(stats.todayDateISO);
  const completedTasks = todayTasks.filter((t) => t.is_completed);
  const missedTasks = todayTasks.filter((t) => !t.is_completed);

  const existingLog = storage.getDailyLog(stats.todayDateISO);

  const [achievementInput, setAchievementInput] = useState('');
  const [achievements, setAchievements] = useState<string[]>(
    existingLog?.review_data?.achievements || completedTasks.map((t) => t.title)
  );

  const [missedInput, setMissedInput] = useState('');
  const [missed, setMissed] = useState<string[]>(
    existingLog?.review_data?.missed || missedTasks.map((t) => t.title)
  );

  const [planInput, setPlanInput] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState<string[]>(
    existingLog?.review_data?.tomorrow_plan || []
  );

  const [notes, setNotes] = useState(existingLog?.notes || '');
  const [mood, setMood] = useState(existingLog?.review_data?.mood || 'High Focus');
  const [isSaved, setIsSaved] = useState(false);

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setAchievements([...achievements, achievementInput.trim()]);
      setAchievementInput('');
    }
  };

  const handleAddMissed = () => {
    if (missedInput.trim()) {
      setMissed([...missed, missedInput.trim()]);
      setMissedInput('');
    }
  };

  const handleAddPlan = () => {
    if (planInput.trim()) {
      setTomorrowPlan([...tomorrowPlan, planInput.trim()]);
      setPlanInput('');
    }
  };

  const handleSaveReview = () => {
    const totalMinutes = todayTasks
      .filter((t) => t.is_completed)
      .reduce((sum, t) => sum + t.duration_minutes, 0);

    const academicsMins = todayTasks.filter((t) => t.is_completed && t.category === 'academics').reduce((sum, t) => sum + t.duration_minutes, 0);
    const dsaMins = todayTasks.filter((t) => t.is_completed && t.category === 'dsa').reduce((sum, t) => sum + t.duration_minutes, 0);
    const editingMins = todayTasks.filter((t) => t.is_completed && t.category === 'editing').reduce((sum, t) => sum + t.duration_minutes, 0);
    const englishMins = todayTasks.filter((t) => t.is_completed && t.category === 'english').reduce((sum, t) => sum + t.duration_minutes, 0);
    const gymMins = todayTasks.filter((t) => t.is_completed && t.category === 'gym').reduce((sum, t) => sum + t.duration_minutes, 0);
    const webMins = todayTasks.filter((t) => t.is_completed && t.category === 'web').reduce((sum, t) => sum + t.duration_minutes, 0);

    storage.saveDailyLog({
      log_date: stats.todayDateISO,
      academics_minutes: academicsMins,
      dsa_minutes: dsaMins,
      editing_minutes: editingMins,
      english_minutes: englishMins,
      gym_minutes: gymMins,
      web_minutes: webMins,
      total_focused_minutes: totalMinutes,
      notes,
      review_completed: true,
      review_data: {
        achievements,
        missed,
        tomorrow_plan: tomorrowPlan,
        mood,
      },
    });

    storage.awardXP(30, 'daily_review', `review-${stats.todayDateISO}`, 'Completed 9 PM Daily Productivity Review');
    triggerConfetti();
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 dark:border-dark-border shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow-primary">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                9:00 PM Daily Review & Debrief
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-primary/20 text-primary border border-primary/30 font-mono">
                  +30 XP
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {stats.todayFormatted} • Challenge Day {stats.daysCompleted + 1}
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

        <div className="mt-5 space-y-6">
          {/* Daily Quick Summary Pill */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-800/40 dark:bg-dark-secondary/60 border border-slate-700/50">
            <div className="text-center">
              <div className="text-xs text-slate-400">Completed</div>
              <div className="text-base font-bold text-emerald-400">
                {completedTasks.length} Tasks
              </div>
            </div>
            <div className="text-center border-x border-slate-700/50">
              <div className="text-xs text-slate-400">Streak</div>
              <div className="text-base font-bold text-amber-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                Active
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Completion</div>
              <div className="text-base font-bold text-primary">
                {todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Section 1: Today's Achievements */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Today's Key Achievements & Wins
            </label>
            <div className="space-y-1.5 mb-2">
              {achievements.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200"
                >
                  <span>• {item}</span>
                  <button
                    onClick={() => setAchievements(achievements.filter((_, i) => i !== idx))}
                    className="text-emerald-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAchievement()}
                placeholder="e.g. Mastered binary search, hit bench press PR..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-dark-secondary border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleAddAchievement}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
              >
                Add Win
              </button>
            </div>
          </div>

          {/* Section 2: Missed Targets / Roadblocks */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4" />
              Missed Targets or Roadblocks
            </label>
            <div className="space-y-1.5 mb-2">
              {missed.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200"
                >
                  <span>• {item}</span>
                  <button
                    onClick={() => setMissed(missed.filter((_, i) => i !== idx))}
                    className="text-amber-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={missedInput}
                onChange={(e) => setMissedInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMissed()}
                placeholder="e.g. Skipped 15 mins of video editing due to lecture..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-dark-secondary border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleAddMissed}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition-colors"
              >
                Add Missed
              </button>
            </div>
          </div>

          {/* Section 3: Tomorrow's Recommendations & Plan */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 mb-2">
              <ArrowRight className="w-4 h-4" />
              Tomorrow's Action Plan
            </label>
            <div className="space-y-1.5 mb-2">
              {tomorrowPlan.length === 0 ? (
                <div className="text-[11px] text-slate-400 italic py-1">
                  No plan items added for tomorrow yet. Type below to set your high-priority actions.
                </div>
              ) : (
                tomorrowPlan.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-blue-200"
                  >
                    <span>→ {item}</span>
                    <button
                      onClick={() => setTomorrowPlan(tomorrowPlan.filter((_, i) => i !== idx))}
                      className="text-primary hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={planInput}
                onChange={(e) => setPlanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlan()}
                placeholder="e.g. Complete OS Semaphores unit, 1 LeetCode Hard..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-dark-secondary border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleAddPlan}
                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white transition-colors"
              >
                Add Step
              </button>
            </div>
          </div>

          {/* Mood & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1 mb-1.5">
                <Smile className="w-3.5 h-3.5 text-secondary" />
                Current Focus & Energy Mood
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 dark:bg-dark-secondary border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
              >
                <option value="Apex Flow State">⚡ Apex Flow State</option>
                <option value="High Focus">🎯 High Focus</option>
                <option value="Steady & Disciplined">🛡️ Steady & Disciplined</option>
                <option value="Exhausted but Resilient">💪 Exhausted but Resilient</option>
                <option value="Need Better Rest">🌙 Need Better Rest</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 block">
                Reflection Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Quick thoughts on today's execution..."
                className="w-full px-3 py-2 rounded-lg bg-slate-800 dark:bg-dark-secondary border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 dark:border-dark-border flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Completing review awards <span className="text-primary font-bold">+30 XP</span> and solidifies daily streak.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveReview}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-glow-primary transition-all active:scale-95"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Saved & Rewarded!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save & Complete Review
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

