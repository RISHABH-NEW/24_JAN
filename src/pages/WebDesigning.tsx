// LEVEL UP 73 - Web Designing & Full-Stack Tracker Module
import React, { useState, useEffect } from 'react';
import {
  Globe,
  Plus,
  ExternalLink,
  Github,
  CheckCircle2,
  Circle,
  Sparkles,
  Trophy,
  Layers,
  Code2,
  Clock,
  Trash2,
  Eye,
} from 'lucide-react';
import { storage } from '../services/storageEngine';
import { WebProject, WebTopic, WEB_ROADMAP_TOPICS } from '../types';
import { triggerConfetti } from '../components/common/Confetti';

export const WebDesigning: React.FC = () => {
  const [projects, setProjects] = useState<WebProject[]>([]);
  const [topics, setTopics] = useState<WebTopic[]>([]);

  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<WebProject | null>(null);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTechStack, setProjectTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [status, setStatus] = useState<'planned' | 'in_progress' | 'completed'>('in_progress');

  useEffect(() => {
    const refresh = () => {
      setProjects(storage.getWebProjects());
      setTopics(storage.getWebTopics());
    };
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  const completedProjects = projects.filter((p) => p.status === 'completed');
  const completedTopics = topics.filter((t) => t.is_completed);
  const topicsPercent = topics.length > 0
    ? Math.round((completedTopics.length / topics.length) * 100)
    : 0;

  const handleToggleTopic = (id: string) => {
    const updated = storage.toggleWebTopic(id);
    if (updated?.is_completed) {
      triggerConfetti();
    }
  };

  const handleOpenEditProject = (proj: WebProject) => {
    setEditingProject(proj);
    setProjectTitle(proj.title);
    setProjectDesc(proj.description || '');
    setProjectTechStack(proj.tech_stack ? proj.tech_stack.join(', ') : '');
    setGithubUrl(proj.github_url || '');
    setLiveUrl(proj.live_url || '');
    setScreenshotUrl(proj.screenshot_url || '');
    setStatus(proj.status);
    setShowEditProjectModal(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const stackArray = projectTechStack
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    storage.updateWebProject(editingProject.id, {
      title: projectTitle.trim(),
      description: projectDesc.trim() || undefined,
      tech_stack: stackArray,
      github_url: githubUrl.trim() || undefined,
      live_url: liveUrl.trim() || undefined,
      screenshot_url: screenshotUrl.trim() || undefined,
      status,
    });

    if (status === 'completed') {
      triggerConfetti();
    }

    setShowEditProjectModal(false);
  };

  const handleLogWebSession = () => {
    storage.awardXP(20, 'web_session', `web-${Date.now()}`, 'Completed focused Web Designing coding session');
    triggerConfetti();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">
            <Globe className="w-4 h-4" />
            Front-End & UI Engineering Track
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Web Designing & Development Roadmap
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Target: Build and deploy three responsive projects (Portfolio, Landing Page, Multi-page App) by 23 January 2027.
          </p>
        </div>

        <button
          onClick={handleLogWebSession}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-glow-primary transition-all active:scale-95"
        >
          <Clock className="w-4 h-4" />
          Log Web Session (+20 XP)
        </button>
      </div>

      {/* Target Progress & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Web Milestones</div>
          <div className="text-2xl font-black text-cyan-500 font-mono mt-1">
            {completedProjects.length} <span className="text-xs text-slate-400">/ 3</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {Math.round((completedProjects.length / 3) * 100)}% Milestone Target
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.round((completedProjects.length / 3) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Roadmap Topics</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {completedTopics.length} <span className="text-xs text-slate-400">/ {topics.length}</span>
          </div>
          <div className="text-[11px] text-emerald-500 font-bold mt-1">{topicsPercent}% mastered</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Live Deployments</div>
          <div className="text-2xl font-black text-primary font-mono mt-1">
            {projects.filter((p) => p.live_url).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Accessible on web</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">GitHub Repos</div>
          <div className="text-2xl font-black text-secondary font-mono mt-1">
            {projects.filter((p) => p.github_url).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Open source code</div>
        </div>
      </div>

      {/* 3 Core Project Milestones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-cyan-500" />
            The 3 Project Milestones Target
          </h3>
          <span className="text-xs text-slate-400 font-mono">Due by 23 Jan 2027</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border overflow-hidden shadow-sm flex flex-col justify-between group hover:border-cyan-500/50 transition-all"
            >
              <div className="relative h-44 bg-slate-800 overflow-hidden">
                {proj.screenshot_url ? (
                  <img
                    src={proj.screenshot_url}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-gradient-to-br from-slate-900 to-dark-secondary">
                    <Code2 className="w-10 h-10 stroke-1 mb-2 opacity-50" />
                    <span className="text-xs">No Preview</span>
                  </div>
                )}

                {/* Milestone Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-cyan-400 border border-cyan-400/30 backdrop-blur-md font-mono">
                    Milestone {proj.milestone_number}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md font-mono ${
                      proj.status === 'completed'
                        ? 'bg-emerald-500/80 text-white'
                        : proj.status === 'in_progress'
                        ? 'bg-amber-500/80 text-white'
                        : 'bg-slate-700/80 text-slate-200'
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {proj.title}
                  </h4>

                  {proj.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {proj.description}
                    </p>
                  )}

                  {/* Tech stack */}
                  {proj.tech_stack && proj.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.tech_stack.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-dark-border/60 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenEditProject(proj)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Edit Details
                  </button>

                  <div className="flex items-center gap-2">
                    {proj.github_url && (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {proj.live_url && (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                        title="Live Site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 11 Roadmap Topics Checklist */}
      <div className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-border/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              11 Core Web Topics Mastery Checklist ({completedTopics.length}/{topics.length})
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive syllabus tracker. Checking off a topic awards <span className="text-primary font-bold">+15 XP</span>.
            </p>
          </div>
          <span className="text-xs font-bold font-mono text-primary">{topicsPercent}% Mastered</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {topics.map((t) => (
            <div
              key={t.id}
              onClick={() => handleToggleTopic(t.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                t.is_completed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-slate-50 dark:bg-dark-secondary/40 border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {t.is_completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
                <div>
                  <div className={`text-xs font-bold ${t.is_completed ? 'line-through opacity-70' : ''}`}>
                    {t.topic_name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Category: {t.category}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800 text-slate-500">
                {t.is_completed ? '✓ Mastered' : '+15 XP'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Project Modal */}
      {showEditProjectModal && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Edit Milestone {editingProject.milestone_number} Details
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Marking a milestone completed awards <span className="text-primary font-bold">+150 XP</span>.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={projectTechStack}
                    onChange={(e) => setProjectTechStack(e.target.value)}
                    placeholder="React, Tailwind, Supabase"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Live URL</label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Screenshot URL</label>
                <input
                  type="url"
                  value={screenshotUrl}
                  onChange={(e) => setScreenshotUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditProjectModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

