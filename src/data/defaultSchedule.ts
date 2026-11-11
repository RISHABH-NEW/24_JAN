// LEVEL UP 73 - Default Routine and Exam Mode Schedule Configurations
import { ExamMode, ScheduleSlot } from '../types';

export const DEFAULT_SCHEDULE: ScheduleSlot[] = [
  {
    id: 'slot-1',
    timeRange: '07:00 AM - 08:00 AM',
    activity: 'Gym & Physical Conditioning',
    category: 'gym',
    defaultDescription: 'Strength training, hypertrophy, compound movements & core',
    examModeAdjustments: {
      normal: 'Full 60-min session: Push / Pull / Legs routine',
      put: 'Shortened 30-min active recovery / light workout',
      practical: 'Shortened 35-min workout to maintain high energy',
      end_sem: '30-min high-efficiency session or brisk cardio'
    }
  },
  {
    id: 'slot-2',
    timeRange: '08:00 AM - 05:00 PM',
    activity: 'College & Lectures',
    category: 'academics',
    defaultDescription: 'Lectures, academic labs, coursework & college commitments',
    examModeAdjustments: {
      normal: 'Attend classes, take active notes & clarify doubts with professors',
      put: 'Focus on PUT preparation, syllabus review during breaks',
      practical: 'Lab practical file submission & viva voce preparation',
      end_sem: 'Dedicated study leave or high-focus exam hall revision'
    }
  },
  {
    id: 'slot-3',
    timeRange: '05:30 PM - 06:45 PM',
    activity: 'DSA Problem Solving',
    category: 'dsa',
    defaultDescription: 'Targeted algorithm & data structure practice (LeetCode / GFG)',
    examModeAdjustments: {
      normal: 'Deep solve: 2-3 new medium/hard problems with time complexity analysis',
      put: 'Maintenance mode: 1 standard problem or quick revision of previously solved patterns',
      practical: 'Maintenance mode: 1 problem to keep the algorithmic streak alive',
      end_sem: 'Maintenance mode: 1 revision problem only (30 mins max)'
    }
  },
  {
    id: 'slot-4',
    timeRange: '06:45 PM - 08:00 PM',
    activity: 'Web Designing & Full-Stack Dev',
    category: 'web',
    defaultDescription: 'Milestone projects: Portfolio, Landing Page, Multi-page Web App',
    examModeAdjustments: {
      normal: 'Active UI building, component crafting & API integration',
      put: 'Replaced with 1 hr Academic PUT subject deep-dive',
      practical: 'Replaced with Academic Lab syllabus / viva questions',
      end_sem: 'Replaced with End-Sem High-Yield Question Bank preparation'
    }
  },
  {
    id: 'slot-5',
    timeRange: '08:30 PM - 09:00 PM',
    activity: 'English Communication Practice',
    category: 'english',
    defaultDescription: '5-10 min impromptu speaking challenge, vocabulary & daily journal',
    examModeAdjustments: {
      normal: 'Impromptu speaking without script, record audio & log 3 new words',
      put: 'Short 15-min speaking recap of academic concepts in English',
      practical: '15-min technical viva practice in fluent English',
      end_sem: '15-min relaxation journal & quick vocabulary review'
    }
  },
  {
    id: 'slot-6',
    timeRange: '09:00 PM - 10:00 PM',
    activity: 'Video Editing & Creative Craft',
    category: 'editing',
    defaultDescription: 'Timeline cuts, motion graphics, audio syncing & color grading',
    examModeAdjustments: {
      normal: 'Project work: Premiere / DaVinci edits & storytelling techniques',
      put: 'Replaced with Academic PUT Unit revision & formula sheets',
      practical: 'Replaced with Practical code/experiment writeups',
      end_sem: 'Replaced with High-Priority End-Sem subject problem solving'
    }
  },
  {
    id: 'slot-7',
    timeRange: '10:00 PM - 11:00 PM',
    activity: 'Academic Revision & Next-Day Planning',
    category: 'academics',
    defaultDescription: 'Consolidate today’s topics, review syllabus tracker & prepare for tomorrow',
    examModeAdjustments: {
      normal: 'Standard daily revision of lecture notes & upcoming assignment prep',
      put: 'Intensive PUT preparation: solve previous years question papers',
      practical: 'Lab viva questions & practical notebook validation',
      end_sem: 'Intensive End-Sem revision: mock exam timer & high-weightage units'
    }
  }
];

export const EXAM_MODES_CONFIG: Record<ExamMode, {
  name: string;
  badge: string;
  color: string;
  description: string;
  planningDurationDays: number;
  priorityWeights: Record<string, string>;
}> = {
  normal: {
    name: 'Normal Mode',
    badge: 'Balanced Growth',
    color: 'from-blue-600 to-indigo-600',
    description: 'Balanced routine across all 5 skills and regular college academics.',
    planningDurationDays: 0,
    priorityWeights: {
      Academics: 'Normal (1 hr/day)',
      DSA: 'High (1.25 hrs/day)',
      'Web Dev': 'High (1.25 hrs/day)',
      English: 'Regular (30 mins/day)',
      Editing: 'Regular (1 hr/day)',
      Gym: 'Full (1 hr/day)'
    }
  },
  put: {
    name: 'PUT Mode',
    badge: 'Internal Exam Focus',
    color: 'from-amber-600 to-orange-600',
    description: 'Pre-University Test mode. Academic revision boosted to 3+ hours; editing & web paused.',
    planningDurationDays: 7,
    priorityWeights: {
      Academics: 'CRITICAL (3-4 hrs/day)',
      DSA: 'Maintenance (1 problem)',
      'Web Dev': 'Paused / Substituted',
      English: 'Quick Habit (15 mins)',
      Editing: 'Paused / Substituted',
      Gym: 'Short Recovery (30 mins)'
    }
  },
  practical: {
    name: 'Practical Mode',
    badge: 'Lab & Viva Focus',
    color: 'from-emerald-600 to-teal-600',
    description: 'Practical Exams & Lab Viva mode. Hands-on coding, viva prep & lab manuals prioritized.',
    planningDurationDays: 4,
    priorityWeights: {
      Academics: 'HIGH - Practical & Viva (3 hrs/day)',
      DSA: 'Maintenance (1 problem)',
      'Web Dev': 'Reduced / Viva-aligned',
      English: 'Technical Speaking (15 mins)',
      Editing: 'Paused',
      Gym: 'Short Workout (35 mins)'
    }
  },
  end_sem: {
    name: 'End-Sem Mode',
    badge: 'Maximum Academic Focus',
    color: 'from-rose-600 to-red-600',
    description: 'End-Semester University Exams mode. Absolute academic priority; maximum study hours.',
    planningDurationDays: 10,
    priorityWeights: {
      Academics: 'MAXIMUM (4-5 hrs/day)',
      DSA: 'Maintenance Streak only (20-30 mins)',
      'Web Dev': 'Paused',
      English: 'Night Journal / Relaxation (15 mins)',
      Editing: 'Paused',
      Gym: 'Mental De-stress (30 mins)'
    }
  }
};

