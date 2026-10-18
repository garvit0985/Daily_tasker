// DUO OS — Comprehensive Type Definitions

export type StudentPersona = 'user_a' | 'user_b';

export interface FixedCommitments {
  gymEnabled: boolean;
  gymTime: string; // '05:30'
  gymDurationMinutes: number; // 60
  collegeDaysPerWeek: number; // 6 for A, 3 for B
  collegeSpecificDays?: number[]; // [1, 3, 5] for Mon, Wed, Fri
  collegeStartTime: string; // '08:00'
  collegeEndTime: string; // '17:30'
  tuitionEnabled: boolean; // User A true
  tuitionStartTime: string; // '17:30'
  tuitionEndTime: string; // '20:00'
  sleepTargetHours: number; // 7.5
  protectedSleepStart: string; // '23:00'
  protectedSleepEnd: string; // '05:00'
  travelBufferMinutes: number; // 30
  mealBreakMinutes: number; // 45
}

export interface ThemePreference {
  mode: 'dark' | 'light' | 'system';
  accent: 'violet' | 'indigo' | 'mint' | 'sky' | 'coral';
  reducedMotion: boolean;
  backgroundPattern?: 'none' | 'mesh' | 'grid' | 'dots';
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  studentPersona: StudentPersona;
  degreeProgram: string;
  yearOfStudy: number;
  collegeName: string;
  avatarUrl: string;
  bio: string;
  fixedCommitments: FixedCommitments;
  themePreference: ThemePreference;
  priorities: string[];
  createdAt: string;
}

export type TaskCategory =
  | 'academics'
  | 'dsa'
  | 'cat'
  | 'gate'
  | 'career'
  | 'tuition'
  | 'fitness'
  | 'personal';

export type TaskStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  userId: string;
  workspaceId?: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  estimatedMinutes: number;
  actualMinutes: number;
  isLocked: boolean;
  isPrivate: boolean;
  subjectId?: string;
  subjectName?: string;
  scheduledDate?: string;
  scheduledStart?: string; // 'HH:mm'
  scheduledEnd?: string; // 'HH:mm'
  orderIndex: number;
  completedAt?: string;
  createdAt: string;
}

export interface TimetableEntry {
  id: string;
  userId: string;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  subjectCode: string;
  subjectName: string;
  faculty?: string;
  room?: string;
  isLab: boolean;
  startTime: string; // '08:00'
  endTime: string; // '09:00'
}

export interface SyllabusTopic {
  id: string;
  subjectId: string;
  unitNumber: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  revisionCount: number;
  lastRevisedAt?: string;
  notes?: string;
}

export interface Subject {
  id: string;
  userId: string;
  code: string;
  title: string;
  credits: number;
  professor?: string;
  colorCode: string;
  topics: SyllabusTopic[];
}

export type ExamType = 'CAT_2026' | 'GATE_CS' | 'GATE_DA' | 'CAT_2027' | 'SEMESTER_FINALS';

export interface ExamGoal {
  id: string;
  userId: string;
  examType: ExamType;
  title: string;
  examDate: string; // YYYY-MM-DD
  targetScore?: number;
  targetPercentile?: number;
  isCompleted: boolean;
  notes?: string;
}

export interface MockTest {
  id: string;
  examId?: string;
  userId: string;
  title: string;
  testSeries: string;
  dateTaken: string; // YYYY-MM-DD
  sectionBreakdown: {
    qa: number;
    varc: number;
    dilr: number;
  };
  totalScore: number;
  percentile?: number;
  accuracyPercent: number;
  weakTopics: string[];
  timeSpentMinutes: number;
  notes?: string;
}

export type SixCategory =
  | 'cat'
  | 'gate'
  | 'dsa'
  | 'job_apply'
  | 'academics'
  | 'entertainment';

export type FocusModeType = 'pomodoro_25' | 'deep_50' | 'custom';

export interface FocusSession {
  id: string;
  userId: string;
  workspaceId?: string;
  category?: SixCategory;
  reason?: string;
  taskId?: string;
  taskTitle?: string;
  subjectName?: string;
  durationMinutes: number;
  mode: FocusModeType;
  ambientSound: string;
  sharedWithPartner: boolean;
  completedAt: string;
}

export type MoodType =
  | 'happy'
  | 'focused'
  | 'motivated'
  | 'tired'
  | 'stressed'
  | 'low'
  | 'need_break';

export interface MoodUpdate {
  id: string;
  userId: string;
  userName: string;
  mood: MoodType;
  energyLevel: number; // 1 to 5
  message?: string;
  isPrivate: boolean;
  createdAt: string;
}

export type ActivityEventType =
  | 'task_completed'
  | 'task_rescheduled'
  | 'focus_started'
  | 'focus_ended'
  | 'mood_updated'
  | 'job_applied'
  | 'mock_submitted'
  | 'syllabus_updated'
  | 'timetable_updated';

export interface ActivityEvent {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userPersona: StudentPersona;
  eventType: ActivityEventType;
  summary: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type JobRoleCategory =
  | 'software_dev'
  | 'data_science'
  | 'ai_ml'
  | 'data_analyst'
  | 'general_fresher';

export type JobStatus =
  | 'saved'
  | 'interested'
  | 'preparing'
  | 'applied'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface JobOpportunity {
  id: string;
  companyName: string;
  jobTitle: string;
  roleCategory: JobRoleCategory;
  targetPersona: 'user_a' | 'user_b' | 'both';
  requiredSkills: string[];
  eligibilityCriteria: string;
  location: string;
  workMode: 'remote' | 'hybrid' | 'on_site';
  compensation?: string;
  officialUrl: string;
  source: string;
  isVerified: boolean;
  deadline?: string;
  lastChecked: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  opportunityId?: string;
  companyName: string;
  jobTitle: string;
  roleCategory: JobRoleCategory;
  status: JobStatus;
  appliedDate?: string;
  resumeVersion?: string;
  assessmentDate?: string;
  interviewDate?: string;
  followUpDate?: string;
  compensation?: string;
  officialUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline' | 'partner_update' | 'schedule_buffer' | 'job_alert' | 'exam_milestone';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface WeeklyReview {
  id: string;
  userId: string;
  weekStartDate: string; // YYYY-MM-DD
  wentWell: string;
  remainingIncomplete: string;
  topicsNeedingAttention: string;
  wasScheduleRealistic: boolean;
  scheduleFeedback: string;
  nextWeekPriorities: [string, string, string];
  rating: number; // 1 to 5
  createdAt: string;
}

export interface SharedWorkspace {
  id: string;
  name: string;
  inviteCode: string;
  createdAt: string;
}
