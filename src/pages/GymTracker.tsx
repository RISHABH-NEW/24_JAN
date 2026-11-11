// LEVEL UP 73 - Gym & Fitness Tracker Module
import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Flame,
  TrendingUp,
  Scale,
  Calendar,
  CheckCircle2,
  Trophy,
  Activity,
  Trash2,
  Sparkles,
  BedDouble,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { storage } from '../services/storageEngine';
import { GymWorkout, BodyMetric, WorkoutExercise, ExerciseSet } from '../types';
import { formatDate } from '../utils/dateUtils';
import { triggerConfetti } from '../components/common/Confetti';

export const GymTracker: React.FC = () => {
  const [workouts, setWorkouts] = useState<GymWorkout[]>([]);
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetric[]>([]);

  // Modals
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showLogWeight, setShowLogWeight] = useState(false);

  // Workout form
  const [workoutName, setWorkoutName] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isRestDay, setIsRestDay] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [exercisesList, setExercisesList] = useState<WorkoutExercise[]>([]);

  // Weight form
  const [currentWeight, setCurrentWeight] = useState<number | ''>('');
  const [weightNotes, setWeightNotes] = useState('');

  useEffect(() => {
    const refresh = () => {
      setWorkouts(storage.getGymWorkouts());
      setBodyMetrics(storage.getBodyMetrics());
    };
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  // PRs calculation
  const personalRecords: { exercise: string; weight: number; reps: number; date: string }[] = [];
  workouts.forEach((w) => {
    if (w.exercises) {
      w.exercises.forEach((ex) => {
        ex.sets?.forEach((s) => {
          if (s.isPersonalRecord) {
            personalRecords.push({
              exercise: ex.exerciseName,
              weight: s.weightKg,
              reps: s.reps,
              date: w.workout_date,
            });
          }
        });
      });
    }
  });

  // Chart data
  const weightChartData = bodyMetrics.map((m) => ({
    date: formatDate(m.recorded_date, 'dd MMM'),
    weight: m.weight_kg,
  }));

  const handleAddExerciseRow = () => {
    setExercisesList([
      ...exercisesList,
      {
        exerciseName: '',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 0 },
        ],
      },
    ]);
  };

  const handleCreateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const finalWorkoutName = isRestDay ? 'Rest & Muscle Recovery' : (workoutName.trim() || 'General Workout');
    storage.addGymWorkout({
      workout_date: new Date().toISOString().split('T')[0],
      workout_name: finalWorkoutName,
      is_rest_day: isRestDay,
      duration_minutes: isRestDay ? 0 : Number(durationMinutes),
      notes: workoutNotes.trim() || undefined,
      exercises: isRestDay ? [] : exercisesList.filter((ex) => ex.exerciseName.trim().length > 0),
    });

    triggerConfetti();
    setShowAddWorkout(false);
    setWorkoutNotes('');
    setWorkoutName('');
    setExercisesList([]);
  };

  const handleRecordWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWeight || Number(currentWeight) <= 0) return;
    storage.addBodyMetric({
      recorded_date: new Date().toISOString().split('T')[0],
      weight_kg: Number(currentWeight),
      notes: weightNotes.trim() || undefined,
    });

    setShowLogWeight(false);
    setCurrentWeight('');
    setWeightNotes('');
  };

  const handleDeleteWorkout = (id: string) => {
    if (confirm('Delete workout record?')) {
      storage.deleteGymWorkout(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 font-mono">
            <Dumbbell className="w-4 h-4" />
            Hypertrophy & Physical Conditioning
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Gym & Fitness Performance Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track daily compound lifts, hypertrophy sets, personal records, and body weight progression.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogWeight(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Scale className="w-4 h-4 text-primary" />
            Log Weight
          </button>
          <button
            onClick={() => setShowAddWorkout(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-glow-primary transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Log Workout (+20 XP)
          </button>
        </div>
      </div>

      {/* Target Progress & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Workouts</div>
          <div className="text-2xl font-black text-amber-500 font-mono mt-1">
            {workouts.filter((w) => !w.is_rest_day).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">High consistency</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Latest Weight</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {bodyMetrics.length > 0 ? (
              <>
                {bodyMetrics[bodyMetrics.length - 1].weight_kg}{' '}
                <span className="text-xs text-slate-400">kg</span>
              </>
            ) : (
              <span className="text-slate-400 font-normal text-xl">--</span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {bodyMetrics.length > 0 ? 'Logged weight' : 'No weigh-ins yet'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Personal Records</div>
          <div className="text-2xl font-black text-primary font-mono mt-1">
            {personalRecords.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Milestones unlocked</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Rest Days Taken</div>
          <div className="text-2xl font-black text-secondary font-mono mt-1">
            {workouts.filter((w) => w.is_rest_day).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active muscle recovery</div>
        </div>
      </div>

      {/* Body Weight Progression Chart */}
      <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Body Weight Tracking Timeline (kg)
            </h3>
            <p className="text-[11px] text-slate-400">
              Clean caloric intake and progressive overload monitoring
            </p>
          </div>

          <button
            onClick={() => setShowLogWeight(true)}
            className="text-xs font-bold text-primary hover:underline"
          >
            + Update Weight
          </button>
        </div>

        <div className="h-48 w-full mt-3">
          {weightChartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No weight logs recorded yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151F35',
                    borderColor: '#1E2D4A',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`${val} kg`, 'Body Weight']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#3987FF"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3987FF' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Workout History Log */}
      <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            Logged Workout Sessions ({workouts.length})
          </h3>
        </div>

        <div className="space-y-4">
          {workouts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No workouts logged yet.
            </div>
          ) : (
            workouts.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-dark-secondary/50 border border-slate-200/60 dark:border-dark-border/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {w.is_rest_day ? (
                      <span className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
                        <BedDouble className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                        <Dumbbell className="w-4 h-4" />
                      </span>
                    )}

                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {w.workout_name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatDate(w.workout_date, 'EEEE, dd MMM yyyy')} {!w.is_rest_day && `• ${w.duration_minutes} mins`}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteWorkout(w.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {w.notes && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                    "{w.notes}"
                  </div>
                )}

                {/* Exercises Table */}
                {!w.is_rest_day && w.exercises && w.exercises.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-200/40 dark:border-dark-border/40">
                    {w.exercises.map((ex, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {ex.exerciseName}
                        </span>
                        <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                          {ex.sets?.map((s) => (
                            <span
                              key={s.setNumber}
                              className={`px-2 py-0.5 rounded ${
                                s.isPersonalRecord
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {s.weightKg}kg × {s.reps}
                              {s.isPersonalRecord && ' ★ PR'}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log Workout Modal */}
      {showAddWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-amber-400" />
              Log Workout Session
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Awards <span className="text-primary font-bold">+20 XP</span>.
            </p>

            <form onSubmit={handleCreateWorkout} className="space-y-3.5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <input
                  type="checkbox"
                  id="restCheck"
                  checked={isRestDay}
                  onChange={(e) => setIsRestDay(e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
                <label htmlFor="restCheck" className="text-xs font-bold text-slate-200 cursor-pointer">
                  Mark as Rest & Recovery Day
                </label>
              </div>

              {!isRestDay && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Workout Split / Name</label>
                      <input
                        type="text"
                        required={!isRestDay}
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                        placeholder="e.g. Push Day (Chest & Triceps)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Duration (Minutes)</label>
                      <input
                        type="number"
                        min="15"
                        max="180"
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Exercises list editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-slate-400">Exercises & Sets</label>
                      <button
                        type="button"
                        onClick={handleAddExerciseRow}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        + Add Exercise
                      </button>
                    </div>

                    {exercisesList.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-800/40 border border-dashed border-slate-700 text-center text-xs text-slate-400">
                        No exercises added yet. Click "+ Add Exercise" above to log exercises, sets, and weights.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {exercisesList.map((ex, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                            <input
                              type="text"
                              placeholder="Exercise Name (e.g. Barbell Bench Press)"
                              value={ex.exerciseName}
                              onChange={(e) => {
                                const updated = [...exercisesList];
                                updated[idx].exerciseName = e.target.value;
                                setExercisesList(updated);
                              }}
                              className="w-full px-2 py-1 rounded bg-slate-700 text-xs text-white font-bold placeholder-slate-400"
                            />
                            <div className="flex items-center gap-2 text-[11px] text-slate-300">
                              <span>Set 1:</span>
                              <input
                                type="number"
                                placeholder="kg"
                                value={ex.sets[0]?.weightKg || ''}
                                onChange={(e) => {
                                  const updated = [...exercisesList];
                                  if (updated[idx].sets[0]) {
                                    updated[idx].sets[0].weightKg = Number(e.target.value);
                                    setExercisesList(updated);
                                  }
                                }}
                                className="w-16 px-1.5 py-0.5 rounded bg-slate-700 text-white font-mono text-center text-xs"
                              />
                              <span>kg ×</span>
                              <input
                                type="number"
                                placeholder="reps"
                                value={ex.sets[0]?.reps || ''}
                                onChange={(e) => {
                                  const updated = [...exercisesList];
                                  if (updated[idx].sets[0]) {
                                    updated[idx].sets[0].reps = Number(e.target.value);
                                    setExercisesList(updated);
                                  }
                                }}
                                className="w-16 px-1.5 py-0.5 rounded bg-slate-700 text-white font-mono text-center text-xs"
                              />
                              <span>reps</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="text-xs text-slate-400 block mb-1">Workout Notes & Energy</label>
                <input
                  type="text"
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="e.g. Felt great on bench press, good shoulder stability..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddWorkout(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Body Weight Modal */}
      {showLogWeight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Record Body Weight
            </h3>
            <form onSubmit={handleRecordWeight} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={currentWeight}
                  placeholder="e.g. 72.0"
                  onChange={(e) => setCurrentWeight(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-mono text-base font-bold placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={weightNotes}
                  onChange={(e) => setWeightNotes(e.target.value)}
                  placeholder="e.g. Weighed fasting in the morning"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogWeight(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Save Weight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

