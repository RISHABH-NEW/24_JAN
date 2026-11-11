// LEVEL UP 73 - Video Editing Tracker Module
import React, { useState, useEffect } from 'react';
import {
  Film,
  Plus,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCircle2,
  Trophy,
  Sliders,
  Image as ImageIcon,
  Play,
  Layers,
  Trash2,
} from 'lucide-react';
import { storage } from '../services/storageEngine';
import { EditingProject, EDITING_ROADMAP_TOPICS } from '../types';
import { formatDate } from '../utils/dateUtils';
import { triggerConfetti } from '../components/common/Confetti';

export const EditingTracker: React.FC = () => {
  const [projects, setProjects] = useState<EditingProject[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Form states
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Short Form / Reel');
  const [softwareUsed, setSoftwareUsed] = useState('Premiere Pro');
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(60);
  const [status, setStatus] = useState<'planned' | 'in_progress' | 'completed'>('in_progress');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [notes, setNotes] = useState('');

  const [sessionMinutes, setSessionMinutes] = useState(60);
  const [sessionSoftware, setSessionSoftware] = useState('DaVinci Resolve');

  useEffect(() => {
    const refresh = () => setProjects(storage.getEditingProjects());
    refresh();
    const unsub = storage.subscribe(refresh);
    return () => unsub();
  }, []);

  const TARGET_PROJECTS = 8;
  const completedProjects = projects.filter((p) => p.completion_status === 'completed');
  const totalMinutes = projects.reduce((sum, p) => sum + p.time_spent_minutes, 0);

  // Calculate techniques coverage
  const masteredTechniques = new Set<string>();
  projects.forEach((p) => {
    if (p.techniques_learned) {
      p.techniques_learned.forEach((t) => masteredTechniques.add(t));
    }
  });

  const handleToggleTechnique = (tech: string) => {
    if (selectedTechniques.includes(tech)) {
      setSelectedTechniques(selectedTechniques.filter((t) => t !== tech));
    } else {
      setSelectedTechniques([...selectedTechniques, tech]);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    storage.addEditingProject({
      project_name: projectName.trim(),
      project_type: projectType,
      software_used: softwareUsed,
      techniques_learned: selectedTechniques,
      time_spent_minutes: Number(timeSpent),
      completion_status: status,
      portfolio_link: portfolioLink.trim() || undefined,
      thumbnail_url: thumbnailUrl.trim() || undefined,
      notes: notes.trim() || undefined,
      completion_date: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
    });

    if (status === 'completed') {
      triggerConfetti();
    }

    setProjectName('');
    setPortfolioLink('');
    setThumbnailUrl('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleToggleStatus = (project: EditingProject) => {
    const nextStatus = project.completion_status === 'completed' ? 'in_progress' : 'completed';
    const updated = storage.updateEditingProject(project.id, {
      completion_status: nextStatus,
      completion_date: nextStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
    });
    if (updated?.completion_status === 'completed') {
      triggerConfetti();
    }
  };

  const handleDeleteProject = (id: string, name: string) => {
    if (confirm(`Delete project "${name}"?`)) {
      storage.deleteEditingProject(id);
    }
  };

  const handleLogEditingSession = (e: React.FormEvent) => {
    e.preventDefault();
    storage.awardXP(15, 'editing_session', `edit-${Date.now()}`, `Logged ${sessionMinutes}m creative editing practice in ${sessionSoftware}`);
    triggerConfetti();
    setShowSessionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-500 font-mono">
            <Film className="w-4 h-4" />
            Creative Visual & Editing Studio
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Video Editing Portfolio & Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Target: 8 polished editing projects across Premiere Pro, DaVinci & After Effects by 23 January 2027.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSessionModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white shadow-sm transition-all"
          >
            <Clock className="w-4 h-4" />
            Log Practice (+15 XP)
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-xs font-bold text-white shadow-glow-primary transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      {/* Target Progress & Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Completed Projects</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {completedProjects.length} <span className="text-xs text-slate-400">/ 8</span>
          </div>
          <div className="text-[11px] text-purple-500 font-bold mt-1">
            {Math.round((completedProjects.length / TARGET_PROJECTS) * 100)}% of Target
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((completedProjects.length / TARGET_PROJECTS) * 100))}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">In Progress</div>
          <div className="text-2xl font-black text-amber-500 font-mono mt-1">
            {projects.filter((p) => p.completion_status === 'in_progress').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active on timeline</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Techniques Mastered</div>
          <div className="text-2xl font-black text-primary font-mono mt-1">
            {masteredTechniques.size} <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Roadmap coverage</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Studio Time</div>
          <div className="text-2xl font-black text-emerald-500 font-mono mt-1">
            {(totalMinutes / 60).toFixed(1)}h
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Dedicated editing</div>
        </div>
      </div>

      {/* 10 Techniques Roadmap Pill Tracker */}
      <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-500" />
          10 Core Editing Techniques Roadmap
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {EDITING_ROADMAP_TOPICS.map((tech) => {
            const isMastered = masteredTechniques.has(tech);
            return (
              <div
                key={tech}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  isMastered
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 font-bold'
                    : 'bg-slate-50 dark:bg-dark-secondary/50 border-slate-200 dark:border-dark-border text-slate-400 font-medium'
                }`}
              >
                <span className="truncate">{tech}</span>
                {isMastered ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 ml-1" />
                ) : (
                  <span className="text-[10px] text-slate-500">Todo</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Gallery & Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Project Showcase Gallery ({projects.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.length === 0 ? (
            <div className="col-span-full py-12 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-center text-xs text-slate-400 space-y-2">
              <Film className="w-8 h-8 text-slate-500/40 mx-auto" />
              <p className="font-semibold text-slate-300">No Editing Projects Logged Yet</p>
              <p className="text-[11px] text-slate-500">Record your video edits, reels, and tutorials towards your 8-project target.</p>
            </div>
          ) : (
            projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Thumbnail */}
              <div className="relative h-44 bg-slate-800 overflow-hidden">
                {proj.thumbnail_url ? (
                  <img
                    src={proj.thumbnail_url}
                    alt={proj.project_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-gradient-to-br from-slate-900 to-dark-secondary">
                    <Film className="w-10 h-10 stroke-1 mb-2 opacity-50" />
                    <span className="text-xs">No Thumbnail</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md font-mono ${
                      proj.completion_status === 'completed'
                        ? 'bg-emerald-500/80 text-white'
                        : proj.completion_status === 'in_progress'
                        ? 'bg-amber-500/80 text-white'
                        : 'bg-slate-700/80 text-slate-200'
                    }`}
                  >
                    {proj.completion_status}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono backdrop-blur-md">
                    {proj.software_used}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-purple-500 font-mono">
                      {proj.project_type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {proj.time_spent_minutes}m
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {proj.project_name}
                  </h4>

                  {proj.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {proj.notes}
                    </p>
                  )}

                  {/* Techniques Pills */}
                  {proj.techniques_learned && proj.techniques_learned.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.techniques_learned.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-dark-border/60 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(proj)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                      proj.completion_status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {proj.completion_status === 'completed' ? '✓ Completed' : 'Mark Complete (+100 XP)'}
                  </button>

                  <div className="flex items-center gap-2">
                    {proj.portfolio_link && (
                      <a
                        href={proj.portfolio_link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Open Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteProject(proj.id, proj.project_name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Film className="w-5 h-5 text-purple-400" />
              Add Editing Project
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Completing a project awards <span className="text-primary font-bold">+100 XP</span> towards your goal of 8 projects.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Cinematic Tech Reel 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Project Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Short Form / Reel">Short Form / Reel</option>
                    <option value="YouTube Video">YouTube Video</option>
                    <option value="Cinematic B-Roll">Cinematic B-Roll</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Client Work">Client Work</option>
                    <option value="Practice / Study">Practice / Study</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Software Used</label>
                  <select
                    value={softwareUsed}
                    onChange={(e) => setSoftwareUsed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="Premiere Pro">Premiere Pro</option>
                    <option value="DaVinci Resolve">DaVinci Resolve</option>
                    <option value="After Effects">After Effects</option>
                    <option value="CapCut">CapCut</option>
                    <option value="Blender">Blender</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Techniques Checklist */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Techniques Applied</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-800/60 border border-slate-700">
                  {EDITING_ROADMAP_TOPICS.map((tech) => (
                    <label key={tech} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTechniques.includes(tech)}
                        onChange={() => handleToggleTechnique(tech)}
                        className="rounded border-slate-700 text-primary focus:ring-0"
                      />
                      <span>{tech}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Time Spent (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="600"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(Number(e.target.value))}
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
                <label className="text-xs text-slate-400 block mb-1">Thumbnail Image URL (Optional)</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Portfolio / Video Link (Optional)</label>
                <input
                  type="url"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Worked on speed ramping transitions..."
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Practice Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 dark:bg-dark-card border border-slate-800 p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Log Video Editing Practice Session
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Awards <span className="text-primary font-bold">+15 XP</span> for active timeline craft.
            </p>
            <form onSubmit={handleLogEditingSession} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Software</label>
                <select
                  value={sessionSoftware}
                  onChange={(e) => setSessionSoftware(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="Premiere Pro">Premiere Pro</option>
                  <option value="DaVinci Resolve">DaVinci Resolve</option>
                  <option value="After Effects">After Effects</option>
                  <option value="CapCut">CapCut</option>
                  <option value="Blender">Blender</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Practice Duration (Minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="300"
                  value={sessionMinutes}
                  onChange={(e) => setSessionMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white shadow-sm"
                >
                  Claim 15 XP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

