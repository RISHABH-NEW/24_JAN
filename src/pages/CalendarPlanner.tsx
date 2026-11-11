// LEVEL UP 73 - Calendar & Daily Planner Module
import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  ShieldAlert,
  ArrowRight,
  Edit2,
  Trash2,
  Sparkles,
  Flame,
} from 'lucide-react';
import { storage } from '../services/storageEngine';
import { useAuth } from '../context/AuthContext';
import { getChallengeStats, formatDate } from '../utils/dateUtils';
import { DailyTask, ExamMode, ScheduleSlot, TaskCategory } from '../types';
import { EXAM_MODES_CONFIG } from '../data/defaultSchedule';
import { triggerConfetti } from '../components/common/Confetti';

export const CalendarPlanner: React.FC = () => {
  const { user, updateUser } = useAuth();
  const stats = getChallengeStats();
  const [selectedDate, setSelectedDate] = useState(stats.todayDateISO);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'routine'>('daily');

  // Modals
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('dsa');
  const [newTaskDuration, setNewTaskDuration] = useState(60);
  const [newTaskTimeBlock, setNewTaskTimeBlock] = useState('05:30 PM - 06:45 PM');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');

  // Schedule slot editing
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);
  const [slotTimeRange, setSlotTimeRange] = useState('');
  const [slotActivity, setSlotActivity] = useState('');
  const [slotDesc, setSlotDesc] = useState('');

  useEffect(() => {
    const refresh = () => {
      setTasks(storage.getDailyTasks(selectedDate));
      const settings = storage.getSettings();
      setScheduleSlots(settings.daily_schedule || []);
    };
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, [selectedDate]);

  const currentExamMode = user?.exam_mode || 'normal';
  const currentExamConfig = EXAM_MODES_CONFIG[currentExamMode];

  const handleToggleTask = (task: DailyTask) => {
    const updated = storage.updateTask(task.id, { is_completed: !task.is_completed });
    if (updated?.is_completed) {
      triggerConfetti();
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    storage.addTask({
      task_date: selectedDate,
      category: newTaskCategory,
      title: newTaskTitle.trim(),
      time_block: newTaskTimeBlock.trim() || undefined,
      duration_minutes: Number(newTaskDuration),
      is_completed: false,
      priority: newTaskPriority,
    });

    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const handleDeleteTask = (id: string) => {
    storage.deleteTask(id);
  };

  const handleSelectExamMode = (mode: ExamMode) => {
    storage.setExamMode(mode);
    updateUser({ exam_mode: mode });
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;

    const updated = scheduleSlots.map((s) =>
      s.id === editingSlot.id
        ? {
            ...s,
            timeRange: slotTimeRange.trim(),
            activity: slotActivity.trim(),
            defaultDescription: slotDesc.trim(),
          }
        : s
    );

    setScheduleSlots(updated);
    storage.updateSettings({ daily_schedule: updated });
    setEditingSlot(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Exam Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary font-mono">
            <CalendarIcon className="w-4 h-4" />
            Adaptive Calendar & Routine Planner
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Daily Routine & Exam Adaptive Planner
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Default routine (7 AM–11 PM) dynamically recalibrates when internal PUT, Lab Practical, or End-Sem exam modes are activated.
          </p>
        </div>

        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-glow-primary transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Schedule Task
        </button>
      </div>

      {/* EXAM MODE CONTROL PANEL */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-dark-card to-slate-900 border border-dark-border shadow-xl text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Exam Mode Protocol Active: <span className="text-primary font-mono">{currentExamConfig.name}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentExamConfig.description}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            {(['normal', 'put', 'practical', 'end_sem'] as ExamMode[]).map((mode) => {
              const conf = EXAM_MODES_CONFIG[mode];
              const isSelected = currentExamMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => handleSelectExamMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {conf.name.replace(' Mode', '')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Priority Weights Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {Object.entries(currentExamConfig.priorityWeights).map(([skill, weight]) => (
            <div key={skill} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">{skill}</div>
              <div className="text-xs font-bold text-white mt-0.5 truncate">{weight}</div>
            </div>
          ))}
        </div>
      </div>

      {/* View Switcher: Daily Tasks vs Full Master Routine */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-dark-border pb-2">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'daily'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Daily Scheduled Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab('routine')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'routine'
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Master Routine & Mode Adaptations
        </button>
      </div>

      {/* TAB 1: DAILY SCHEDULED TASKS */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-primary font-mono"
              />
              <span className="text-xs text-slate-400">
                {selectedDate === stats.todayDateISO ? '(Today)' : ''}
              </span>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              {tasks.filter((t) => t.is_completed).length} of {tasks.length} completed
            </span>
          </div>

          <div className="space-y-2.5">
            {tasks.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-center text-xs text-slate-400">
                No tasks scheduled for this date. Click "Schedule Task" above or generate from routine.
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                    task.is_completed
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400'
                      : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border shadow-sm hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTask(task)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-500 focus:outline-none"
                    >
                      {task.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase">
                          {task.category}
                        </span>
                        {task.time_block && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.time_block}
                          </span>
                        )}
                      </div>

                      <div
                        className={`text-sm font-bold mt-1 ${
                          task.is_completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </div>

                      {task.description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                        task.priority === 'urgent'
                          ? 'bg-rose-500/10 text-rose-500'
                          : task.priority === 'high'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-slate-500/10 text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MASTER ROUTINE & MODE ADAPTATIONS */}
      {activeTab === 'routine' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-dark-secondary/60 border border-slate-200 dark:border-dark-border text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Active Planner View:</span> Showing recommendations for <span className="font-bold text-primary">{currentExamConfig.name}</span>. Click "Edit Block" to customize timings.
            </div>
          </div>

          <div className="space-y-3">
            {scheduleSlots.map((slot) => {
              const activeAdjustment = slot.examModeAdjustments?.[currentExamMode] || slot.defaultDescription;

              return (
                <div
                  key={slot.id}
                  className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="min-w-[170px]">
                      <div className="text-xs font-mono font-bold text-primary flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {slot.timeRange}
                      </div>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold mt-1 inline-block">
                        {slot.category}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {slot.activity}
                      </div>

                      {/* Display mode adjustment if in exam mode */}
                      {currentExamMode !== 'normal' && (
                        <div className="mt-1 p-2 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-blue-300 flex items-center gap-1.5">
                          <span className="font-bold text-primary font-mono uppercase text-[10px]">
                            {currentExamConfig.name} Focus:
                          </span>
                          {activeAdjustment}
                        </div>
                      )}

                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Base: {slot.defaultDescription}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => {
                        setEditingSlot(slot);
                        setSlotTimeRange(slot.timeRange);
                        setSlotActivity(slot.activity);
                        setSlotDesc(slot.defaultDescription);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-dark-secondary hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Block
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Schedule New Action Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Solve 2 Hard DP problems..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
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
                  <label className="text-xs text-slate-400 block mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Time Block</label>
                  <input
                    type="text"
                    value={newTaskTimeBlock}
                    onChange={(e) => setNewTaskTimeBlock(e.target.value)}
                    placeholder="05:30 PM - 06:45 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Edit Routine Block</h3>
            <form onSubmit={handleSaveSlot} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Time Range</label>
                <input
                  type="text"
                  required
                  value={slotTimeRange}
                  onChange={(e) => setSlotTimeRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Activity Name</label>
                <input
                  type="text"
                  required
                  value={slotActivity}
                  onChange={(e) => setSlotActivity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={slotDesc}
                  onChange={(e) => setSlotDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

