// LEVEL UP 73 - Core TypeScript Data Models

export type ExamMode = 'normal' | 'put' | 'practical' | 'end_sem';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskCategory = 'academics' | 'dsa' | 'editing' | 'english' | 'gym' | 'web' | 'other';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  current_xp: number;
  current_level: number;
  streak_count: number;
  best_streak: number;
  last_active_date?: string;
  exam_mode: ExamMode;
  challenge_start_date: string; // '2026-11-11'
  challenge_end_date: string;   // '2027-01-23'
  created_at: string;
  updated_at: string;
}

export interface ScheduleSlot {
  id: string;
  timeRange: string;
  activity: string;
  category: TaskCategory;
  defaultDescription: string;
  examModeAdjustments?: Partial<Record<ExamMode, string>>;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'dark' | 'light';
  notification_enabled: boolean;
  daily_review_time: string;
  target_dsa_problems: number;
  target_editing_projects: number;
  target_web_projects: number;
  daily_schedule: ScheduleSlot[];
  created_at: string;
  updated_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  academics_minutes: number;
  dsa_minutes: number;
  editing_minutes: number;
  english_minutes: number;
  gym_minutes: number;
  web_minutes: number;
  total_focused_minutes: number;
  notes?: string;
  review_completed: boolean;
  review_data?: {
    achievements: string[];
    missed: string[];
    tomorrow_plan: string[];
    mood?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  user_id: string;
  task_date: string;
  category: TaskCategory;
  title: string;
  description?: string;
  time_block?: string;
  duration_minutes: number;
  is_completed: boolean;
  completed_at?: string;
  priority: Priority;
  xp_awarded: boolean;
  created_at: string;
}

// ----------------- ACADEMICS -----------------
export type ExamType = 'PUT' | 'Practical' | 'End-Sem';

export interface AcademicSubject {
  id: string;
  user_id: string;
  code?: string;
  name: string;
  professor?: string;
  credits: number;
  color: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  target_score?: number;
  created_at: string;
}

export interface Exam {
  id: string;
  user_id: string;
  subject_id: string;
  exam_type: ExamType;
  exam_date: string;
  time_slot?: string;
  syllabus_coverage_percent: number;
  marks_obtained?: number;
  max_marks: number;
  notes?: string;
  status: 'upcoming' | 'completed' | 'graded';
  created_at: string;
}

export interface SyllabusTopic {
  id: string;
  subject_id: string;
  user_id: string;
  unit_name?: string;
  title: string;
  is_completed: boolean;
  importance: 'low' | 'medium' | 'high' | 'critical';
  revision_count: number;
  last_revised?: string;
  resource_url?: string;
  notes?: string;
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject_id?: string;
  topic_id?: string;
  session_date: string;
  duration_minutes: number;
  notes?: string;
  xp_awarded: boolean;
  created_at: string;
}

// ----------------- DSA -----------------
export const DSA_TOPICS = [
  'Time and Space Complexity',
  'Arrays',
  'Strings',
  'Searching',
  'Sorting',
  'Recursion',
  'Linked Lists',
  'Stacks',
  'Queues',
  'Hashing',
  'Trees',
  'Graphs',
  'Dynamic Programming',
] as const;

export type DSATopic = typeof DSA_TOPICS[number];
export type DSADifficulty = 'Easy' | 'Medium' | 'Hard';
export type DSAPlatform = 'LeetCode' | 'GeeksforGeeks' | 'CodeChef' | 'Codeforces' | 'HackerRank' | 'Other';
export type DSARevisionStatus = 'mastered' | 'revising' | 'needs_revision';

export interface DSAProblem {
  id: string;
  user_id: string;
  problem_name: string;
  platform: DSAPlatform;
  topic: DSATopic;
  difficulty: DSADifficulty;
  problem_url?: string;
  solution_notes?: string;
  time_complexity?: string;
  space_complexity?: string;
  date_solved: string;
  revision_status: DSARevisionStatus;
  next_revision_date?: string;
  xp_awarded: boolean;
  created_at: string;
  updated_at: string;
}

// ----------------- VIDEO EDITING -----------------
export const EDITING_ROADMAP_TOPICS = [
  'Basic cuts',
  'Transitions',
  'Audio synchronization',
  'Text animation',
  'Keyframes',
  'Speed ramping',
  'Effects',
  'Color correction',
  'Sound design',
  'Storytelling',
] as const;

export interface EditingProject {
  id: string;
  user_id: string;
  project_name: string;
  project_type: string;
  software_used: string;
  techniques_learned: string[];
  time_spent_minutes: number;
  completion_status: 'planned' | 'in_progress' | 'completed';
  portfolio_link?: string;
  thumbnail_url?: string;
  notes?: string;
  completion_date?: string;
  xp_awarded: boolean;
  created_at: string;
  updated_at: string;
}

// ----------------- ENGLISH -----------------
export type EnglishPracticeType =
  | 'Speaking Challenge'
  | 'Vocabulary'
  | 'Grammar'
  | 'Pronunciation'
  | 'Listening'
  | 'Daily Journal';

export interface EnglishSession {
  id: string;
  user_id: string;
  session_date: string;
  practice_type: EnglishPracticeType;
  speaking_minutes: number;
  topic?: string;
  recording_url?: string;
  journal_entry?: string;
  notes?: string;
  confidence_score: number; // 1 to 10
  xp_awarded: boolean;
  created_at: string;
}

export interface VocabularyWord {
  id: string;
  user_id: string;
  word: string;
  part_of_speech?: string;
  definition: string;
  example_sentence?: string;
  pronunciation?: string;
  learned_date: string;
  mastery_level: number; // 1 to 5
  created_at: string;
}

// ----------------- GYM -----------------
export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  isPersonalRecord?: boolean;
}

export interface WorkoutExercise {
  exerciseName: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface GymWorkout {
  id: string;
  user_id: string;
  workout_date: string;
  workout_name: string;
  is_rest_day: boolean;
  duration_minutes: number;
  notes?: string;
  exercises: WorkoutExercise[];
  xp_awarded: boolean;
  created_at: string;
}

export interface BodyMetric {
  id: string;
  user_id: string;
  recorded_date: string;
  weight_kg: number;
  notes?: string;
  created_at: string;
}

// ----------------- WEB DESIGNING -----------------
export const WEB_ROADMAP_TOPICS = [
  'HTML',
  'CSS',
  'Flexbox',
  'CSS Grid',
  'Responsive design',
  'JavaScript',
  'DOM',
  'Events',
  'React fundamentals',
  'UI/UX',
  'Deployment',
] as const;

export interface WebProject {
  id: string;
  user_id: string;
  milestone_number: 1 | 2 | 3;
  title: string;
  description?: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  screenshot_url?: string;
  status: 'planned' | 'in_progress' | 'completed';
  completed_date?: string;
  xp_awarded: boolean;
  created_at: string;
}

export interface WebTopic {
  id: string;
  user_id: string;
  topic_name: string;
  category: string;
  is_completed: boolean;
  notes?: string;
  completed_date?: string;
  created_at: string;
}

// ----------------- GAMIFICATION -----------------
export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xp_reward: number;
  unlocked_at?: string;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  amount: number;
  activity_type: string;
  activity_id?: string;
  description: string;
  created_at: string;
}

