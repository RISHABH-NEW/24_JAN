// LEVEL UP 73 - Analytics Module
import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Flame,
  Shield,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { storage } from '../services/storageEngine';
import { formatDate } from '../utils/dateUtils';
import { calculateLevel } from '../utils/xpSystem';
import { useAuth } from '../context/AuthContext';

export const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [filterRange, setFilterRange] = useState<'7days' | '30days' | 'all'>('7days');
  const [dailyLogs, setDailyLogs] = useState(storage.getDailyLogs());
  const [dsaProblems, setDsaProblems] = useState(storage.getDSAProblems());
  const [editingProjects, setEditingProjects] = useState(storage.getEditingProjects());
  const [englishSessions, setEnglishSessions] = useState(storage.getEnglishSessions());
  const [gymWorkouts, setGymWorkouts] = useState(storage.getGymWorkouts());
  const [webProjects, setWebProjects] = useState(storage.getWebProjects());
  const [syllabusTopics, setSyllabusTopics] = useState(storage.getSyllabusTopics());

  useEffect(() => {
    const refresh = () => {
      setDailyLogs(storage.getDailyLogs());
      setDsaProblems(storage.getDSAProblems());
      setEditingProjects(storage.getEditingProjects());
      setEnglishSessions(storage.getEnglishSessions());
      setGymWorkouts(storage.getGymWorkouts());
      setWebProjects(storage.getWebProjects());
      setSyllabusTopics(storage.getSyllabusTopics());
    };
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  const levelInfo = calculateLevel(user?.current_xp || 0);

  // Filter logs by date range
  const filteredLogs = [...dailyLogs].reverse().filter((_, idx, arr) => {
    if (filterRange === '7days') return idx >= arr.length - 7;
    if (filterRange === '30days') return idx >= arr.length - 30;
    return true;
  });

  // Daily activity graph data
  const activityGraphData = filteredLogs.map((l) => ({
    date: formatDate(l.log_date, 'dd MMM'),
    totalHours: Number((l.total_focused_minutes / 60).toFixed(1)),
    DSA: Number((l.dsa_minutes / 60).toFixed(1)),
    Academics: Number((l.academics_minutes / 60).toFixed(1)),
    Web: Number((l.web_minutes / 60).toFixed(1)),
    Editing: Number((l.editing_minutes / 60).toFixed(1)),
    Gym: Number((l.gym_minutes / 60).toFixed(1)),
    English: Number((l.english_minutes / 60).toFixed(1)),
  }));

  // Time Distribution Pie Data
  let sumAcademics = 0;
  let sumDSA = 0;
  let sumWeb = 0;
  let sumEditing = 0;
  let sumGym = 0;
  let sumEnglish = 0;

  filteredLogs.forEach((l) => {
    sumAcademics += l.academics_minutes || 0;
    sumDSA += l.dsa_minutes || 0;
    sumWeb += l.web_minutes || 0;
    sumEditing += l.editing_minutes || 0;
    sumGym += l.gym_minutes || 0;
    sumEnglish += l.english_minutes || 0;
  });

  const totalMinutesSum = sumAcademics + sumDSA + sumWeb + sumEditing + sumGym + sumEnglish;

  const timeDistributionData = totalMinutesSum > 0 ? [
    { name: 'Academics', value: sumAcademics, color: '#3987FF' },
    { name: 'DSA', value: sumDSA, color: '#6366F1' },
    { name: 'Web Dev', value: sumWeb, color: '#06B6D4' },
    { name: 'Video Editing', value: sumEditing, color: '#A855F7' },
    { name: 'Gym', value: sumGym, color: '#F59E0B' },
    { name: 'English', value: sumEnglish, color: '#10B981' },
  ].filter((item) => item.value > 0) : [];

  // Academic preparation score: % of completed syllabus topics + exam readiness
  const totalTopics = syllabusTopics.length;
  const completedTopics = syllabusTopics.filter((t) => t.is_completed).length;
  const academicPrepScore = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Skill-wise progress metrics
  const dsaProgress = Math.min(100, Math.round((dsaProblems.length / 100) * 100));
  const editingProgress = Math.min(100, Math.round((editingProjects.filter((p) => p.completion_status === 'completed').length / 8) * 100));
  const webProgress = Math.min(100, Math.round((webProjects.filter((p) => p.status === 'completed').length / 3) * 100));
  const englishProgress = Math.min(100, Math.round((englishSessions.length / 20) * 100));
  const gymProgress = Math.min(100, Math.round((gymWorkouts.length / 25) * 100));

  const totalFocusedHoursAll = (dailyLogs.reduce((s, l) => s + (l.total_focused_minutes || 0), 0) / 60).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary font-mono">
            <BarChart3 className="w-4 h-4" />
            Execution Analytics & Metrics Engine
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Performance & Skill Progression
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quantitative analysis calculated directly from database study logs, workouts, and solved problems.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs">
          <button
            onClick={() => setFilterRange('7days')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterRange === '7days'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setFilterRange('30days')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterRange === '30days'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Past 30 Days
          </button>
          <button
            onClick={() => setFilterRange('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterRange === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            All Logs
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Focused Hours</div>
          <div className="text-2xl font-black text-primary font-mono mt-1">
            {totalFocusedHoursAll} <span className="text-xs text-slate-400">hrs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Calculated from user logs</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Academic Prep Score</div>
          <div className="text-2xl font-black text-emerald-500 font-mono mt-1">
            {academicPrepScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {completedTopics}/{totalTopics} syllabus units
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Current Streak</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1 flex items-center gap-1">
            <Flame className="w-5 h-5 fill-amber-400" />
            {user?.streak_count || 0}d
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Best streak: {user?.best_streak || 0}d</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Gamer Level & XP</div>
          <div className="text-2xl font-black text-secondary font-mono mt-1">
            LVL {levelInfo.level}
          </div>
          <div className="text-[11px] text-primary font-bold mt-1">{user?.current_xp || 0} Total XP</div>
        </div>
      </div>

      {/* Main Charts: Activity Trend & Time Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Focused Hours Stacked Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Focused Hours by Category (Hours/Day)
              </h3>
              <p className="text-[11px] text-slate-400">
                Daily activity breakdown across all 6 disciplines
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            {activityGraphData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 p-6 text-center">
                <BarChart3 className="w-8 h-8 text-slate-600 mb-2 stroke-1" />
                No daily activity recorded in this date range. Complete sessions or daily check-ins to view your activity breakdown.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151F35',
                      borderColor: '#1E2D4A',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Academics" stackId="a" fill="#3987FF" />
                  <Bar dataKey="DSA" stackId="a" fill="#6366F1" />
                  <Bar dataKey="Web" stackId="a" fill="#06B6D4" />
                  <Bar dataKey="Editing" stackId="a" fill="#A855F7" />
                  <Bar dataKey="Gym" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="English" stackId="a" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Time Distribution Donut Chart */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-secondary" />
              Time Distribution Share
            </h3>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {timeDistributionData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 p-6 text-center">
                <PieIcon className="w-8 h-8 text-slate-600 mb-2 stroke-1" />
                No focused time recorded yet. As you log sessions, your skill distribution will render here.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {timeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151F35',
                      borderColor: '#1E2D4A',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                    formatter={(val: any) => [`${Math.round(val / 60)} hrs`, 'Focused Time']}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {timeDistributionData.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-center pt-2 border-t border-slate-100 dark:border-dark-border/60">
              {timeDistributionData.map((item) => (
                <span key={item.name} style={{ color: item.color }}>
                  ● {item.name}: {Math.round(item.value / 60)}h
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skill-wise Completion Progress Bars */}
      <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-dark-border/60">
          <Shield className="w-4 h-4 text-primary" />
          Skill-Wise Overall Milestone Completion
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-secondary/50 border border-slate-200/60 dark:border-dark-border/60">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-800 dark:text-white">DSA (Target: 100)</span>
              <span className="text-indigo-400 font-mono">{dsaProblems.length}/100 ({dsaProgress}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${dsaProgress}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-secondary/50 border border-slate-200/60 dark:border-dark-border/60">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-800 dark:text-white">Editing (Target: 8 Projects)</span>
              <span className="text-purple-400 font-mono">{editingProjects.filter((p) => p.completion_status === 'completed').length}/8 ({editingProgress}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${editingProgress}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-secondary/50 border border-slate-200/60 dark:border-dark-border/60">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-800 dark:text-white">Web Milestones (Target: 3)</span>
              <span className="text-cyan-400 font-mono">{webProjects.filter((p) => p.status === 'completed').length}/3 ({webProgress}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${webProgress}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-secondary/50 border border-slate-200/60 dark:border-dark-border/60">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-800 dark:text-white">Academics (Syllabus Coverage)</span>
              <span className="text-blue-400 font-mono">{completedTopics}/{totalTopics} ({academicPrepScore}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${academicPrepScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-secondary/50 border border-slate-200/60 dark:border-dark-border/60">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-800 dark:text-white">English Speaking Fluency</span>
              <span className="text-emerald-400 font-mono">{englishSessions.length} Sessions</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${englishProgress}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-secondary/50 border border-slate-200/60 dark:border-dark-border/60">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-800 dark:text-white">Gym Workouts Logged</span>
              <span className="text-amber-400 font-mono">{gymWorkouts.length} Workouts</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${gymProgress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
