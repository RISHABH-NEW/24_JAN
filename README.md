# ⚡ LEVEL UP 73
### Personal Transformation & Productivity Tracking Platform
**Designed for Rishabh | Challenge Window: 11 November 2026 – 23 January 2027 (73-Day Mastery Challenge)**

---

## 🌟 Overview

**LEVEL UP 73** is a high-performance, full-stack personal transformation and productivity tracking web application built with **React, Vite, TypeScript, Tailwind CSS, Recharts, and Supabase PostgreSQL**.

The application is purpose-built to help a dedicated engineering student named **Rishabh** manage college academics and examinations (Internal PUT exams, Lab Practicals, and End-Semester finals) while systematically leveling up across five high-leverage digital and physical disciplines:
1. **Academics Management**: PUT Exams (7d est.), Lab Practicals (4d est.), End-Semesters (10d est.), subject syllabi, unit topics, revision cycles, and marks.
2. **DSA Tracker**: 13 core topics (Complexity, Arrays, Strings, Searching, Sorting, Recursion, Linked Lists, Stacks, Queues, Hashing, Trees, Graphs, DP), target of 100 quality problems by 23 January 2027, spaced-repetition revision queue, and complexity notes.
3. **Video Editing Studio**: 10-technique roadmap, project gallery with thumbnail previews, Premiere Pro / DaVinci / After Effects project logs, target of 8 polished projects.
4. **English Communication Lab**: Impromptu speaking challenge stopwatch with 5–10 minute goal benchmarks, active vocabulary bank with phonetic pronunciations, session recordings, and fluency ratings.
5. **Gym & Fitness Dashboard**: Daily workout logging (Push/Pull/Legs/Upper/Lower/Core), sets, reps, weight lifted (kg), personal records (PRs), rest day management, and body weight progression charts.
6. **Web Designing & Full-Stack Track**: 11-topic checklist, 3 core project milestones (Portfolio, SaaS Landing Page, Multi-Page Web App) with GitHub and live deployment links.

---

## 🎮 Gamification & Exam Mode Engine

- **Gamer Leveling & XP**: Earn verified XP on completing tasks and milestones (+25 XP per DSA problem, +100 XP per editing project, +150 XP per web milestone, +20 XP per workout/study session, +30 XP per 9 PM review). Quadratic leveling formula with custom level titles up to *Level 73 Legend*. Duplicate XP prevention ensures integrity.
- **Adaptive Exam Mode Protocol**:
  - **Normal Mode**: Balanced routine across all 5 skills and regular college classes.
  - **PUT Mode**: Academic study time boosted to 3+ hours daily; Video Editing & Web Dev paused; DSA shifted to single-problem streak maintenance.
  - **Practical Mode**: Lab viva voce and practical manuals prioritized; technical English communication practiced.
  - **End-Sem Mode**: Maximum academic revision hours (4–5 hrs/day); high-yield question banks prioritized.
  *Note: Switching exam modes dynamically recalibrates daily planner recommendations without deleting the original routine.*
- **9:00 PM Daily Review**: In-app debrief dialog to summarize daily wins, log roadblocks, rate energy/mood, set tomorrow's priorities, and claim +30 XP.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS (Custom Dark `#0B1020` & Light themes, glassmorphism, responsive navigation)
- **Charts & Data Visualization**: Recharts (Area charts, Bar charts, Donut distribution, Weight trendlines)
- **Icons**: Lucide React
- **Routing**: React Router DOM (Protected routes & clean URLs)
- **Forms & Validation**: React Hook Form + Zod
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) + LocalStorage hybrid persistence fallback
- **Celebration Effects**: Canvas Confetti

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+ or v11+)
- Git

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd TRACKER
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
*(If credentials are not supplied immediately, the app seamlessly runs in local persistent reactive storage mode, storing all user records, streaks, and progress reliably across browser refreshes).*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🗄️ Supabase Database Architecture & Migrations

The database includes 19 normalized relational tables equipped with PostgreSQL Row-Level Security (RLS) policies and cascade triggers.

### Running the Database Migration:
1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor**.
3. Open `supabase/schema.sql` from this repository (or click **Copy Supabase Migration SQL** in the application Settings).
4. Paste and execute the script.

### Key Database Tables:
- `profiles`: User account, level, XP, current streak, best streak, active exam mode, challenge dates.
- `user_settings`: Theme choice, notification preferences, benchmark targets, custom daily schedule JSON.
- `daily_logs`: Log date, focus minutes per discipline, reflection notes, 9 PM review data.
- `daily_tasks`: Daily task items, time blocks, category, priority, completion timestamps.
- `academic_subjects`: College courses, codes, professors, credits, priorities, target scores.
- `exams`: Exam schedules (PUT, Practical, End-Sem), countdown dates, syllabus coverage, marks.
- `syllabus_topics`: Unit breakdown, importance weights, revision count, last revised date, study resources.
- `study_sessions`: Timed academic revision logs.
- `dsa_problems`: Solved algorithmic problems, platform, 13 topics, difficulty, time/space complexity, revision queue.
- `editing_projects`: Project showcase, software used, 10 techniques learned, portfolio URLs, thumbnails.
- `english_sessions`: Speaking challenge logs, confidence scores (1-10), recording links, journal reflections.
- `vocabulary`: Lexicon bank, phonetic pronunciations, definitions, example sentences, mastery level.
- `gym_workouts`: Daily workouts, exercise sets, reps, weight lifted (kg), PR indicators, rest days.
- `body_metrics`: Body weight history (kg).
- `web_projects`: 3 core milestones, live URLs, GitHub repos, tech stack, screenshots.
- `web_topics`: 11 roadmap topics checklist.
- `achievements` & `user_achievements`: Milestones, badges, and unlock timestamps.
- `xp_transactions`: Ledger of all awarded XP ensuring no duplicate points.

---

## 📁 Project Structure

```
TRACKER/
├── index.html                 # HTML entry with custom typography & meta tags
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Design system & custom palette configuration
├── postcss.config.js          # PostCSS plugins
├── tsconfig.json              # TypeScript root configuration
├── tsconfig.app.json          # Vite TypeScript configuration
├── .env.example               # Environment variables template
├── supabase/
│   └── schema.sql             # Complete PostgreSQL schema with RLS & seed data
├── src/
│   ├── main.tsx               # App entrypoint
│   ├── App.tsx                # Route tree & context providers
│   ├── index.css              # Tailwind base, utilities & glassmorphism
│   ├── types/
│   │   └── index.ts           # Type-safe TypeScript data models
│   ├── services/
│   │   ├── supabase.ts        # Supabase client & connection status check
│   │   └── storageEngine.ts   # Unified storage engine with local & remote sync
│   ├── context/
│   │   ├── AuthContext.tsx    # Supabase Auth + local session fallback
│   │   └── ThemeContext.tsx   # Dark / Light mode toggle & persistence
│   ├── utils/
│   │   ├── dateUtils.ts       # Challenge countdown, streak, date formatting
│   │   └── xpSystem.ts        # Leveling math, XP values & level titles
│   ├── data/
│   │   └── defaultSchedule.ts # 7 AM–11 PM routine & exam mode definitions
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx     # Top navigation, countdown, exam mode pill, profile
│   │   │   ├── Sidebar.tsx    # Collapsible sidebar & gamer progression widget
│   │   │   └── Layout.tsx     # Responsive desktop / mobile shell
│   │   └── common/
│   │       ├── DailyReviewModal.tsx # 9 PM in-app debrief dialog
│   │       └── Confetti.ts    # Celebration particle effects
│   └── pages/
│       ├── Dashboard.tsx      # Overview, countdown, 6 pillars, tasks, charts
│       ├── Academics.tsx      # PUT/Practical/End-Sem, syllabus, revisions
│       ├── DSATracker.tsx     # 100-problem roadmap, 13 topics, revision queue
│       ├── EditingTracker.tsx # 8-project gallery, 10 techniques roadmap
│       ├── EnglishTracker.tsx # Impromptu speaking timer, vocabulary bank
│       ├── GymTracker.tsx     # Lifts, sets, reps, body weight trendline
│       ├── WebDesigning.tsx   # 3 milestone projects, 11 topics checklist
│       ├── Analytics.tsx      # Date-range charts, time share, skill breakdown
│       ├── CalendarPlanner.tsx# Routine blocks, exam mode adaptations
│       ├── Settings.tsx       # Profile, themes, Supabase wizard, JSON backup
│       └── Auth.tsx           # Sign In, Sign Up, and Password Reset
```

---

## 🎯 Verification & Acceptance Checklist

- [x] **User Registration & Login**: Multi-mode auth supporting Supabase Auth + preloaded demo session for Rishabh.
- [x] **Challenge Countdown**: Real-time calculation from 11 Nov 2026 to 23 Jan 2027 with remaining days and completion percentage.
- [x] **Persistent Real Data**: All dashboard metrics, progress bars, and charts dynamically compute from actual stored records.
- [x] **All Six Core Modules**: Full CRUD operations for Academics, DSA, Video Editing, English, Gym, and Web Development.
- [x] **Exam Mode Protocol**: Seamless switching between Normal, PUT, Practical, and End-Sem modes adapting the planner without data loss.
- [x] **9:00 PM Daily Review**: Interactive daily debrief dialog with win tracking, roadblocks, tomorrow's plan, and XP reward.
- [x] **Gamification System**: XP ledger, leveling thresholds, dynamic titles, and duplicate award prevention.
- [x] **Responsive Layout**: Desktop collapsible navigation, mobile responsive drawer, and Dark/Light theme switching.
- [x] **Backup & Portability**: 1-click JSON export and restore for full data disaster recovery.
