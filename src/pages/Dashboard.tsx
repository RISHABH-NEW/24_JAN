// LEVEL UP 73 - Dashboard View
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Flame,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  ArrowUpRight,
  GraduationCap,
  Code2,
  Film,
  Mic,
  Dumbbell,
  Globe,
  Sparkles,
  TrendingUp,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { storage } from '../services/storageEngine';
import { useAuth } from '../context/AuthContext';
import { getChallengeStats, formatDate, getDaysUntil } from '../utils/dateUtils';
import { calculateLevel } from '../utils/xpSystem';
import { DailyTask, TaskCategory } from '../types';
import { triggerConfetti } from '../components/common/Confetti';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(getChallengeStats());
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [dailyNotes, setDailyNotes] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('dsa');
  const [newTaskDuration, setNewTaskDuration] = useState(45);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Load and subscribe to real database/storage records
  useEffect(() => {
    const refreshData = () => {
      setStats(getChallengeStats());
      const currentTasks = storage.getDailyTasks(stats.todayDateISO);
      setTasks(currentTasks);
      const log = storage.getDailyLog(stats.todayDateISO);
      if (log?.notes) setDailyNotes(log.notes);
    };

    refreshData();
    const unsub = storage.subscribe(refreshData);
    return () => unsub();
  }, [stats.todayDateISO]);

  const levelInfo = calculateLevel(user?.current_xp || 0);

  // Real calculations
  const completedTasks = tasks.filter((t) => t.is_completed);
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const totalFocusedMinutes = completedTasks.reduce((sum, t) => sum + t.duration_minutes, 0);

  // Six categories status
  const categoriesList: {
    name: string;
    cat: TaskCategory;
    icon: any;
    color: string;
    bgColor: string;
    route: string;
  }[] = [
    { name: 'Academics', cat: 'academics', icon: GraduationCap, color: 'text-blue-500', bgColor: 'bg-blue-500/10', route: '/academics' },
    { name: 'DSA', cat: 'dsa', icon: Code2, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', route: '/dsa' },
    { name: 'Video Editing', cat: 'editing', icon: Film, color: 'text-purple-500', bgColor: 'bg-purple-500/10', route: '/editing' },
    { name: 'English', cat: 'english', icon: Mic, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', route: '/english' },
    { name: 'Gym', cat: 'gym', icon: Dumbbell, color: 'text-amber-500', bgColor: 'bg-amber-500/10', route: '/gym' },
    { name: 'Web Designing', cat: 'web', icon: Globe, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', route: '/web' },
  ];

  // Real weekly logs for chart
  const weeklyLogs = storage.getDailyLogs().slice(0, 7).reverse();
  const chartData = weeklyLogs.map((l) => ({
    date: formatDate(l.log_date, 'EEE (dd)'),
    minutes: l.total_focused_minutes,
    hours: Number((l.total_focused_minutes / 60).toFixed(1)),
    dsa: l.dsa_minutes,
    academics: l.academics_minutes,
    web: l.web_minutes,
  }));

  // Upcoming Exams
  const upcomingExams = storage.getExams()
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => a.exam_date.localeCompare(b.exam_date));

  const subjects = storage.getSubjects();

  const handleToggleTask = (task: DailyTask) => {
    const updated = storage.updateTask(task.id, { is_completed: !task.is_completed });
    if (updated?.is_completed) {
      triggerConfetti();
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    storage.addTask({
      task_date: stats.todayDateISO,
      category: newTaskCategory,
      title: newTaskTitle.trim(),
      duration_minutes: Number(newTaskDuration),
      is_completed: false,
      priority: 'medium',
    });

    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  const handleSaveNotes = () => {
    const academicsMins = tasks.filter((t) => t.is_completed && t.category === 'academics').reduce((sum, t) => sum + t.duration_minutes, 0);
    const dsaMins = tasks.filter((t) => t.is_completed && t.category === 'dsa').reduce((sum, t) => sum + t.duration_minutes, 0);
    const editingMins = tasks.filter((t) => t.is_completed && t.category === 'editing').reduce((sum, t) => sum + t.duration_minutes, 0);
    const englishMins = tasks.filter((t) => t.is_completed && t.category === 'english').reduce((sum, t) => sum + t.duration_minutes, 0);
    const gymMins = tasks.filter((t) => t.is_completed && t.category === 'gym').reduce((sum, t) => sum + t.duration_minutes, 0);
    const webMins = tasks.filter((t) => t.is_completed && t.category === 'web').reduce((sum, t) => sum + t.duration_minutes, 0);

    storage.saveDailyLog({
      log_date: stats.todayDateISO,
      academics_minutes: academicsMins,
      dsa_minutes: dsaMins,
      editing_minutes: editingMins,
      english_minutes: englishMins,
      gym_minutes: gymMins,
      web_minutes: webMins,
      total_focused_minutes: totalFocusedMinutes,
      notes: dailyNotes,
      review_completed: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* SECTION A: Challenge Overview Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-dark-card to-slate-900 border border-dark-border p-6 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider font-mono">
                Challenge Active
              </span>
              <span className="text-xs text-slate-400">
                11 Nov 2026 → 23 Jan 2027
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              LEVEL UP 73 <span className="text-primary font-black">Dashboard</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl">
              Targeted transformation across 5 high-leverage skills and academic mastery for Rishabh.
            </p>
          </div>

          {/* Countdown & Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 dark:bg-dark-secondary/80 border border-slate-700/60 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Remaining</div>
              <div className="text-xl md:text-2xl font-black text-emerald-400 font-mono">
                {stats.remainingDays}
              </div>
              <div className="text-[10px] text-slate-400">Days to Jan 23</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 dark:bg-dark-secondary/80 border border-slate-700/60 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Completed</div>
              <div className="text-xl md:text-2xl font-black text-primary font-mono">
                {stats.daysCompleted}
              </div>
              <div className="text-[10px] text-slate-400">of 74 Days</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 dark:bg-dark-secondary/80 border border-slate-700/60 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Current Streak</div>
              <div className="text-xl md:text-2xl font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-amber-400 animate-flame" />
                {user?.streak_count || 0}d
              </div>
              <div className="text-[10px] text-slate-400">Best: {user?.best_streak || 0}d</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 dark:bg-dark-secondary/80 border border-slate-700/60 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Challenge %</div>
              <div className="text-xl md:text-2xl font-black text-secondary font-mono">
                {stats.completionPercentage}%
              </div>
              <div className="text-[10px] text-slate-400">Total Progress</div>
            </div>
          </div>
        </div>

        {/* Challenge Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
            <span>Overall Challenge Timeline</span>
            <span className="text-white font-bold">{stats.daysCompleted} / {stats.totalDays} Days Completed</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-indigo-500 to-secondary transition-all duration-700 rounded-full"
              style={{ width: `${Math.max(2, stats.completionPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* SECTION B: Today's 6 Skill Categories Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Today's Progress Across 6 Pillars
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Daily Goal: 6.0 Focused Hours
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoriesList.map((item) => {
            const Icon = item.icon;
            const categoryTasks = tasks.filter((t) => t.category === item.cat);
            const done = categoryTasks.filter((t) => t.is_completed).length;
            const total = categoryTasks.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Link
                key={item.cat}
                to={item.route}
                className="group p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${item.bgColor} ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                </div>

                <div className="mt-3">
                  <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {total > 0 ? `${done}/${total} tasks done` : 'Routine active'}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <span>Target</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        pct === 100 ? 'bg-emerald-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SECTION C & D: Daily Check-in & Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Daily Check-in (Tasks & Notes) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Daily Check-in & Action List
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-mono font-bold">
                    {completionPercentage}% Done
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {completedTasks.length} of {tasks.length} tasks completed today • {totalFocusedMinutes} mins focused
                </p>
              </div>

              <button
                onClick={() => setShowAddTaskModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Task
              </button>
            </div>

            {/* Tasks List */}
            <div className="divide-y divide-slate-100 dark:divide-dark-border/40 mt-2 max-h-[380px] overflow-y-auto">
              {tasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No tasks recorded for today yet. Click "Add Task" to schedule your routine.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`py-3 px-2 flex items-start justify-between gap-3 rounded-lg transition-colors ${
                      task.is_completed ? 'opacity-70 bg-slate-50/50 dark:bg-slate-900/30' : 'hover:bg-slate-50 dark:hover:bg-dark-secondary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTask(task)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-500 focus:outline-none transition-colors"
                      >
                        {task.is_completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5 hover:border-emerald-500" />
                        )}
                      </button>

                      <div>
                        <div
                          className={`text-xs font-bold text-slate-800 dark:text-slate-200 ${
                            task.is_completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                          }`}
                        >
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {task.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                          <span className="uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            {task.category}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {task.duration_minutes}m
                          </span>
                          {task.time_block && (
                            <>
                              <span>•</span>
                              <span>{task.time_block}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          task.priority === 'urgent'
                            ? 'bg-rose-500/10 text-rose-500'
                            : task.priority === 'high'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Daily Notes / Quick Logger */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-dark-border/60">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
                Daily Focus Notes & Reflections
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dailyNotes}
                  onChange={(e) => setDailyNotes(e.target.value)}
                  placeholder="Record today's breakthroughs, blockers or ideas..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-dark-secondary hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Performance Graph & Upcoming Activities */}
        <div className="lg:col-span-5 space-y-4">
          {/* Performance Graph Card */}
          <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Weekly Focused Hours
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target: 6.0 hrs/day • Actual database activity
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-primary font-mono">
                  {(totalFocusedMinutes / 60).toFixed(1)}h
                </span>
                <div className="text-[10px] text-slate-400">Today Focused</div>
              </div>
            </div>

            <div className="h-44 w-full mt-3">
              {chartData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-400">
                  <Clock className="w-6 h-6 text-slate-500/40 mb-1.5" />
                  <span>No focus logs recorded yet this week.</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Complete tasks or practice sessions to plot progress.</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3987FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3987FF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} domain={[0, 8]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#151F35',
                        borderColor: '#1E2D4A',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#F8FAFC',
                      }}
                      formatter={(val: any) => [`${val} hrs`, 'Focused Time']}
                    />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#3987FF"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#focusGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* SECTION E: Upcoming Activities & Examinations */}
          <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                Upcoming Examinations & Deadlines
              </h3>
              <Link to="/academics" className="text-xs text-primary font-bold hover:underline">
                Manage
              </Link>
            </div>

            <div className="mt-3 space-y-2.5">
              {upcomingExams.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  No upcoming examinations recorded yet.
                </div>
              ) : (
                upcomingExams.map((exam) => {
                  const subject = subjects.find((s) => s.id === exam.subject_id);
                  const daysLeft = getDaysUntil(exam.exam_date);
                  return (
                    <div
                      key={exam.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-dark-secondary/60 border border-slate-200/60 dark:border-dark-border/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            exam.exam_type === 'PUT'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : exam.exam_type === 'Practical'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          }`}
                        >
                          {exam.exam_type}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {subject?.name || 'Subject Exam'}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                            <Calendar className="w-3 h-3" />
                            {formatDate(exam.exam_date, 'dd MMM yyyy')} {exam.time_slot && `• ${exam.time_slot}`}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-primary font-mono">
                          {daysLeft >= 0 ? `${daysLeft}d left` : 'Completed'}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {exam.syllabus_coverage_percent}% syllabus
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 dark:border-dark-border p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Today's Action Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Solve 2 DP problems on LeetCode..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 dark:bg-dark-secondary border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 dark:bg-dark-secondary border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="dsa">DSA</option>
                    <option value="academics">Academics</option>
                    <option value="web">Web Designing</option>
                    <option value="editing">Video Editing</option>
                    <option value="english">English</option>
                    <option value="gym">Gym</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 dark:bg-dark-secondary border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

