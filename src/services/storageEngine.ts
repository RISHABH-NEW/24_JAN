// LEVEL UP 73 - Unified Storage & Database Engine
// Clean zero-mock data architecture with persistent reactive state and Supabase integration

import {
  AcademicSubject,
  Achievement,
  BodyMetric,
  DailyLog,
  DailyTask,
  DSAProblem,
  EditingProject,
  EnglishSession,
  Exam,
  GymWorkout,
  StudySession,
  SyllabusTopic,
  UserProfile,
  UserSettings,
  VocabularyWord,
  WebProject,
  WebTopic,
  XPTransaction,
  ExamMode,
} from '../types';
import { DEFAULT_SCHEDULE } from '../data/defaultSchedule';
import { calculateLevel, XP_VALUES } from '../utils/xpSystem';

const STORAGE_KEY = 'LEVEL_UP_73_APP_STATE_V2_CLEAN';

export interface AppState {
  profile: UserProfile;
  settings: UserSettings;
  dailyLogs: DailyLog[];
  dailyTasks: DailyTask[];
  subjects: AcademicSubject[];
  exams: Exam[];
  syllabusTopics: SyllabusTopic[];
  studySessions: StudySession[];
  dsaProblems: DSAProblem[];
  editingProjects: EditingProject[];
  englishSessions: EnglishSession[];
  vocabulary: VocabularyWord[];
  gymWorkouts: GymWorkout[];
  bodyMetrics: BodyMetric[];
  webProjects: WebProject[];
  webTopics: WebTopic[];
  achievements: Achievement[];
  xpTransactions: XPTransaction[];
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-rishabh',
  email: '',
  full_name: 'Rishabh',
  avatar_url: '',
  current_xp: 0,
  current_level: 1,
  streak_count: 0,
  best_streak: 0,
  exam_mode: 'normal',
  challenge_start_date: '2026-11-11',
  challenge_end_date: '2027-01-23',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEFAULT_SETTINGS: UserSettings = {
  id: 'set-default',
  user_id: 'usr-rishabh',
  theme: 'dark',
  notification_enabled: true,
  daily_review_time: '21:00',
  target_dsa_problems: 100,
  target_editing_projects: 8,
  target_web_projects: 3,
  daily_schedule: DEFAULT_SCHEDULE,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// 11 Core Web Roadmap Topics (Syllabus structure with 0% completion)
const ROADMAP_WEB_TOPICS: WebTopic[] = [
  { id: 'wt-1', user_id: 'usr-rishabh', topic_name: 'HTML5 Semantic Structure & Accessibility (a11y)', category: 'HTML', is_completed: false, created_at: new Date().toISOString() },
  { id: 'wt-2', user_id: 'usr-rishabh', topic_name: 'CSS Box Model & Specificity', category: 'CSS', is_completed: false, created_at: new Date().toISOString() },
  { id: 'wt-3', user_id: 'usr-rishabh', topic_name: 'Flexbox Architecture & Alignment', category: 'Flexbox', is_completed: false, created_at: new Date().toISOString() },
  { id: 'wt-4', user_id: 'usr-rishabh', topic_name: 'CSS Grid Complex Layouts', category: 'CSS Grid', is_completed: false, created_at: new Date().toISOString() },
  { id: 'wt-5', user_id: 'usr-rishabh', topic_name: 'Responsive Design & Mobile-First Breakpoints', category: 'Responsive design', is_completed: false, created_at: new Date().toISOString() },
  { id: 'wt-6', user_id: 'usr-rishabh', topic_name: 'Modern JavaScript (ES6+, Closures, Async/Await)', category: 'JavaScript', is_completed: false, created_at: new Date().toISOString() },
  { id: 'wt-7', user_id: 'usr-rishabh', topic_name: 'DOM Manipulation & Event Bubbling', category: 'DOM', is_completed: false, created_at: new Date().toISOString() },
  { id: 'wt-8', user_id: 'usr-rishabh', topic_name: 'Browser Events & Custom Event Handlers', category: 'Events', is_completed: false, created_at: new Date().toISOString() },
  { id: 'wt-9', user_id: 'usr-rishabh', topic_name: 'React Fundamentals: Hooks, Props & State', category: 'React fundamentals', is_completed: false, created_at: new Date().toISOString() },
  { id: 'wt-10', user_id: 'usr-rishabh', topic_name: 'UI/UX Design Systems, Contrast & Hierarchy', category: 'UI/UX', is_completed: false, created_at: new Date().toISOString() },
  { id: 'wt-11', user_id: 'usr-rishabh', topic_name: 'CI/CD & Cloud Deployment (Vercel, Netlify, Supabase)', category: 'Deployment', is_completed: false, created_at: new Date().toISOString() },
];

// 3 Core Web Milestones (Planned, 0% completed)
const ROADMAP_WEB_PROJECTS: WebProject[] = [
  {
    id: 'web-1',
    user_id: 'usr-rishabh',
    milestone_number: 1,
    title: 'Milestone 1: Personal Developer Portfolio & Lab',
    description: 'High-performance interactive developer portfolio showcasing projects, interactive terminal, and skill matrix.',
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS'],
    status: 'planned',
    xp_awarded: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'web-2',
    user_id: 'usr-rishabh',
    milestone_number: 2,
    title: 'Milestone 2: SaaS Modern Landing Page & Conversion Flow',
    description: 'Ultra-polished SaaS marketing website featuring dark-mode glassmorphic components and interactive previews.',
    tech_stack: ['React', 'Tailwind CSS', 'TypeScript'],
    status: 'planned',
    xp_awarded: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'web-3',
    user_id: 'usr-rishabh',
    milestone_number: 3,
    title: 'Milestone 3: Full-Stack Web Application with Database',
    description: 'Fully functional multi-page web application with authentication, database persistence, state analytics, and gamification.',
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    status: 'planned',
    xp_awarded: false,
    created_at: new Date().toISOString(),
  },
];

// Achievement Badge Catalog (All locked with 0 unlocked_at)
const BADGES_CATALOG: Achievement[] = [
  { id: 'ach-1', code: 'FIRST_PROBLEM', title: 'First Byte', description: 'Solve your first DSA problem', icon: 'Code2', category: 'dsa', xp_reward: 50 },
  { id: 'ach-2', code: 'DSA_STREAK_10', title: 'Algorithm Novice', description: 'Solve 10 DSA problems', icon: 'Cpu', category: 'dsa', xp_reward: 100 },
  { id: 'ach-3', code: 'DSA_HALF_CENTURY', title: 'Problem Crusher', description: 'Solve 50 DSA problems', icon: 'Zap', category: 'dsa', xp_reward: 250 },
  { id: 'ach-4', code: 'DSA_CENTURY', title: 'Algorithm Master', description: 'Achieve 100 solved DSA problems target', icon: 'Crown', category: 'dsa', xp_reward: 500 },
  { id: 'ach-5', code: 'FIRST_EDIT', title: 'Action!', description: 'Log your first completed video editing project', icon: 'Film', category: 'editing', xp_reward: 50 },
  { id: 'ach-6', code: 'EDIT_DIRECTOR', title: 'Cinematic Vision', description: 'Complete all 8 video editing projects', icon: 'Award', category: 'editing', xp_reward: 500 },
  { id: 'ach-7', code: 'FIRST_SPEAK', title: 'Voice Unleashed', description: 'Complete your first English speaking session', icon: 'Mic', category: 'english', xp_reward: 50 },
  { id: 'ach-8', code: 'VOCAB_EXPLORER', title: 'Lexicon Builder', description: 'Add 25 words to your vocabulary', icon: 'BookOpen', category: 'english', xp_reward: 100 },
  { id: 'ach-9', code: 'FIRST_LIFT', title: 'Iron Initiate', description: 'Log your first workout in the gym', icon: 'Dumbbell', category: 'gym', xp_reward: 50 },
  { id: 'ach-10', code: 'GYM_WARRIOR', title: 'Iron Discipline', description: 'Log 20 workout sessions', icon: 'Trophy', category: 'gym', xp_reward: 200 },
  { id: 'ach-11', code: 'FIRST_SITE', title: 'Hello World', description: 'Complete Milestone 1: Personal Portfolio', icon: 'Globe', category: 'web', xp_reward: 100 },
  { id: 'ach-12', code: 'WEB_TRILOGY', title: 'Full Stack Prodigy', description: 'Complete all 3 web development project milestones', icon: 'Sparkles', category: 'web', xp_reward: 500 },
  { id: 'ach-13', code: 'STREAK_7', title: 'Weekly Dominance', description: 'Maintain a 7-day productivity streak', icon: 'Flame', category: 'streak', xp_reward: 150 },
  { id: 'ach-14', code: 'EXAM_READY', title: 'Scholar Supreme', description: 'Achieve 90%+ syllabus completion in any subject', icon: 'GraduationCap', category: 'academics', xp_reward: 200 },
];

class StorageEngine {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          profile: parsed.profile || DEFAULT_PROFILE,
          settings: parsed.settings || DEFAULT_SETTINGS,
          dailyLogs: parsed.dailyLogs || [],
          dailyTasks: parsed.dailyTasks || [],
          subjects: parsed.subjects || [],
          exams: parsed.exams || [],
          syllabusTopics: parsed.syllabusTopics || [],
          studySessions: parsed.studySessions || [],
          dsaProblems: parsed.dsaProblems || [],
          editingProjects: parsed.editingProjects || [],
          englishSessions: parsed.englishSessions || [],
          vocabulary: parsed.vocabulary || [],
          gymWorkouts: parsed.gymWorkouts || [],
          bodyMetrics: parsed.bodyMetrics || [],
          webProjects: parsed.webProjects || ROADMAP_WEB_PROJECTS,
          webTopics: parsed.webTopics || ROADMAP_WEB_TOPICS,
          achievements: parsed.achievements || BADGES_CATALOG,
          xpTransactions: parsed.xpTransactions || [],
        };
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }

    // 100% CLEAN EMPTY INITIAL STATE
    return {
      profile: DEFAULT_PROFILE,
      settings: DEFAULT_SETTINGS,
      dailyLogs: [],
      dailyTasks: [],
      subjects: [],
      exams: [],
      syllabusTopics: [],
      studySessions: [],
      dsaProblems: [],
      editingProjects: [],
      englishSessions: [],
      vocabulary: [],
      gymWorkouts: [],
      bodyMetrics: [],
      webProjects: ROADMAP_WEB_PROJECTS,
      webTopics: ROADMAP_WEB_TOPICS,
      achievements: BADGES_CATALOG,
      xpTransactions: [],
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving state to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    }
  }

  public getState(): AppState {
    return this.state;
  }

  // ---------------- XP & PROGRESSION ----------------
  public awardXP(amount: number, activityType: string, activityId: string, description: string): boolean {
    if (activityId) {
      const alreadyAwarded = this.state.xpTransactions.some(
        (t) => t.activity_id === activityId && t.activity_type === activityType
      );
      if (alreadyAwarded) {
        return false;
      }
    }

    const newTx: XPTransaction = {
      id: `xp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: this.state.profile.id,
      amount,
      activity_type: activityType,
      activity_id: activityId,
      description,
      created_at: new Date().toISOString(),
    };

    const newTotalXP = (this.state.profile.current_xp || 0) + amount;
    const levelInfo = calculateLevel(newTotalXP);

    this.state.xpTransactions.unshift(newTx);
    this.state.profile = {
      ...this.state.profile,
      current_xp: newTotalXP,
      current_level: levelInfo.level,
      updated_at: new Date().toISOString(),
    };

    this.persist();
    return true;
  }

  // ---------------- PROFILE & SETTINGS ----------------
  public getProfile(): UserProfile {
    return this.state.profile;
  }

  public updateProfile(updates: Partial<UserProfile>): UserProfile {
    this.state.profile = {
      ...this.state.profile,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.persist();
    return this.state.profile;
  }

  public setExamMode(mode: ExamMode) {
    this.updateProfile({ exam_mode: mode });
  }

  public getSettings(): UserSettings {
    return this.state.settings;
  }

  public updateSettings(updates: Partial<UserSettings>): UserSettings {
    this.state.settings = {
      ...this.state.settings,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.persist();
    return this.state.settings;
  }

  // ---------------- DAILY LOGS & TASKS ----------------
  public getDailyLogs(): DailyLog[] {
    return this.state.dailyLogs;
  }

  public getDailyLog(dateStr: string): DailyLog | undefined {
    return this.state.dailyLogs.find((l) => l.log_date === dateStr);
  }

  public saveDailyLog(log: Omit<DailyLog, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }): DailyLog {
    const existingIndex = this.state.dailyLogs.findIndex((l) => l.log_date === log.log_date);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated: DailyLog = {
        ...this.state.dailyLogs[existingIndex],
        ...log,
        updated_at: now,
      };
      this.state.dailyLogs[existingIndex] = updated;
      this.persist();
      return updated;
    } else {
      const created: DailyLog = {
        ...log,
        id: `log-${Date.now()}`,
        user_id: this.state.profile.id,
        created_at: now,
        updated_at: now,
      };
      this.state.dailyLogs.unshift(created);
      this.persist();
      return created;
    }
  }

  public getDailyTasks(dateStr?: string): DailyTask[] {
    if (!dateStr) return this.state.dailyTasks;
    return this.state.dailyTasks.filter((t) => t.task_date === dateStr);
  }

  public addTask(task: Omit<DailyTask, 'id' | 'user_id' | 'created_at' | 'xp_awarded'>): DailyTask {
    const newTask: DailyTask = {
      ...task,
      id: `tsk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: this.state.profile.id,
      xp_awarded: false,
      created_at: new Date().toISOString(),
    };
    this.state.dailyTasks.push(newTask);
    this.persist();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<DailyTask>): DailyTask | undefined {
    const index = this.state.dailyTasks.findIndex((t) => t.id === id);
    if (index === -1) return undefined;

    const current = this.state.dailyTasks[index];
    const isNowCompleted = updates.is_completed === true && !current.is_completed;
    
    const updated: DailyTask = {
      ...current,
      ...updates,
      completed_at: updates.is_completed ? (updates.completed_at || new Date().toISOString()) : undefined,
    };

    if (isNowCompleted && !current.xp_awarded) {
      let xpAmount = 15;
      if (current.category === 'dsa') xpAmount = XP_VALUES.DSA_SESSION;
      else if (current.category === 'academics') xpAmount = XP_VALUES.ACADEMIC_STUDY;
      else if (current.category === 'web') xpAmount = XP_VALUES.WEB_DEV_SESSION;
      else if (current.category === 'editing') xpAmount = XP_VALUES.EDITING_SESSION;
      else if (current.category === 'gym') xpAmount = XP_VALUES.GYM_WORKOUT;
      else if (current.category === 'english') xpAmount = XP_VALUES.ENGLISH_PRACTICE;

      this.awardXP(xpAmount, current.category, current.id, `Completed task: ${current.title}`);
      updated.xp_awarded = true;
    }

    this.state.dailyTasks[index] = updated;
    this.persist();
    return updated;
  }

  public deleteTask(id: string): boolean {
    const beforeCount = this.state.dailyTasks.length;
    this.state.dailyTasks = this.state.dailyTasks.filter((t) => t.id !== id);
    if (this.state.dailyTasks.length !== beforeCount) {
      this.persist();
      return true;
    }
    return false;
  }

  // ---------------- ACADEMICS ----------------
  public getSubjects(): AcademicSubject[] {
    return this.state.subjects;
  }

  public addSubject(subject: Omit<AcademicSubject, 'id' | 'user_id' | 'created_at'>): AcademicSubject {
    const newSubject: AcademicSubject = {
      ...subject,
      id: `sub-${Date.now()}`,
      user_id: this.state.profile.id,
      created_at: new Date().toISOString(),
    };
    this.state.subjects.push(newSubject);
    this.persist();
    return newSubject;
  }

  public updateSubject(id: string, updates: Partial<AcademicSubject>): AcademicSubject | undefined {
    const idx = this.state.subjects.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    this.state.subjects[idx] = { ...this.state.subjects[idx], ...updates };
    this.persist();
    return this.state.subjects[idx];
  }

  public deleteSubject(id: string): boolean {
    this.state.subjects = this.state.subjects.filter((s) => s.id !== id);
    this.state.exams = this.state.exams.filter((e) => e.subject_id !== id);
    this.state.syllabusTopics = this.state.syllabusTopics.filter((st) => st.subject_id !== id);
    this.persist();
    return true;
  }

  public getExams(): Exam[] {
    return this.state.exams;
  }

  public addExam(exam: Omit<Exam, 'id' | 'user_id' | 'created_at'>): Exam {
    const newExam: Exam = {
      ...exam,
      id: `ex-${Date.now()}`,
      user_id: this.state.profile.id,
      created_at: new Date().toISOString(),
    };
    this.state.exams.push(newExam);
    this.persist();
    return newExam;
  }

  public updateExam(id: string, updates: Partial<Exam>): Exam | undefined {
    const idx = this.state.exams.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;
    this.state.exams[idx] = { ...this.state.exams[idx], ...updates };
    this.persist();
    return this.state.exams[idx];
  }

  public deleteExam(id: string): boolean {
    this.state.exams = this.state.exams.filter((e) => e.id !== id);
    this.persist();
    return true;
  }

  public getSyllabusTopics(subjectId?: string): SyllabusTopic[] {
    if (subjectId) {
      return this.state.syllabusTopics.filter((t) => t.subject_id === subjectId);
    }
    return this.state.syllabusTopics;
  }

  public addSyllabusTopic(topic: Omit<SyllabusTopic, 'id' | 'user_id' | 'created_at'>): SyllabusTopic {
    const newTopic: SyllabusTopic = {
      ...topic,
      id: `syl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      user_id: this.state.profile.id,
      created_at: new Date().toISOString(),
    };
    this.state.syllabusTopics.push(newTopic);
    this.persist();
    return newTopic;
  }

  public updateSyllabusTopic(id: string, updates: Partial<SyllabusTopic>): SyllabusTopic | undefined {
    const idx = this.state.syllabusTopics.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    this.state.syllabusTopics[idx] = { ...this.state.syllabusTopics[idx], ...updates };
    this.persist();
    return this.state.syllabusTopics[idx];
  }

  public deleteSyllabusTopic(id: string): boolean {
    this.state.syllabusTopics = this.state.syllabusTopics.filter((t) => t.id !== id);
    this.persist();
    return true;
  }

  // ---------------- DSA ----------------
  public getDSAProblems(): DSAProblem[] {
    return this.state.dsaProblems;
  }

  public addDSAProblem(problem: Omit<DSAProblem, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'xp_awarded'>): { problem: DSAProblem; duplicate: boolean } {
    const isDuplicate = this.state.dsaProblems.some(
      (p) => p.problem_name.trim().toLowerCase() === problem.problem_name.trim().toLowerCase() &&
             p.platform === problem.platform
    );

    if (isDuplicate) {
      return {
        problem: this.state.dsaProblems.find(
          (p) => p.problem_name.trim().toLowerCase() === problem.problem_name.trim().toLowerCase()
        )!,
        duplicate: true,
      };
    }

    const now = new Date().toISOString();
    const newProblem: DSAProblem = {
      ...problem,
      id: `dsa-${Date.now()}`,
      user_id: this.state.profile.id,
      xp_awarded: true,
      created_at: now,
      updated_at: now,
    };

    this.state.dsaProblems.unshift(newProblem);
    this.awardXP(XP_VALUES.DSA_PROBLEM_SOLVED, 'dsa_problem', newProblem.id, `Solved ${problem.difficulty} problem: ${problem.problem_name}`);
    
    if (this.state.dsaProblems.length >= 1) this.unlockAchievement('FIRST_PROBLEM');
    if (this.state.dsaProblems.length >= 10) this.unlockAchievement('DSA_STREAK_10');
    if (this.state.dsaProblems.length >= 50) this.unlockAchievement('DSA_HALF_CENTURY');
    if (this.state.dsaProblems.length >= 100) this.unlockAchievement('DSA_CENTURY');

    this.persist();
    return { problem: newProblem, duplicate: false };
  }

  public updateDSAProblem(id: string, updates: Partial<DSAProblem>): DSAProblem | undefined {
    const idx = this.state.dsaProblems.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.state.dsaProblems[idx] = {
      ...this.state.dsaProblems[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.persist();
    return this.state.dsaProblems[idx];
  }

  public deleteDSAProblem(id: string): boolean {
    this.state.dsaProblems = this.state.dsaProblems.filter((p) => p.id !== id);
    this.persist();
    return true;
  }

  // ---------------- VIDEO EDITING ----------------
  public getEditingProjects(): EditingProject[] {
    return this.state.editingProjects;
  }

  public addEditingProject(project: Omit<EditingProject, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'xp_awarded'>): EditingProject {
    const now = new Date().toISOString();
    const newProject: EditingProject = {
      ...project,
      id: `ed-${Date.now()}`,
      user_id: this.state.profile.id,
      xp_awarded: false,
      created_at: now,
      updated_at: now,
    };

    if (newProject.completion_status === 'completed') {
      newProject.xp_awarded = true;
      this.awardXP(XP_VALUES.EDITING_PROJECT_COMPLETED, 'editing_project', newProject.id, `Completed project: ${newProject.project_name}`);
      this.unlockAchievement('FIRST_EDIT');
    }

    this.state.editingProjects.unshift(newProject);
    this.persist();
    return newProject;
  }

  public updateEditingProject(id: string, updates: Partial<EditingProject>): EditingProject | undefined {
    const idx = this.state.editingProjects.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;

    const current = this.state.editingProjects[idx];
    const isNowCompleted = updates.completion_status === 'completed' && current.completion_status !== 'completed';

    const updated: EditingProject = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isNowCompleted && !current.xp_awarded) {
      updated.xp_awarded = true;
      this.awardXP(XP_VALUES.EDITING_PROJECT_COMPLETED, 'editing_project', current.id, `Completed project: ${current.project_name}`);
      this.unlockAchievement('FIRST_EDIT');
      
      const totalCompleted = this.state.editingProjects.filter((p) => p.completion_status === 'completed').length + 1;
      if (totalCompleted >= 8) {
        this.unlockAchievement('EDIT_DIRECTOR');
      }
    }

    this.state.editingProjects[idx] = updated;
    this.persist();
    return updated;
  }

  public deleteEditingProject(id: string): boolean {
    this.state.editingProjects = this.state.editingProjects.filter((p) => p.id !== id);
    this.persist();
    return true;
  }

  // ---------------- ENGLISH ----------------
  public getEnglishSessions(): EnglishSession[] {
    return this.state.englishSessions;
  }

  public addEnglishSession(session: Omit<EnglishSession, 'id' | 'user_id' | 'created_at' | 'xp_awarded'>): EnglishSession {
    const newSession: EnglishSession = {
      ...session,
      id: `eng-${Date.now()}`,
      user_id: this.state.profile.id,
      xp_awarded: true,
      created_at: new Date().toISOString(),
    };
    this.state.englishSessions.unshift(newSession);
    this.awardXP(XP_VALUES.ENGLISH_PRACTICE, 'english_session', newSession.id, `English practice: ${newSession.practice_type} (${newSession.speaking_minutes} mins)`);
    this.unlockAchievement('FIRST_SPEAK');
    this.persist();
    return newSession;
  }

  public deleteEnglishSession(id: string): boolean {
    this.state.englishSessions = this.state.englishSessions.filter((s) => s.id !== id);
    this.persist();
    return true;
  }

  public getVocabulary(): VocabularyWord[] {
    return this.state.vocabulary;
  }

  public addVocabulary(word: Omit<VocabularyWord, 'id' | 'user_id' | 'created_at'>): { word: VocabularyWord; duplicate: boolean } {
    const isDup = this.state.vocabulary.some(
      (v) => v.word.trim().toLowerCase() === word.word.trim().toLowerCase()
    );
    if (isDup) {
      return {
        word: this.state.vocabulary.find(
          (v) => v.word.trim().toLowerCase() === word.word.trim().toLowerCase()
        )!,
        duplicate: true,
      };
    }

    const newWord: VocabularyWord = {
      ...word,
      id: `voc-${Date.now()}`,
      user_id: this.state.profile.id,
      created_at: new Date().toISOString(),
    };
    this.state.vocabulary.unshift(newWord);
    this.awardXP(XP_VALUES.VOCABULARY_MASTERED, 'vocabulary', newWord.id, `Learned vocabulary word: ${newWord.word}`);
    if (this.state.vocabulary.length >= 25) {
      this.unlockAchievement('VOCAB_EXPLORER');
    }
    this.persist();
    return { word: newWord, duplicate: false };
  }

  public updateVocabulary(id: string, updates: Partial<VocabularyWord>): VocabularyWord | undefined {
    const idx = this.state.vocabulary.findIndex((v) => v.id === id);
    if (idx === -1) return undefined;
    this.state.vocabulary[idx] = { ...this.state.vocabulary[idx], ...updates };
    this.persist();
    return this.state.vocabulary[idx];
  }

  public deleteVocabulary(id: string): boolean {
    this.state.vocabulary = this.state.vocabulary.filter((v) => v.id !== id);
    this.persist();
    return true;
  }

  // ---------------- GYM ----------------
  public getGymWorkouts(): GymWorkout[] {
    return this.state.gymWorkouts;
  }

  public addGymWorkout(workout: Omit<GymWorkout, 'id' | 'user_id' | 'created_at' | 'xp_awarded'>): GymWorkout {
    const newWorkout: GymWorkout = {
      ...workout,
      id: `gym-${Date.now()}`,
      user_id: this.state.profile.id,
      xp_awarded: true,
      created_at: new Date().toISOString(),
    };
    this.state.gymWorkouts.unshift(newWorkout);
    this.awardXP(XP_VALUES.GYM_WORKOUT, 'gym_workout', newWorkout.id, `Workout: ${newWorkout.workout_name} (${newWorkout.duration_minutes}m)`);
    this.unlockAchievement('FIRST_LIFT');
    if (this.state.gymWorkouts.length >= 20) {
      this.unlockAchievement('GYM_WARRIOR');
    }
    this.persist();
    return newWorkout;
  }

  public deleteGymWorkout(id: string): boolean {
    this.state.gymWorkouts = this.state.gymWorkouts.filter((w) => w.id !== id);
    this.persist();
    return true;
  }

  public getBodyMetrics(): BodyMetric[] {
    return this.state.bodyMetrics.sort((a, b) => a.recorded_date.localeCompare(b.recorded_date));
  }

  public addBodyMetric(metric: Omit<BodyMetric, 'id' | 'user_id' | 'created_at'>): BodyMetric {
    const existingIdx = this.state.bodyMetrics.findIndex((m) => m.recorded_date === metric.recorded_date);
    if (existingIdx >= 0) {
      this.state.bodyMetrics[existingIdx] = {
        ...this.state.bodyMetrics[existingIdx],
        ...metric,
      };
      this.persist();
      return this.state.bodyMetrics[existingIdx];
    } else {
      const newMetric: BodyMetric = {
        ...metric,
        id: `bm-${Date.now()}`,
        user_id: this.state.profile.id,
        created_at: new Date().toISOString(),
      };
      this.state.bodyMetrics.push(newMetric);
      this.persist();
      return newMetric;
    }
  }

  public deleteBodyMetric(id: string): boolean {
    this.state.bodyMetrics = this.state.bodyMetrics.filter((m) => m.id !== id);
    this.persist();
    return true;
  }

  // ---------------- WEB DESIGNING ----------------
  public getWebProjects(): WebProject[] {
    return this.state.webProjects.sort((a, b) => a.milestone_number - b.milestone_number);
  }

  public addWebProject(project: Omit<WebProject, 'id' | 'user_id' | 'created_at' | 'xp_awarded'>): WebProject {
    const newProj: WebProject = {
      ...project,
      id: `web-${Date.now()}`,
      user_id: this.state.profile.id,
      xp_awarded: project.status === 'completed',
      created_at: new Date().toISOString(),
    };
    if (newProj.status === 'completed') {
      this.awardXP(XP_VALUES.WEB_PROJECT_COMPLETED, 'web_project', newProj.id, `Completed Web Milestone: ${newProj.title}`);
    }
    this.state.webProjects.push(newProj);
    this.persist();
    return newProj;
  }

  public updateWebProject(id: string, updates: Partial<WebProject>): WebProject | undefined {
    const idx = this.state.webProjects.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;

    const current = this.state.webProjects[idx];
    const isNowCompleted = updates.status === 'completed' && current.status !== 'completed';

    const updated: WebProject = {
      ...current,
      ...updates,
      completed_date: updates.status === 'completed' ? (updates.completed_date || new Date().toISOString().split('T')[0]) : undefined,
    };

    if (isNowCompleted && !current.xp_awarded) {
      updated.xp_awarded = true;
      this.awardXP(XP_VALUES.WEB_PROJECT_COMPLETED, 'web_project', current.id, `Completed Web Milestone ${current.milestone_number}: ${current.title}`);
      if (current.milestone_number === 1) this.unlockAchievement('FIRST_SITE');
      
      const allDone = this.state.webProjects.filter((p) => p.id !== id && p.status === 'completed').length + 1 >= 3;
      if (allDone) this.unlockAchievement('WEB_TRILOGY');
    }

    this.state.webProjects[idx] = updated;
    this.persist();
    return updated;
  }

  public deleteWebProject(id: string): boolean {
    this.state.webProjects = this.state.webProjects.filter((p) => p.id !== id);
    this.persist();
    return true;
  }

  public getWebTopics(): WebTopic[] {
    return this.state.webTopics;
  }

  public toggleWebTopic(id: string): WebTopic | undefined {
    const idx = this.state.webTopics.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    const current = this.state.webTopics[idx];
    const newStatus = !current.is_completed;
    this.state.webTopics[idx] = {
      ...current,
      is_completed: newStatus,
      completed_date: newStatus ? new Date().toISOString().split('T')[0] : undefined,
    };
    if (newStatus) {
      this.awardXP(15, 'web_topic', current.id, `Mastered Web topic: ${current.topic_name}`);
    }
    this.persist();
    return this.state.webTopics[idx];
  }

  // ---------------- ACHIEVEMENTS ----------------
  public getAchievements(): Achievement[] {
    return this.state.achievements;
  }

  public unlockAchievement(code: string): boolean {
    const ach = this.state.achievements.find((a) => a.code === code);
    if (!ach || ach.unlocked_at) return false;

    ach.unlocked_at = new Date().toISOString();
    this.awardXP(ach.xp_reward, 'achievement', ach.code, `Achievement Unlocked: ${ach.title}`);
    this.persist();
    return true;
  }

  public getXPTransactions(): XPTransaction[] {
    return this.state.xpTransactions;
  }

  // ---------------- BACKUP & RESTORE ----------------
  public exportData(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data && typeof data === 'object' && data.profile) {
        this.state = data;
        this.persist();
        return true;
      }
    } catch (e) {
      console.error('Import failed:', e);
    }
    return false;
  }

  public resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('LEVEL_UP_73_APP_STATE_V1');
    this.state = this.loadInitialState();
    this.persist();
  }
}

export const storage = new StorageEngine();
