// LEVEL UP 73 - English Tracker Module
import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Plus,
  Sparkles,
  Trophy,
  Volume2,
  Calendar,
  PenTool,
  Clock,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Flame,
} from 'lucide-react';
import { storage } from '../services/storageEngine';
import { EnglishSession, EnglishPracticeType, VocabularyWord } from '../types';
import { formatDate } from '../utils/dateUtils';
import { triggerConfetti } from '../components/common/Confetti';

const DAILY_PROMPTS = [
  'How would you explain the difference between a Process and a Thread to a junior student?',
  'Why is consistency more important than intensity when learning complex programming skills?',
  'Describe your vision for your software engineering career over the next five years.',
  'Explain how relational database indexing works using an everyday real-world analogy.',
  'What are the three most valuable habits you have developed during this 73-day challenge?',
  'Debate the pros and cons of remote work vs on-site engineering collaboration.',
  'Describe a challenging bug or coding problem you solved recently and how you debugged it.',
];

export const EnglishTracker: React.FC = () => {
  const [sessions, setSessions] = useState<EnglishSession[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<any>(null);

  // Modals state
  const [showLogModal, setShowLogModal] = useState(false);
  const [showVocabModal, setShowVocabModal] = useState(false);

  // Session form
  const [practiceType, setPracticeType] = useState<EnglishPracticeType>('Speaking Challenge');
  const [sessionTopic, setSessionTopic] = useState('');
  const [speakingMinutes, setSpeakingMinutes] = useState(5);
  const [confidenceScore, setConfidenceScore] = useState(7);
  const [journalEntry, setJournalEntry] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');

  // Vocab form
  const [newWord, setNewWord] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('Adjective');
  const [newDefinition, setNewDefinition] = useState('');
  const [newSentence, setNewSentence] = useState('');
  const [newPronunciation, setNewPronunciation] = useState('');
  const [vocabError, setVocabError] = useState('');

  useEffect(() => {
    const refresh = () => {
      setSessions(storage.getEnglishSessions());
      setVocabulary(storage.getVocabulary());
    };
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleFinishTimer = () => {
    setIsTimerRunning(false);
    const recordedMins = Math.max(1, Math.round(timerSeconds / 60));
    setSpeakingMinutes(recordedMins);
    setSessionTopic(DAILY_PROMPTS[currentPromptIndex]);
    setShowLogModal(true);
  };

  const handleNextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % DAILY_PROMPTS.length);
  };

  // Calculations
  const totalSpeakingMinutes = sessions.reduce((sum, s) => sum + s.speaking_minutes, 0);
  const averageConfidence = sessions.length > 0
    ? (sessions.reduce((sum, s) => sum + s.confidence_score, 0) / sessions.length).toFixed(1)
    : '--';

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addEnglishSession({
      session_date: new Date().toISOString().split('T')[0],
      practice_type: practiceType,
      speaking_minutes: Number(speakingMinutes),
      topic: sessionTopic.trim() || DAILY_PROMPTS[currentPromptIndex],
      recording_url: recordingUrl.trim() || undefined,
      journal_entry: journalEntry.trim() || undefined,
      confidence_score: Number(confidenceScore),
    });

    triggerConfetti();
    setShowLogModal(false);
    setJournalEntry('');
    setRecordingUrl('');
    setTimerSeconds(0);
  };

  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault();
    setVocabError('');
    if (!newWord.trim() || !newDefinition.trim()) {
      setVocabError('Word and definition are required.');
      return;
    }

    const res = storage.addVocabulary({
      word: newWord.trim(),
      part_of_speech: newPartOfSpeech,
      definition: newDefinition.trim(),
      example_sentence: newSentence.trim() || undefined,
      pronunciation: newPronunciation.trim() || undefined,
      learned_date: new Date().toISOString().split('T')[0],
      mastery_level: 2,
    });

    if (res.duplicate) {
      setVocabError(`"${newWord.trim()}" is already in your vocabulary bank.`);
      return;
    }

    triggerConfetti();
    setNewWord('');
    setNewDefinition('');
    setNewSentence('');
    setNewPronunciation('');
    setShowVocabModal(false);
  };

  const handleDeleteVocab = (id: string) => {
    storage.deleteVocabulary(id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500 font-mono">
            <Mic className="w-4 h-4" />
            Communication Mastery & Speaking Lab
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            English Fluency & Vocabulary Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Target: Speak confidently for 5–10 minutes without reading a script by 23 January 2027.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVocabModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Add Word (+10 XP)
          </button>
          <button
            onClick={() => {
              setSessionTopic(DAILY_PROMPTS[currentPromptIndex]);
              setShowLogModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-glow-primary transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Log Practice (+10 XP)
          </button>
        </div>
      </div>

      {/* Target Progress & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Speaking Time</div>
          <div className="text-2xl font-black text-emerald-500 font-mono mt-1">
            {totalSpeakingMinutes} <span className="text-xs text-slate-400">mins</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{sessions.length} sessions logged</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Vocabulary Bank</div>
          <div className="text-2xl font-black text-primary font-mono mt-1">
            {vocabulary.length} <span className="text-xs text-slate-400">words</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Lexicon expanding</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Avg Confidence</div>
          <div className="text-2xl font-black text-amber-500 font-mono mt-1">
            {averageConfidence} {sessions.length > 0 && <span className="text-xs text-slate-400">/ 10</span>}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {sessions.length > 0 ? 'Self-rated fluency' : 'No sessions logged yet'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Goal Benchmark</div>
          <div className="text-2xl font-black text-secondary font-mono mt-1">5-10m</div>
          <div className="text-[11px] text-slate-400 mt-1">Impromptu without script</div>
        </div>
      </div>

      {/* Interactive Speaking Challenge Studio with Stopwatch */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-dark-card to-slate-900 border border-dark-border p-6 shadow-2xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Prompt card */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider font-mono">
                Daily Speaking Challenge
              </span>
              <button
                onClick={handleNextPrompt}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Shuffle Prompt →
              </button>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
              "{DAILY_PROMPTS[currentPromptIndex]}"
            </h3>

            <p className="text-xs text-slate-400">
              Guideline: Speak continuously for 5–10 minutes. Avoid notes or script. Focus on pacing, clear articulate pronunciation, and zero filler words.
            </p>
          </div>

          {/* Interactive Stopwatch */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-800/80 dark:bg-dark-secondary/80 border border-slate-700/80 min-w-[260px]">
            <div className="text-xs text-slate-400 uppercase font-semibold font-mono">
              Speaking Timer
            </div>
            <div className="text-4xl font-black font-mono my-2 text-primary tracking-wider">
              {formatTimer(timerSeconds)}
            </div>

            {timerSeconds >= 300 && timerSeconds <= 600 && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mb-2 font-mono">
                ✓ Goal Window (5-10m) Reached!
              </span>
            )}

            <div className="flex items-center gap-2">
              {!isTimerRunning ? (
                <button
                  onClick={handleStartTimer}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Start
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-sm transition-all"
                >
                  <Pause className="w-4 h-4 fill-white" />
                  Pause
                </button>
              )}

              <button
                onClick={handleResetTimer}
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleFinishTimer}
                disabled={timerSeconds < 10}
                className="px-3 py-2 rounded-xl bg-primary hover:bg-blue-600 disabled:opacity-40 text-xs font-bold text-white transition-all shadow-sm"
              >
                Log Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulary Bank & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vocabulary Bank */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Active Vocabulary Bank ({vocabulary.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Daily vocabulary expansion for refined technical communication
              </p>
            </div>

            <button
              onClick={() => setShowVocabModal(true)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
            >
              + New Word
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-dark-border/50 max-h-[380px] overflow-y-auto">
            {vocabulary.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No vocabulary words added yet. Click "+ New Word" to log high-level vocabulary.
              </div>
            ) : (
              vocabulary.map((v) => (
                <div key={v.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                        {v.word}
                      </span>
                      {v.pronunciation && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {v.pronunciation}
                        </span>
                      )}
                      {v.part_of_speech && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {v.part_of_speech}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                      {v.definition}
                    </div>
                    {v.example_sentence && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                        "{v.example_sentence}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteVocab(v.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Speaking Practice Sessions */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Practice Sessions ({sessions.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">Recent</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No practice sessions recorded yet.
              </div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-dark-secondary/60 border border-slate-200/60 dark:border-dark-border/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">
                      {s.practice_type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(s.session_date, 'dd MMM')} • {s.speaking_minutes}m
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                    {s.topic || 'General speaking practice'}
                  </div>

                  {s.journal_entry && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {s.journal_entry}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/40 dark:border-dark-border/40 text-[10px] text-slate-400">
                    <span>Confidence: {s.confidence_score}/10</span>
                    {s.recording_url && (
                      <a
                        href={s.recording_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-0.5"
                      >
                        Recording <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Log Practice Session Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Mic className="w-5 h-5 text-emerald-400" />
              Log English Practice Session
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Awards <span className="text-primary font-bold">+10 XP</span> for consistent communication training.
            </p>

            <form onSubmit={handleSaveSession} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Practice Category</label>
                  <select
                    value={practiceType}
                    onChange={(e) => setPracticeType(e.target.value as EnglishPracticeType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Speaking Challenge">Speaking Challenge</option>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Pronunciation">Pronunciation</option>
                    <option value="Listening">Listening</option>
                    <option value="Daily Journal">Daily Journal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Speaking Minutes</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={speakingMinutes}
                    onChange={(e) => setSpeakingMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Topic / Subject</label>
                <input
                  type="text"
                  required
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  placeholder="e.g. Explaining computer networks to a client..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Fluency & Confidence Score (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={confidenceScore}
                  onChange={(e) => setConfidenceScore(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>Hesitant (1)</span>
                  <span className="text-primary font-bold">{confidenceScore} / 10</span>
                  <span>Flawless & Confident (10)</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Daily Reflection / Journal Entry</label>
                <textarea
                  rows={2}
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="What went well? Any filler words used?..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Audio Recording Link (Optional)</label>
                <input
                  type="url"
                  value={recordingUrl}
                  onChange={(e) => setRecordingUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or voice note url"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Save Practice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vocabulary Modal */}
      {showVocabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Add Vocabulary Word
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Awards <span className="text-primary font-bold">+10 XP</span>.
            </p>

            {vocabError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {vocabError}
              </div>
            )}

            <form onSubmit={handleAddVocab} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Word</label>
                  <input
                    type="text"
                    required
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="e.g. Ubiquitous"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Part of Speech</label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Noun">Noun</option>
                    <option value="Verb">Verb</option>
                    <option value="Adjective">Adjective</option>
                    <option value="Adverb">Adverb</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Pronunciation (Phonetic)</label>
                <input
                  type="text"
                  value={newPronunciation}
                  onChange={(e) => setNewPronunciation(e.target.value)}
                  placeholder="/juːˈbɪk.wɪ.təs/"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Definition</label>
                <input
                  type="text"
                  required
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  placeholder="Present, appearing, or found everywhere."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Example Sentence</label>
                <input
                  type="text"
                  value={newSentence}
                  onChange={(e) => setNewSentence(e.target.value)}
                  placeholder="e.g. Cloud architectures have become ubiquitous in tech."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowVocabModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm"
                >
                  Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

