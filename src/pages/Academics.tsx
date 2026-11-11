// LEVEL UP 73 - Academics Module
import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  FileText,
  AlertTriangle,
  Award,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { storage } from '../services/storageEngine';
import { AcademicSubject, Exam, ExamType, SyllabusTopic } from '../types';
import { formatDate, getDaysUntil } from '../utils/dateUtils';
import { triggerConfetti } from '../components/common/Confetti';

export const Academics: React.FC = () => {
  const [subjects, setSubjects] = useState<AcademicSubject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [syllabusTopics, setSyllabusTopics] = useState<SyllabusTopic[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Modals state
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showLogStudy, setShowLogStudy] = useState(false);

  // Form states
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubProf, setNewSubProf] = useState('');
  const [newSubCredits, setNewSubCredits] = useState(4);
  const [newSubPriority, setNewSubPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  const [newExamType, setNewExamType] = useState<ExamType>('PUT');
  const [newExamSubId, setNewExamSubId] = useState('');
  const [newExamDate, setNewExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [newExamMaxMarks, setNewExamMaxMarks] = useState(70);
  const [newExamNotes, setNewExamNotes] = useState('');

  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicUnit, setNewTopicUnit] = useState('Unit 1');
  const [newTopicSubId, setNewTopicSubId] = useState('');
  const [newTopicImportance, setNewTopicImportance] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [newTopicResource, setNewTopicResource] = useState('');

  const [studyMinutes, setStudyMinutes] = useState(45);
  const [studyNotes, setStudyNotes] = useState('');

  useEffect(() => {
    const refresh = () => {
      const subs = storage.getSubjects();
      setSubjects(subs);
      setExams(storage.getExams());
      setSyllabusTopics(storage.getSyllabusTopics());
      if (subs.length > 0 && !selectedSubjectId) {
        setSelectedSubjectId(subs[0].id);
      }
    };
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, [selectedSubjectId]);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const activeTopics = syllabusTopics.filter((t) => t.subject_id === activeSubject?.id);
  const completedTopics = activeTopics.filter((t) => t.is_completed);
  const subjectProgress = activeTopics.length > 0
    ? Math.round((completedTopics.length / activeTopics.length) * 100)
    : 0;

  // Add Subject handler
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    const colors = ['#3987FF', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const created = storage.addSubject({
      name: newSubName.trim(),
      code: newSubCode.trim() || undefined,
      professor: newSubProf.trim() || undefined,
      credits: Number(newSubCredits),
      color: randomColor,
      priority: newSubPriority,
    });
    setNewSubName('');
    setNewSubCode('');
    setNewSubProf('');
    setShowAddSubject(false);
    setSelectedSubjectId(created.id);
  };

  // Add Exam handler
  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSub = newExamSubId || activeSubject?.id;
    if (!targetSub || !newExamDate) return;
    storage.addExam({
      subject_id: targetSub,
      exam_type: newExamType,
      exam_date: newExamDate,
      max_marks: Number(newExamMaxMarks),
      syllabus_coverage_percent: subjectProgress,
      notes: newExamNotes.trim() || undefined,
      status: 'upcoming',
    });
    setShowAddExam(false);
    setNewExamNotes('');
  };

  // Add Topic handler
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSub = newTopicSubId || activeSubject?.id;
    if (!targetSub || !newTopicTitle.trim()) return;
    storage.addSyllabusTopic({
      subject_id: targetSub,
      unit_name: newTopicUnit.trim() || 'Unit 1',
      title: newTopicTitle.trim(),
      is_completed: false,
      importance: newTopicImportance,
      revision_count: 0,
      resource_url: newTopicResource.trim() || undefined,
    });
    setNewTopicTitle('');
    setNewTopicResource('');
    setShowAddTopic(false);
  };

  // Toggle Topic Completion
  const handleToggleTopic = (topic: SyllabusTopic) => {
    const isNowDone = !topic.is_completed;
    storage.updateSyllabusTopic(topic.id, {
      is_completed: isNowDone,
      last_revised: isNowDone ? new Date().toISOString().split('T')[0] : topic.last_revised,
      revision_count: isNowDone ? topic.revision_count + 1 : topic.revision_count,
    });
    if (isNowDone) {
      storage.awardXP(15, 'academic_topic', topic.id, `Completed topic: ${topic.title}`);
      triggerConfetti();
    }
  };

  // Increment Revision
  const handleIncrementRevision = (topic: SyllabusTopic) => {
    storage.updateSyllabusTopic(topic.id, {
      revision_count: topic.revision_count + 1,
      last_revised: new Date().toISOString().split('T')[0],
    });
    storage.awardXP(10, 'academic_revision', `rev-${topic.id}-${Date.now()}`, `Revised: ${topic.title}`);
  };

  // Log Study Session
  const handleLogStudy = (e: React.FormEvent) => {
    e.preventDefault();
    storage.awardXP(20, 'study_session', `study-${Date.now()}`, `Studied ${activeSubject?.name || 'Academic Course'} (${studyMinutes} mins)`);
    triggerConfetti();
    setShowLogStudy(false);
    setStudyNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary font-mono">
            <GraduationCap className="w-4 h-4" />
            University Academic Management System
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Academics & Examination Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured tracking for PUT exams (7d est.), Lab Practicals (4d est.) and End-Semester exams (10d est.).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogStudy(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Clock className="w-4 h-4" />
            Log Study Session (+20 XP)
          </button>
          <button
            onClick={() => setShowAddSubject(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Exam Timeline Highlights (PUT, Practical, End-Sem) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['PUT', 'Practical', 'End-Sem'] as ExamType[]).map((type) => {
          const typeExams = exams.filter((e) => e.exam_type === type);
          const nextExam = typeExams.sort((a, b) => a.exam_date.localeCompare(b.exam_date))[0];
          const daysLeft = nextExam ? getDaysUntil(nextExam.exam_date) : null;
          const nextSubject = nextExam ? subjects.find((s) => s.id === nextExam.subject_id) : null;

          return (
            <div
              key={type}
              className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
                type === 'PUT'
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : type === 'Practical'
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-rose-500/5 border-rose-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                    type === 'PUT'
                      ? 'bg-amber-500/20 text-amber-500'
                      : type === 'Practical'
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : 'bg-rose-500/20 text-rose-500'
                  }`}
                >
                  {type} EXAMS
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {typeExams.length} Scheduled
                </span>
              </div>

              <div className="mt-3">
                {nextExam ? (
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {nextSubject?.name || 'Scheduled Exam'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(nextExam.exam_date, 'dd MMM yyyy')}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Countdown:</span>
                      <span
                        className={`font-black font-mono ${
                          daysLeft !== null && daysLeft <= 10 ? 'text-rose-500' : 'text-primary'
                        }`}
                      >
                        {daysLeft !== null ? (daysLeft >= 0 ? `${daysLeft} Days Remaining` : 'Completed') : 'TBD'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-xs text-slate-400">
                    No {type} examination scheduled yet. Click below to add.
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setNewExamType(type);
                  setShowAddExam(true);
                }}
                className="mt-3 w-full py-1.5 rounded-lg bg-slate-200/60 dark:bg-dark-secondary hover:bg-slate-300 dark:hover:bg-dark-card text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Schedule {type} Date
              </button>
            </div>
          );
        })}
      </div>

      {/* Main Subject Explorer & Syllabus Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subjects List Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Enrolled Subjects ({subjects.length})
            </h3>
          </div>

          <div className="space-y-2">
            {subjects.length === 0 ? (
              <div className="p-6 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-center text-xs text-slate-400">
                No subjects enrolled yet. Click "+ Add Subject" to begin.
              </div>
            ) : (
              subjects.map((sub) => {
                const isSelected = activeSubject?.id === sub.id;
                const subTopics = syllabusTopics.filter((t) => t.subject_id === sub.id);
                const doneCount = subTopics.filter((t) => t.is_completed).length;
                const pct = subTopics.length > 0 ? Math.round((doneCount / subTopics.length) * 100) : 0;

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubjectId(sub.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary shadow-sm text-white'
                        : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          {sub.code && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {sub.code}
                            </span>
                          )}
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                              sub.priority === 'critical'
                                ? 'bg-rose-500/20 text-rose-500'
                                : 'bg-blue-500/20 text-blue-500'
                            }`}
                          >
                            {sub.priority}
                          </span>
                        </div>
                        <div className="text-xs font-bold mt-1 line-clamp-1">{sub.name}</div>
                        {sub.professor && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{sub.professor}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-primary">{pct}%</span>
                        <div className="text-[10px] text-slate-400">
                          {doneCount}/{subTopics.length}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(3, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Subject Details & Syllabus Topics */}
        <div className="lg:col-span-8 space-y-4">
          {activeSubject ? (
            <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm space-y-4">
              {/* Header with subject progress */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-dark-border/60">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeSubject.name}
                    </h2>
                    {activeSubject.code && (
                      <span className="text-xs font-mono text-slate-400">({activeSubject.code})</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {completedTopics.length} of {activeTopics.length} syllabus topics mastered • {activeSubject.credits} Credits
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setNewTopicSubId(activeSubject.id);
                      setShowAddTopic(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Topic
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete subject "${activeSubject.name}" and all related exams?`)) {
                        storage.deleteSubject(activeSubject.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Stats */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-secondary/60 border border-slate-200/60 dark:border-dark-border/60">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Syllabus Completion</span>
                  <span className="text-primary font-mono">{subjectProgress}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, subjectProgress)}%` }}
                  />
                </div>
              </div>

              {/* Topics Breakdown List */}
              <div className="space-y-2 mt-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Syllabus Units & Topics ({activeTopics.length})
                </div>

                {activeTopics.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No syllabus topics added for this subject. Click "Add Topic" to build your syllabus roadmap.
                  </div>
                ) : (
                  activeTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                        topic.is_completed
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                          : 'bg-white dark:bg-dark-secondary/40 border-slate-200 dark:border-dark-border/80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleTopic(topic)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-500 focus:outline-none"
                        >
                          {topic.is_completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            {topic.unit_name && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {topic.unit_name}
                              </span>
                            )}
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                                topic.importance === 'critical'
                                  ? 'bg-rose-500/20 text-rose-500'
                                  : 'bg-amber-500/20 text-amber-500'
                              }`}
                            >
                              {topic.importance}
                            </span>
                          </div>

                          <div
                            className={`text-xs font-bold mt-1 ${
                              topic.is_completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {topic.title}
                          </div>

                          {topic.notes && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {topic.notes}
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-mono">
                            <span>Revised: {topic.revision_count} times</span>
                            {topic.last_revised && <span>• Last: {formatDate(topic.last_revised, 'dd MMM')}</span>}
                            {topic.resource_url && (
                              <a
                                href={topic.resource_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary hover:underline flex items-center gap-0.5"
                              >
                                Resource <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleIncrementRevision(topic)}
                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/20 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors font-mono"
                          title="Log Revision"
                        >
                          + Revise
                        </button>
                        <button
                          onClick={() => storage.deleteSyllabusTopic(topic.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-center text-xs text-slate-400 space-y-2">
              <GraduationCap className="w-8 h-8 text-slate-500/40 mx-auto" />
              <p className="font-semibold text-slate-300">No Academic Subjects Enrolled Yet</p>
              <p className="text-[11px] text-slate-500">Add your university subjects, syllabus units, and exam dates to start tracking.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Academic Subject</h3>
            <form onSubmit={handleCreateSubject} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Distributed Operating Systems"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    placeholder="e.g. CS601"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Credits</label>
                  <input
                    type="number"
                    value={newSubCredits}
                    onChange={(e) => setNewSubCredits(Number(e.target.value))}
                    min="1"
                    max="6"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Professor</label>
                  <input
                    type="text"
                    value={newSubProf}
                    onChange={(e) => setNewSubProf(e.target.value)}
                    placeholder="e.g. Dr. K. Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Priority</label>
                  <select
                    value={newSubPriority}
                    onChange={(e) => setNewSubPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Schedule Examination Date</h3>
            <form onSubmit={handleCreateExam} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Subject</label>
                <select
                  value={newExamSubId || activeSubject?.id}
                  onChange={(e) => setNewExamSubId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code || 'No Code'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Exam Type</label>
                  <select
                    value={newExamType}
                    onChange={(e) => setNewExamType(e.target.value as ExamType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="PUT">PUT</option>
                    <option value="Practical">Practical</option>
                    <option value="End-Sem">End-Sem</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Revision Notes / Focus Topics</label>
                <input
                  type="text"
                  value={newExamNotes}
                  onChange={(e) => setNewExamNotes(e.target.value)}
                  placeholder="e.g. Focus on Units 3 & 4 numericals..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddExam(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Syllabus Topic</h3>
            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Unit Name</label>
                <input
                  type="text"
                  value={newTopicUnit}
                  onChange={(e) => setNewTopicUnit(e.target.value)}
                  placeholder="e.g. Unit 3: Concurrency"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g. Banker's Algorithm & Deadlock Avoidance"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Exam Weightage</label>
                  <select
                    value={newTopicImportance}
                    onChange={(e) => setNewTopicImportance(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Resource URL (Optional)</label>
                  <input
                    type="url"
                    value={newTopicResource}
                    onChange={(e) => setNewTopicResource(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTopic(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Study Session Modal */}
      {showLogStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Log Academic Study Session
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Recording an active academic study session awards <span className="text-primary font-bold">+20 XP</span>.
            </p>
            <form onSubmit={handleLogStudy} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Subject</label>
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white">
                  {activeSubject?.name || 'Selected Course'}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Study Duration (Minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="300"
                  value={studyMinutes}
                  onChange={(e) => setStudyMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Topics Studied / Solved Notes</label>
                <input
                  type="text"
                  value={studyNotes}
                  onChange={(e) => setStudyNotes(e.target.value)}
                  placeholder="e.g. Solved 4 question paper problems on Page Replacement..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogStudy(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-sm"
                >
                  Record & Claim 20 XP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

