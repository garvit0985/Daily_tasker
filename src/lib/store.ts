// DUO OS — Reactive Persistent Store & Hybrid Realtime Engine
import {
  UserProfile,
  Task,
  TimetableEntry,
  Subject,
  ExamGoal,
  MockTest,
  FocusSession,
  MoodUpdate,
  ActivityEvent,
  JobOpportunity,
  JobApplication,
  NotificationItem,
  WeeklyReview,
  SharedWorkspace,
  StudentPersona,
  SixCategory
} from './types';
import {
  USER_A_PROFILE,
  USER_B_PROFILE,
  SEED_WORKSPACE,
  SEED_SUBJECTS_USER_A,
  SEED_SUBJECTS_USER_B,
  SEED_EXAMS,
  SEED_MOCKS,
  SEED_TASKS_TODAY,
  SEED_JOB_OPPORTUNITIES,
  SEED_JOB_APPLICATIONS,
  SEED_LIVE_MOODS,
  SEED_ACTIVITY_FEED,
  SEED_WEEKLY_REVIEW,
  SEED_TIMETABLE_A,
  SEED_TIMETABLE_B
} from './seedData';
import { getSupabase, isSupabaseConfigured } from './supabase';

// Storage keys
const KEY_PREFIX = 'duo_os_';
const KEY_CURRENT_PERSONA = `${KEY_PREFIX}active_persona`;
const KEY_USER_A = `${KEY_PREFIX}user_a_profile`;
const KEY_USER_B = `${KEY_PREFIX}user_b_profile`;
const KEY_WORKSPACE = `${KEY_PREFIX}workspace`;
const KEY_TASKS = `${KEY_PREFIX}tasks`;
const KEY_TIMETABLE = `${KEY_PREFIX}timetable`;
const KEY_SUBJECTS = `${KEY_PREFIX}subjects`;
const KEY_EXAMS = `${KEY_PREFIX}exams`;
const KEY_MOCKS = `${KEY_PREFIX}mocks`;
const KEY_FOCUS = `${KEY_PREFIX}focus_sessions`;
const KEY_MOODS = `${KEY_PREFIX}moods`;
const KEY_ACTIVITY = `${KEY_PREFIX}activity`;
const KEY_JOB_OPPS = `${KEY_PREFIX}job_opps`;
const KEY_JOB_APPS = `${KEY_PREFIX}job_apps`;
const KEY_NOTIFICATIONS = `${KEY_PREFIX}notifications`;
const KEY_REVIEWS = `${KEY_PREFIX}reviews`;
const KEY_PROGRESS_RESET_V2 = `${KEY_PREFIX}v2_zero_progress_reset`;

type ChangeListener = () => void;
const listeners = new Set<ChangeListener>();

// Cross-tab Broadcast Channel
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('duo_os_realtime_bus');
    broadcastChannel.onmessage = (event) => {
      // Re-trigger UI on remote tab message
      notifyListeners();
    };
  } catch (e) {
    console.warn('[DUO OS] BroadcastChannel not supported:', e);
  }
}

// Storage event listener for fallback cross-tab sync
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith(KEY_PREFIX)) {
      notifyListeners();
    }
  });
}

function notifyListeners() {
  listeners.forEach(fn => {
    try { fn(); } catch (err) { console.error(err); }
  });
}

export function subscribeToStore(listener: ChangeListener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function broadcastUpdate(type: string, payload?: any) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
    } catch (e) {
      // ignore
    }
  }
  notifyListeners();
}

function readStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Error reading key ${key}:`, e);
    return defaultValue;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing key ${key}:`, e);
  }
}

// Reset all progress to 0% across tasks, syllabus topics, mocks, focus and feed
export function resetAllProgressToZero() {
  writeStorage(KEY_TASKS, SEED_TASKS_TODAY);
  writeStorage(KEY_SUBJECTS, [...SEED_SUBJECTS_USER_A, ...SEED_SUBJECTS_USER_B]);
  writeStorage(KEY_MOCKS, []);
  writeStorage(KEY_FOCUS, []);
  writeStorage(KEY_ACTIVITY, SEED_ACTIVITY_FEED);
  writeStorage(KEY_REVIEWS, [SEED_WEEKLY_REVIEW]);
  writeStorage(KEY_MOODS, SEED_LIVE_MOODS);
  localStorage.setItem(KEY_PROGRESS_RESET_V2, 'true');
  broadcastUpdate('PROGRESS_RESET_ZERO');
}

// Initialize seed data if not present
export function initStore() {
  if (!localStorage.getItem(KEY_USER_A)) {
    writeStorage(KEY_USER_A, USER_A_PROFILE);
  } else {
    // Migration check for names
    const existingA = readStorage<UserProfile | null>(KEY_USER_A, null);
    if (existingA && (existingA.displayName === 'Aarav Sharma' || existingA.displayName === 'Aarav')) {
      existingA.displayName = 'Garvit';
      existingA.email = 'garvit.cs@duoos.internal';
      writeStorage(KEY_USER_A, existingA);
    }
  }

  if (!localStorage.getItem(KEY_USER_B)) {
    writeStorage(KEY_USER_B, USER_B_PROFILE);
  } else {
    // Migration check for names
    const existingB = readStorage<UserProfile | null>(KEY_USER_B, null);
    if (existingB && (existingB.displayName === 'Ananya Iyer' || existingB.displayName === 'Ananya')) {
      existingB.displayName = 'Bittu';
      existingB.email = 'bittu.ai@duoos.internal';
      writeStorage(KEY_USER_B, existingB);
    }
  }

  if (!localStorage.getItem(KEY_WORKSPACE)) {
    writeStorage(KEY_WORKSPACE, SEED_WORKSPACE);
  } else {
    const existingWs = readStorage<SharedWorkspace | null>(KEY_WORKSPACE, null);
    if (existingWs && existingWs.name.includes('Aarav')) {
      existingWs.name = 'DUO Central • Garvit & Bittu';
      writeStorage(KEY_WORKSPACE, existingWs);
    }
  }

  if (!localStorage.getItem(KEY_CURRENT_PERSONA)) {
    writeStorage(KEY_CURRENT_PERSONA, 'user_a');
  }

  // Automatic reset to 0% progress so the user starts with clean slate to add completed items manually
  if (!localStorage.getItem(KEY_PROGRESS_RESET_V2)) {
    resetAllProgressToZero();
  }

  if (!localStorage.getItem(KEY_TASKS)) {
    writeStorage(KEY_TASKS, SEED_TASKS_TODAY);
  }
  if (!localStorage.getItem(KEY_TIMETABLE)) {
    writeStorage(KEY_TIMETABLE, [...SEED_TIMETABLE_A, ...SEED_TIMETABLE_B]);
  }
  if (!localStorage.getItem(KEY_SUBJECTS)) {
    writeStorage(KEY_SUBJECTS, [...SEED_SUBJECTS_USER_A, ...SEED_SUBJECTS_USER_B]);
  }
  if (!localStorage.getItem(KEY_EXAMS)) {
    writeStorage(KEY_EXAMS, SEED_EXAMS);
  }
  if (!localStorage.getItem(KEY_MOCKS)) {
    writeStorage(KEY_MOCKS, SEED_MOCKS);
  }
  if (!localStorage.getItem(KEY_MOODS)) {
    writeStorage(KEY_MOODS, SEED_LIVE_MOODS);
  }
  if (!localStorage.getItem(KEY_ACTIVITY)) {
    writeStorage(KEY_ACTIVITY, SEED_ACTIVITY_FEED);
  }
  if (!localStorage.getItem(KEY_JOB_OPPS)) {
    writeStorage(KEY_JOB_OPPS, SEED_JOB_OPPORTUNITIES);
  }
  if (!localStorage.getItem(KEY_JOB_APPS)) {
    writeStorage(KEY_JOB_APPS, SEED_JOB_APPLICATIONS);
  }
  if (!localStorage.getItem(KEY_REVIEWS)) {
    writeStorage(KEY_REVIEWS, [SEED_WEEKLY_REVIEW]);
  }
  if (!localStorage.getItem(KEY_NOTIFICATIONS)) {
    const initialNotifs: NotificationItem[] = [
      {
        id: 'notif_1',
        userId: USER_A_PROFILE.id,
        title: 'Microsoft Codility Assessment',
        message: 'Upcoming online coding assessment on October 25, 2026.',
        type: 'deadline',
        isRead: false,
        actionUrl: '/career',
        createdAt: '2026-10-18T10:00:00Z'
      },
      {
        id: 'notif_2',
        userId: USER_B_PROFILE.id,
        title: 'CAT 2026: 42 Days Remaining',
        message: 'Sprint phase started: prioritize DILR set selection accuracy & QA formulas.',
        type: 'exam_milestone',
        isRead: false,
        actionUrl: '/exams',
        createdAt: '2026-10-18T08:00:00Z'
      }
    ];
    writeStorage(KEY_NOTIFICATIONS, initialNotifs);
  }
}

// Call on module load
initStore();

// ==================== PERSONA & PROFILES ====================
export function getCurrentPersona(): StudentPersona {
  return readStorage<StudentPersona>(KEY_CURRENT_PERSONA, 'user_a');
}

export function setCurrentPersona(persona: StudentPersona) {
  writeStorage(KEY_CURRENT_PERSONA, persona);
  broadcastUpdate('PERSONA_SWITCH', persona);
}

export function getUserProfile(persona: StudentPersona): UserProfile {
  if (persona === 'user_a') {
    return readStorage<UserProfile>(KEY_USER_A, USER_A_PROFILE);
  }
  return readStorage<UserProfile>(KEY_USER_B, USER_B_PROFILE);
}

export function getCurrentUser(): UserProfile {
  return getUserProfile(getCurrentPersona());
}

export function getPartnerUser(): UserProfile {
  const current = getCurrentPersona();
  return getUserProfile(current === 'user_a' ? 'user_b' : 'user_a');
}

export function updateUserProfile(profile: UserProfile) {
  if (profile.studentPersona === 'user_a') {
    writeStorage(KEY_USER_A, profile);
  } else {
    writeStorage(KEY_USER_B, profile);
  }
  broadcastUpdate('PROFILE_UPDATE', profile);
}

// ==================== SHARED WORKSPACE ====================
export function getWorkspace(): SharedWorkspace {
  return readStorage<SharedWorkspace>(KEY_WORKSPACE, SEED_WORKSPACE);
}

export function updateWorkspace(ws: SharedWorkspace) {
  writeStorage(KEY_WORKSPACE, ws);
  broadcastUpdate('WORKSPACE_UPDATE', ws);
}

// ==================== TASKS ====================
export function getTasks(userId?: string): Task[] {
  const allTasks = readStorage<Task[]>(KEY_TASKS, []);
  if (!userId) return allTasks;
  return allTasks.filter(t => t.userId === userId);
}

export function addTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
  const all = readStorage<Task[]>(KEY_TASKS, []);
  const newTask: Task = {
    ...taskData,
    id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newTask, ...all];
  writeStorage(KEY_TASKS, updated);

  // Auto record activity
  recordActivity({
    workspaceId: SEED_WORKSPACE.id,
    userId: newTask.userId,
    userName: newTask.userId === USER_A_PROFILE.id ? USER_A_PROFILE.displayName : USER_B_PROFILE.displayName,
    userPersona: newTask.userId === USER_A_PROFILE.id ? 'user_a' : 'user_b',
    eventType: 'task_completed',
    summary: `Added new task: "${newTask.title}"`
  });

  broadcastUpdate('TASK_ADD', newTask);
  return newTask;
}

export function updateTask(task: Task) {
  const all = readStorage<Task[]>(KEY_TASKS, []);
  const idx = all.findIndex(t => t.id === task.id);
  if (idx !== -1) {
    all[idx] = task;
    writeStorage(KEY_TASKS, all);
    broadcastUpdate('TASK_UPDATE', task);
  }
}

export function deleteTask(taskId: string) {
  const all = readStorage<Task[]>(KEY_TASKS, []);
  const filtered = all.filter(t => t.id !== taskId);
  writeStorage(KEY_TASKS, filtered);
  broadcastUpdate('TASK_DELETE', taskId);
}

export function toggleTaskComplete(taskId: string): Task | null {
  const all = readStorage<Task[]>(KEY_TASKS, []);
  const task = all.find(t => t.id === taskId);
  if (!task) return null;

  const isNowCompleted = task.status !== 'completed';
  task.status = isNowCompleted ? 'completed' : 'planned';
  task.completedAt = isNowCompleted ? new Date().toISOString() : undefined;

  writeStorage(KEY_TASKS, all);

  // If completed, post activity event
  if (isNowCompleted) {
    const isUserA = task.userId === USER_A_PROFILE.id;
    recordActivity({
      workspaceId: SEED_WORKSPACE.id,
      userId: task.userId,
      userName: isUserA ? 'Garvit' : 'Bittu',
      userPersona: isUserA ? 'user_a' : 'user_b',
      eventType: 'task_completed',
      summary: `Completed "${task.title}"`
    });
  }

  broadcastUpdate('TASK_TOGGLE', task);
  return task;
}

export function rescheduleTask(taskId: string, newDate: string, startTime?: string, endTime?: string) {
  const all = readStorage<Task[]>(KEY_TASKS, []);
  const task = all.find(t => t.id === taskId);
  if (task) {
    task.scheduledDate = newDate;
    task.dueDate = newDate;
    if (startTime) task.scheduledStart = startTime;
    if (endTime) task.scheduledEnd = endTime;
    writeStorage(KEY_TASKS, all);

    const isUserA = task.userId === USER_A_PROFILE.id;
    recordActivity({
      workspaceId: SEED_WORKSPACE.id,
      userId: task.userId,
      userName: isUserA ? 'Garvit' : 'Bittu',
      userPersona: isUserA ? 'user_a' : 'user_b',
      eventType: 'task_rescheduled',
      summary: `Rescheduled "${task.title}" to ${newDate} ${startTime ? `at ${startTime}` : ''}`
    });

    broadcastUpdate('TASK_RESCHEDULE', task);
  }
}

export function reorderTasks(tasks: Task[]) {
  writeStorage(KEY_TASKS, tasks);
  broadcastUpdate('TASKS_REORDER', tasks);
}

// ==================== TIMETABLE ====================
export function getTimetable(userId?: string): TimetableEntry[] {
  const all = readStorage<TimetableEntry[]>(KEY_TIMETABLE, []);
  if (!userId) return all;
  return all.filter(t => t.userId === userId);
}

export function saveTimetableEntries(newEntries: TimetableEntry[], userId: string) {
  const all = readStorage<TimetableEntry[]>(KEY_TIMETABLE, []);
  const others = all.filter(t => t.userId !== userId);
  const updated = [...others, ...newEntries];
  writeStorage(KEY_TIMETABLE, updated);

  const isUserA = userId === USER_A_PROFILE.id;
  recordActivity({
    workspaceId: SEED_WORKSPACE.id,
    userId,
    userName: isUserA ? 'Garvit' : 'Bittu',
    userPersona: isUserA ? 'user_a' : 'user_b',
    eventType: 'timetable_updated',
    summary: `Updated semester weekly timetable (${newEntries.length} lecture & lab slots)`
  });

  broadcastUpdate('TIMETABLE_UPDATE', updated);
}

// ==================== SUBJECTS & TOPICS ====================
export function getSubjects(userId?: string): Subject[] {
  const all = readStorage<Subject[]>(KEY_SUBJECTS, []);
  if (!userId) return all;
  return all.filter(s => s.userId === userId);
}

export function toggleTopicCompleted(subjectId: string, topicId: string) {
  const all = readStorage<Subject[]>(KEY_SUBJECTS, []);
  const sub = all.find(s => s.id === subjectId);
  if (sub) {
    const topic = sub.topics.find(t => t.id === topicId);
    if (topic) {
      topic.isCompleted = !topic.isCompleted;
      if (topic.isCompleted) {
        topic.revisionCount += 1;
        topic.lastRevisedAt = new Date().toISOString();

        const isUserA = sub.userId === USER_A_PROFILE.id;
        recordActivity({
          workspaceId: SEED_WORKSPACE.id,
          userId: sub.userId,
          userName: isUserA ? 'Garvit' : 'Bittu',
          userPersona: isUserA ? 'user_a' : 'user_b',
          eventType: 'syllabus_updated',
          summary: `Finished syllabus topic "${topic.title}" in ${sub.title}`
        });
      }
      writeStorage(KEY_SUBJECTS, all);
      broadcastUpdate('SUBJECTS_UPDATE', all);
    }
  }
}

export function addSubject(subject: Subject) {
  const all = readStorage<Subject[]>(KEY_SUBJECTS, []);
  const updated = [...all, subject];
  writeStorage(KEY_SUBJECTS, updated);
  broadcastUpdate('SUBJECTS_UPDATE', updated);
}

// ==================== EXAMS & MOCKS ====================
export function getExams(userId?: string): ExamGoal[] {
  const all = readStorage<ExamGoal[]>(KEY_EXAMS, []);
  if (!userId) return all;
  return all.filter(e => e.userId === userId);
}

export function updateExamGoal(exam: ExamGoal) {
  const all = readStorage<ExamGoal[]>(KEY_EXAMS, []);
  const idx = all.findIndex(e => e.id === exam.id);
  if (idx !== -1) {
    all[idx] = exam;
    writeStorage(KEY_EXAMS, all);
    broadcastUpdate('EXAMS_UPDATE', all);
  }
}

export function getMocks(userId?: string): MockTest[] {
  const all = readStorage<MockTest[]>(KEY_MOCKS, []);
  if (!userId) return all;
  return all.filter(m => m.userId === userId);
}

export function addMockTest(mockData: Omit<MockTest, 'id'>): MockTest {
  const all = readStorage<MockTest[]>(KEY_MOCKS, []);
  const newMock: MockTest = {
    ...mockData,
    id: `mock_${Date.now()}`
  };
  const updated = [newMock, ...all];
  writeStorage(KEY_MOCKS, updated);

  const isUserA = newMock.userId === USER_A_PROFILE.id;
  recordActivity({
    workspaceId: SEED_WORKSPACE.id,
    userId: newMock.userId,
    userName: isUserA ? 'Garvit' : 'Bittu',
    userPersona: isUserA ? 'user_a' : 'user_b',
    eventType: 'mock_submitted',
    summary: `Submitted ${newMock.title}: Scored ${newMock.totalScore} (${newMock.percentile}%ile)`
  });

  broadcastUpdate('MOCKS_UPDATE', updated);
  return newMock;
}

// ==================== FOCUS SESSIONS ====================
export function getFocusSessions(userId?: string): FocusSession[] {
  const all = readStorage<FocusSession[]>(KEY_FOCUS, []);
  if (!userId) return all;
  return all.filter(f => f.userId === userId);
}

export function recordFocusSession(sessionData: Omit<FocusSession, 'id' | 'completedAt'>): FocusSession {
  const all = readStorage<FocusSession[]>(KEY_FOCUS, []);
  const newSession: FocusSession = {
    ...sessionData,
    id: `focus_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    completedAt: new Date().toISOString()
  };
  const updated = [newSession, ...all];
  writeStorage(KEY_FOCUS, updated);

  const isUserA = newSession.userId === USER_A_PROFILE.id;
  const sessionLabel = newSession.reason || newSession.taskTitle || (newSession.category ? newSession.category.toUpperCase() : 'Focus Session');

  if (newSession.sharedWithPartner) {
    recordActivity({
      workspaceId: SEED_WORKSPACE.id,
      userId: newSession.userId,
      userName: isUserA ? 'Garvit' : 'Bittu',
      userPersona: isUserA ? 'user_a' : 'user_b',
      eventType: 'focus_ended',
      summary: `Completed ${newSession.durationMinutes}m [${(newSession.category || 'focus').toUpperCase()}]: "${sessionLabel}"`
    });
  }

  broadcastUpdate('FOCUS_UPDATE', newSession);
  return newSession;
}

export function deleteFocusSession(sessionId: string) {
  const all = readStorage<FocusSession[]>(KEY_FOCUS, []);
  const filtered = all.filter(s => s.id !== sessionId);
  writeStorage(KEY_FOCUS, filtered);
  broadcastUpdate('FOCUS_UPDATE', filtered);
}

export function getDailyCategoryStats(userId: string, targetDate = '2026-10-18') {
  const all = getFocusSessions(userId);
  const todaySessions = all.filter(s => s.completedAt.startsWith(targetDate) || s.completedAt.slice(0, 10) === targetDate);

  const categoryTotals: Record<SixCategory, { minutes: number; count: number; sessions: FocusSession[] }> = {
    cat: { minutes: 0, count: 0, sessions: [] },
    gate: { minutes: 0, count: 0, sessions: [] },
    dsa: { minutes: 0, count: 0, sessions: [] },
    job_apply: { minutes: 0, count: 0, sessions: [] },
    academics: { minutes: 0, count: 0, sessions: [] },
    entertainment: { minutes: 0, count: 0, sessions: [] }
  };

  todaySessions.forEach(s => {
    const cat = (s.category || 'academics') as SixCategory;
    if (categoryTotals[cat]) {
      categoryTotals[cat].minutes += s.durationMinutes;
      categoryTotals[cat].count += 1;
      categoryTotals[cat].sessions.push(s);
    }
  });

  const productiveMinutes =
    categoryTotals.cat.minutes +
    categoryTotals.gate.minutes +
    categoryTotals.dsa.minutes +
    categoryTotals.job_apply.minutes +
    categoryTotals.academics.minutes;

  const entertainmentMinutes = categoryTotals.entertainment.minutes;
  const entertainmentLimitMinutes = 60; // 1 hour max
  const entertainmentRemainingMinutes = Math.max(0, entertainmentLimitMinutes - entertainmentMinutes);
  const isEntertainmentExceeded = entertainmentMinutes > entertainmentLimitMinutes;

  return {
    categoryTotals,
    productiveMinutes,
    entertainmentMinutes,
    entertainmentLimitMinutes,
    entertainmentRemainingMinutes,
    isEntertainmentExceeded,
    todaySessions
  };
}

// ==================== MOOD & ENERGY ====================
export function getLiveMood(userId: string): MoodUpdate | undefined {
  const moods = readStorage<Record<string, MoodUpdate>>(KEY_MOODS, SEED_LIVE_MOODS);
  return moods[userId];
}

export function getAllLiveMoods(): Record<string, MoodUpdate> {
  return readStorage<Record<string, MoodUpdate>>(KEY_MOODS, SEED_LIVE_MOODS);
}

export function updateMood(update: Omit<MoodUpdate, 'id' | 'createdAt'>): MoodUpdate {
  const moods = readStorage<Record<string, MoodUpdate>>(KEY_MOODS, SEED_LIVE_MOODS);
  const newMood: MoodUpdate = {
    ...update,
    id: `mood_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  moods[update.userId] = newMood;
  writeStorage(KEY_MOODS, moods);

  if (!update.isPrivate) {
    recordActivity({
      workspaceId: SEED_WORKSPACE.id,
      userId: update.userId,
      userName: update.userName,
      userPersona: update.userId === USER_A_PROFILE.id ? 'user_a' : 'user_b',
      eventType: 'mood_updated',
      summary: `Updated mood to "${update.mood}" (Energy: ${update.energyLevel}/5)${update.message ? `: "${update.message}"` : ''}`
    });
  }

  broadcastUpdate('MOOD_UPDATE', moods);
  return newMood;
}

// ==================== ACTIVITY FEED ====================
export function getActivityFeed(): ActivityEvent[] {
  return readStorage<ActivityEvent[]>(KEY_ACTIVITY, SEED_ACTIVITY_FEED);
}

export function recordActivity(eventData: Omit<ActivityEvent, 'id' | 'timestamp'>): ActivityEvent {
  const all = readStorage<ActivityEvent[]>(KEY_ACTIVITY, SEED_ACTIVITY_FEED);
  const newEvent: ActivityEvent = {
    ...eventData,
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString()
  };
  const updated = [newEvent, ...all.slice(0, 99)]; // Keep latest 100
  writeStorage(KEY_ACTIVITY, updated);
  broadcastUpdate('ACTIVITY_UPDATE', newEvent);
  return newEvent;
}

// ==================== CAREER & APPLICATIONS ====================
export function getJobOpportunities(targetPersona?: StudentPersona): JobOpportunity[] {
  const all = readStorage<JobOpportunity[]>(KEY_JOB_OPPS, SEED_JOB_OPPORTUNITIES);
  if (!targetPersona) return all;
  return all.filter(j => j.targetPersona === targetPersona || j.targetPersona === 'both');
}

export function getJobApplications(userId?: string): JobApplication[] {
  const all = readStorage<JobApplication[]>(KEY_JOB_APPS, SEED_JOB_APPLICATIONS);
  if (!userId) return all;
  return all.filter(a => a.userId === userId);
}

export function updateJobApplication(app: JobApplication) {
  const all = readStorage<JobApplication[]>(KEY_JOB_APPS, SEED_JOB_APPLICATIONS);
  const idx = all.findIndex(a => a.id === app.id);
  if (idx !== -1) {
    all[idx] = { ...app, updatedAt: new Date().toISOString() };
    writeStorage(KEY_JOB_APPS, all);

    const isUserA = app.userId === USER_A_PROFILE.id;
    recordActivity({
      workspaceId: SEED_WORKSPACE.id,
      userId: app.userId,
      userName: isUserA ? 'Garvit' : 'Bittu',
      userPersona: isUserA ? 'user_a' : 'user_b',
      eventType: 'job_applied',
      summary: `Moved ${app.companyName} (${app.jobTitle}) status to ${app.status.toUpperCase()}`
    });

    broadcastUpdate('JOB_APP_UPDATE', all[idx]);
  }
}

export function addJobApplication(appData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>): JobApplication {
  const all = readStorage<JobApplication[]>(KEY_JOB_APPS, SEED_JOB_APPLICATIONS);
  const newApp: JobApplication = {
    ...appData,
    id: `app_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const updated = [newApp, ...all];
  writeStorage(KEY_JOB_APPS, updated);

  const isUserA = newApp.userId === USER_A_PROFILE.id;
  recordActivity({
    workspaceId: SEED_WORKSPACE.id,
    userId: newApp.userId,
    userName: isUserA ? 'Garvit' : 'Bittu',
    userPersona: isUserA ? 'user_a' : 'user_b',
    eventType: 'job_applied',
    summary: `Applied / Tracked new position: ${newApp.jobTitle} at ${newApp.companyName}`
  });

  broadcastUpdate('JOB_APP_ADD', newApp);
  return newApp;
}

// ==================== NOTIFICATIONS ====================
export function getNotifications(userId?: string): NotificationItem[] {
  const all = readStorage<NotificationItem[]>(KEY_NOTIFICATIONS, []);
  if (!userId) return all;
  return all.filter(n => n.userId === userId);
}

export function markNotificationRead(notifId: string) {
  const all = readStorage<NotificationItem[]>(KEY_NOTIFICATIONS, []);
  const notif = all.find(n => n.id === notifId);
  if (notif) {
    notif.isRead = true;
    writeStorage(KEY_NOTIFICATIONS, all);
    broadcastUpdate('NOTIFS_UPDATE', all);
  }
}

// ==================== WEEKLY REVIEWS ====================
export function getWeeklyReviews(userId?: string): WeeklyReview[] {
  const all = readStorage<WeeklyReview[]>(KEY_REVIEWS, [SEED_WEEKLY_REVIEW]);
  if (!userId) return all;
  return all.filter(r => r.userId === userId);
}

export function saveWeeklyReview(reviewData: Omit<WeeklyReview, 'id' | 'createdAt'>): WeeklyReview {
  const all = readStorage<WeeklyReview[]>(KEY_REVIEWS, []);
  const newReview: WeeklyReview = {
    ...reviewData,
    id: `review_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newReview, ...all];
  writeStorage(KEY_REVIEWS, updated);
  broadcastUpdate('REVIEWS_UPDATE', updated);
  return newReview;
}

// ==================== RESET / SEED RECOVERY ====================
export function resetToSeedData() {
  localStorage.removeItem(KEY_USER_A);
  localStorage.removeItem(KEY_USER_B);
  localStorage.removeItem(KEY_WORKSPACE);
  localStorage.removeItem(KEY_TASKS);
  localStorage.removeItem(KEY_TIMETABLE);
  localStorage.removeItem(KEY_SUBJECTS);
  localStorage.removeItem(KEY_EXAMS);
  localStorage.removeItem(KEY_MOCKS);
  localStorage.removeItem(KEY_MOODS);
  localStorage.removeItem(KEY_ACTIVITY);
  localStorage.removeItem(KEY_JOB_OPPS);
  localStorage.removeItem(KEY_JOB_APPS);
  localStorage.removeItem(KEY_REVIEWS);
  localStorage.removeItem(KEY_NOTIFICATIONS);
  initStore();
  broadcastUpdate('STORE_RESET');
}
