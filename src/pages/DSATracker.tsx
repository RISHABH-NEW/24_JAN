// LEVEL UP 73 - DSA Tracker Module
import React, { useState, useEffect } from 'react';
import {
  Code2,
  Plus,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Trophy,
  Calendar,
  AlertCircle,
  Trash2,
  PieChart as PieIcon,
  Flame,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { storage } from '../services/storageEngine';
import { DSAProblem, DSATopic, DSADifficulty, DSAPlatform, DSARevisionStatus, DSA_TOPICS } from '../types';
import { formatDate } from '../utils/dateUtils';
import { triggerConfetti } from '../components/common/Confetti';

export const DSATracker: React.FC = () => {
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('All');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('All');
  const [selectedRevisionFilter, setSelectedRevisionFilter] = useState<string>('All');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [problemName, setProblemName] = useState('');
  const [platform, setPlatform] = useState<DSAPlatform>('LeetCode');
  const [topic, setTopic] = useState<DSATopic>('Arrays');
  const [difficulty, setDifficulty] = useState<DSADifficulty>('Medium');
  const [problemUrl, setProblemUrl] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [solutionNotes, setSolutionNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const refresh = () => setProblems(storage.getDSAProblems());
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  // Targets and calculations
  const TARGET_PROBLEMS = 100;
  const totalSolved = problems.length;
  const progressPercent = Math.min(100, Math.round((totalSolved / TARGET_PROBLEMS) * 100));

  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;

  const difficultyData = [
    { name: 'Easy', value: easyCount, color: '#22C55E' },
    { name: 'Medium', value: mediumCount, color: '#F59E0B' },
    { name: 'Hard', value: hardCount, color: '#EF4444' },
  ];

  // Topic distribution
  const topicStats = DSA_TOPICS.map((t) => {
    const count = problems.filter((p) => p.topic === t).length;
    return { topic: t, count };
  });

  // Filtered problems list
  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.problem_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.solution_notes && p.solution_notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTopic = selectedTopicFilter === 'All' || p.topic === selectedTopicFilter;
    const matchesDiff = selectedDifficultyFilter === 'All' || p.difficulty === selectedDifficultyFilter;
    const matchesRev = selectedRevisionFilter === 'All' || p.revision_status === selectedRevisionFilter;
    return matchesSearch && matchesTopic && matchesDiff && matchesRev;
  });

  // Revision Due list
  const revisionDueList = problems.filter(
    (p) => p.revision_status === 'needs_revision' || p.revision_status === 'revising'
  );

  const handleCreateProblem = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!problemName.trim()) {
      setErrorMessage('Please enter the problem name.');
      return;
    }

    const result = storage.addDSAProblem({
      problem_name: problemName.trim(),
      platform,
      topic,
      difficulty,
      problem_url: problemUrl.trim() || undefined,
      solution_notes: solutionNotes.trim() || undefined,
      time_complexity: timeComplexity.trim() || undefined,
      space_complexity: spaceComplexity.trim() || undefined,
      date_solved: new Date().toISOString().split('T')[0],
      revision_status: 'needs_revision',
    });

    if (result.duplicate) {
      setErrorMessage(`"${problemName.trim()}" on ${platform} is already logged. Duplicate entries are prevented.`);
      return;
    }

    triggerConfetti();
    setProblemName('');
    setProblemUrl('');
    setSolutionNotes('');
    setShowAddModal(false);
  };

  const handleUpdateRevisionStatus = (id: string, status: DSARevisionStatus) => {
    storage.updateDSAProblem(id, { revision_status: status });
  };

  const handleDeleteProblem = (id: string, name: string) => {
    if (confirm(`Remove problem "${name}"?`)) {
      storage.deleteDSAProblem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500 font-mono">
            <Code2 className="w-4 h-4" />
            100 Quality Problems Roadmap
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            DSA Problem Solving Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Target: 100 quality problems across 13 core topics by 23 January 2027.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMessage('');
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-glow-primary transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Log Solved Problem (+25 XP)
        </button>
      </div>

      {/* Target & Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Solved</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {totalSolved} <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-primary font-bold mt-1">{progressPercent}% of target</div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-emerald-500 uppercase font-semibold">Easy Problems</div>
          <div className="text-2xl font-black text-emerald-500 font-mono mt-1">{easyCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Foundational patterns</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-amber-500 uppercase font-semibold">Medium Problems</div>
          <div className="text-2xl font-black text-amber-500 font-mono mt-1">{mediumCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Core interview tier</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-rose-500 uppercase font-semibold">Hard Problems</div>
          <div className="text-2xl font-black text-rose-500 font-mono mt-1">{hardCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Advanced mastery</div>
        </div>
      </div>

      {/* Analytics: Difficulty Distribution & Revision Due */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Difficulty Pie Chart */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <PieIcon className="w-4 h-4 text-primary" />
            Difficulty Distribution
          </h3>
          <div className="h-44 w-full flex items-center justify-center">
            {totalSolved === 0 ? (
              <div className="text-xs text-slate-400">No problems solved yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
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
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-around text-xs font-mono pt-2 border-t border-slate-100 dark:border-dark-border/60">
            <span className="text-emerald-500">● Easy: {easyCount}</span>
            <span className="text-amber-500">● Medium: {mediumCount}</span>
            <span className="text-rose-500">● Hard: {hardCount}</span>
          </div>
        </div>

        {/* Revision Queue */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              Spaced Repetition & Revision Due ({revisionDueList.length})
            </h3>
            <span className="text-xs text-slate-400">Keep patterns fresh</span>
          </div>

          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {revisionDueList.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                All problems marked as mastered! Great retention.
              </div>
            ) : (
              revisionDueList.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-dark-secondary/60 border border-slate-200/60 dark:border-dark-border/60 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <span>{p.problem_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({p.topic})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Solved: {formatDate(p.date_solved, 'dd MMM')} • {p.time_complexity || 'O(?)'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateRevisionStatus(p.id, 'mastered')}
                      className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-[10px] font-bold"
                    >
                      Mark Mastered
                    </button>
                    {p.problem_url && (
                      <a
                        href={p.problem_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-400 hover:text-primary"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem or notes..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <select
              value={selectedTopicFilter}
              onChange={(e) => setSelectedTopicFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            >
              <option value="All">All 13 Topics</option>
              {DSA_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDifficultyFilter}
              onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <select
              value={selectedRevisionFilter}
              onChange={(e) => setSelectedRevisionFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-secondary border border-slate-200 dark:border-dark-border text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            >
              <option value="All">All Revision Statuses</option>
              <option value="mastered">Mastered</option>
              <option value="revising">Revising</option>
              <option value="needs_revision">Needs Revision</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-dark-border/60 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Solved Problems Archive ({filteredProblems.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {problems.length} / 100 Solved
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-secondary/50 text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-3">Platform</th>
                <th className="py-3 px-3">Topic</th>
                <th className="py-3 px-3">Difficulty</th>
                <th className="py-3 px-3">Complexity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border/50 text-xs">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No problems match the current filter.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {p.problem_name}
                        {p.problem_url && (
                          <a
                            href={p.problem_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:text-blue-400"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {p.solution_notes && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {p.solution_notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                        {p.platform}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      {p.topic}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          p.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : p.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}
                      >
                        {p.difficulty}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      <div>T: {p.time_complexity || 'O(?)'}</div>
                      <div>S: {p.space_complexity || 'O(?)'}</div>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={p.revision_status}
                        onChange={(e) => handleUpdateRevisionStatus(p.id, e.target.value as DSARevisionStatus)}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 focus:outline-none"
                      >
                        <option value="needs_revision">Needs Revision</option>
                        <option value="revising">Revising</option>
                        <option value="mastered">Mastered</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteProblem(p.id, p.problem_name)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Problem Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              Log Solved DSA Problem
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Awards <span className="text-primary font-bold">+25 XP</span>. Duplicate problem names are automatically checked.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateProblem} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  value={problemName}
                  onChange={(e) => setProblemName(e.target.value)}
                  placeholder="e.g. Trapping Rain Water"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as DSAPlatform)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="LeetCode">LeetCode</option>
                    <option value="GeeksforGeeks">GeeksforGeeks</option>
                    <option value="Codeforces">Codeforces</option>
                    <option value="CodeChef">CodeChef</option>
                    <option value="HackerRank">HackerRank</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as DSATopic)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    {DSA_TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DSADifficulty)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Time Complexity</label>
                  <input
                    type="text"
                    value={timeComplexity}
                    onChange={(e) => setTimeComplexity(e.target.value)}
                    placeholder="e.g. O(N log N)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Space Complexity</label>
                  <input
                    type="text"
                    value={spaceComplexity}
                    onChange={(e) => setSpaceComplexity(e.target.value)}
                    placeholder="e.g. O(1)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Problem URL (Optional)</label>
                <input
                  type="url"
                  value={problemUrl}
                  onChange={(e) => setProblemUrl(e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Solution Notes / Key Idea</label>
                <textarea
                  rows={2}
                  value={solutionNotes}
                  onChange={(e) => setSolutionNotes(e.target.value)}
                  placeholder="Key pattern (e.g. Two pointers from both ends, maintain max area...)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

