// LEVEL UP 73 - Sidebar Navigation Component
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Code2,
  Film,
  Mic,
  Dumbbell,
  Globe,
  BarChart3,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Target,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { calculateLevel } from '../../utils/xpSystem';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAchievements?: () => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/academics', label: 'Academics', icon: GraduationCap },
  { to: '/dsa', label: 'DSA Tracker', icon: Code2, badge: '100 Target' },
  { to: '/editing', label: 'Editing Tracker', icon: Film, badge: '8 Target' },
  { to: '/english', label: 'English Tracker', icon: Mic },
  { to: '/gym', label: 'Gym Tracker', icon: Dumbbell },
  { to: '/web', label: 'Web Designing', icon: Globe, badge: '3 Projects' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/calendar', label: 'Calendar & Planner', icon: Calendar },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onOpenAchievements,
}) => {
  const { user } = useAuth();
  const levelInfo = calculateLevel(user?.current_xp || 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900/95 dark:bg-dark-secondary/95 border-r border-slate-800 dark:border-dark-border text-slate-300 transition-all duration-300 backdrop-blur-xl ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo & Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 dark:border-dark-border/80">
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-indigo-600 to-secondary flex items-center justify-center shadow-glow-primary flex-shrink-0 transition-transform group-hover:scale-105">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <div className="text-sm font-black tracking-wider text-white font-mono flex items-center gap-1.5">
                  LEVEL UP <span className="text-primary font-extrabold text-base">73</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Personal Mastery
                </div>
              </div>
            )}
          </NavLink>

          {/* Close button for mobile, Collapse button for desktop */}
          <div className="flex items-center">
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 dark:hover:bg-dark-card transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-primary text-white shadow-glow-primary'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 dark:hover:bg-dark-card/80'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110`} />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800/80 dark:bg-dark-card text-primary border border-primary/20">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Gamer Progression Card */}
        <div
          onClick={onOpenAchievements}
          className="p-3 border-t border-slate-800 dark:border-dark-border/80 cursor-pointer hover:bg-slate-800/40 transition-colors"
          title="Open Trophy Room & Badges"
        >
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-slate-800/50 dark:bg-dark-card/90 border border-slate-700/60 dark:border-dark-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-secondary" />
                  LVL {levelInfo.level}
                </span>
                <span className="text-[11px] font-mono text-primary font-bold">
                  {user?.current_xp || 0} XP
                </span>
              </div>

              <div className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                {levelInfo.title}
              </div>

              {/* Progress Bar to next level */}
              <div className="mt-2.5">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Next Level</span>
                  <span>{levelInfo.progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-700/50 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/50 dark:bg-dark-card">
              <span className="text-[10px] font-bold text-secondary">LVL {levelInfo.level}</span>
              <div className="w-8 h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

