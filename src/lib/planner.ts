// DUO OS — Constraint-Based & AI Daily Planning Engine
import { Task, UserProfile, TimetableEntry, FixedCommitments } from './types';

export interface TimeSlot {
  start: string; // 'HH:mm'
  end: string; // 'HH:mm'
  durationMinutes: number;
  label: string;
  isFixed: boolean;
  type: 'college' | 'gym' | 'tuition' | 'sleep' | 'meal' | 'study' | 'buffer';
}

export interface ProposedPlanItem {
  taskId: string;
  taskTitle: string;
  category: string;
  priority: string;
  start: string;
  end: string;
  durationMinutes: number;
  reason: string;
  isLocked: boolean;
}

export interface PlanGenerationResult {
  date: string;
  allocatedTasks: ProposedPlanItem[];
  unallocatedTasks: Task[];
  fixedSlots: TimeSlot[];
  totalStudyMinutes: number;
  strategySummary: string;
  usedAiProvider: boolean;
}

// Convert "HH:mm" to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

// Convert minutes from midnight to "HH:mm"
export function minutesToTime(mins: number): string {
  const normalized = Math.max(0, Math.min(23 * 60 + 59, mins));
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function getFixedSlotsForDay(
  profile: UserProfile,
  dateStr: string,
  timetable: TimetableEntry[]
): TimeSlot[] {
  const d = new Date(dateStr);
  const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon, ...
  const fc = profile.fixedCommitments;
  const slots: TimeSlot[] = [];

  // 1. Protected Sleep
  const sleepStartM = timeToMinutes(fc.protectedSleepStart);
  slots.push({
    start: fc.protectedSleepStart,
    end: '23:59',
    durationMinutes: 1440 - sleepStartM,
    label: 'Protected Sleep Hours',
    isFixed: true,
    type: 'sleep'
  });
  const sleepEndM = timeToMinutes(fc.protectedSleepEnd);
  if (sleepEndM > 0) {
    slots.push({
      start: '00:00',
      end: fc.protectedSleepEnd,
      durationMinutes: sleepEndM,
      label: 'Protected Sleep Hours',
      isFixed: true,
      type: 'sleep'
    });
  }

  // 2. Gym / Fitness
  if (fc.gymEnabled) {
    const gymStartM = timeToMinutes(fc.gymTime);
    const gymEndM = gymStartM + fc.gymDurationMinutes;
    slots.push({
      start: fc.gymTime,
      end: minutesToTime(gymEndM),
      durationMinutes: fc.gymDurationMinutes,
      label: 'Morning Gym & Physical Training',
      isFixed: true,
      type: 'gym'
    });
  }

  // 3. College Hours
  // For User A: 6 days (Mon-Sat, dayOfWeek 1-6)
  // For User B: 3 specific days (default Mon, Wed, Fri: 1, 3, 5)
  let isCollegeDay = false;
  if (profile.studentPersona === 'user_a') {
    isCollegeDay = dayOfWeek >= 1 && dayOfWeek <= 6;
  } else {
    const specificDays = fc.collegeSpecificDays || [1, 3, 5];
    isCollegeDay = specificDays.includes(dayOfWeek);
  }

  if (isCollegeDay) {
    // Check specific timetable lectures or general block
    const dayTimetable = timetable.filter(t => t.dayOfWeek === dayOfWeek && t.userId === profile.id);
    if (dayTimetable.length > 0) {
      dayTimetable.forEach(item => {
        const startM = timeToMinutes(item.startTime);
        const endM = timeToMinutes(item.endTime);
        slots.push({
          start: item.startTime,
          end: item.endTime,
          durationMinutes: endM - startM,
          label: `${item.subjectName} (${item.isLab ? 'Lab' : 'Lecture'}${item.room ? ` • ${item.room}` : ''})`,
          isFixed: true,
          type: 'college'
        });
      });
    } else {
      const colStartM = timeToMinutes(fc.collegeStartTime);
      const colEndM = timeToMinutes(fc.collegeEndTime);
      slots.push({
        start: fc.collegeStartTime,
        end: fc.collegeEndTime,
        durationMinutes: colEndM - colStartM,
        label: `${profile.collegeName || 'College'} Full Day Academic Schedule`,
        isFixed: true,
        type: 'college'
      });
    }

    // Commute buffer
    if (fc.travelBufferMinutes > 0) {
      const colStartM = timeToMinutes(fc.collegeStartTime);
      slots.push({
        start: minutesToTime(colStartM - fc.travelBufferMinutes),
        end: fc.collegeStartTime,
        durationMinutes: fc.travelBufferMinutes,
        label: 'Travel to College',
        isFixed: true,
        type: 'buffer'
      });
    }
  }

  // 4. Tuition Teaching (User A)
  if (fc.tuitionEnabled && dayOfWeek >= 1 && dayOfWeek <= 6) {
    const tuiStartM = timeToMinutes(fc.tuitionStartTime);
    const tuiEndM = timeToMinutes(fc.tuitionEndTime);
    slots.push({
      start: fc.tuitionStartTime,
      end: fc.tuitionEndTime,
      durationMinutes: tuiEndM - tuiStartM,
      label: 'Tuition Batch Teaching & Mentorship',
      isFixed: true,
      type: 'tuition'
    });

    // Dinner / buffer after tuition
    slots.push({
      start: fc.tuitionEndTime,
      end: minutesToTime(tuiEndM + fc.mealBreakMinutes),
      durationMinutes: fc.mealBreakMinutes,
      label: 'Dinner & Evening Decompression Break',
      isFixed: true,
      type: 'meal'
    });
  } else {
    // Normal dinner break for User B / weekends
    slots.push({
      start: '19:45',
      end: '20:30',
      durationMinutes: 45,
      label: 'Dinner & Rest Break',
      isFixed: true,
      type: 'meal'
    });
  }

  // Sort slots by start time
  return slots.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
}

// Find contiguous available study windows
export function findAvailableFreeWindows(fixedSlots: TimeSlot[]): { start: number; end: number; duration: number }[] {
  // Sort and merge overlapping fixed intervals
  const intervals: { start: number; end: number }[] = fixedSlots.map(s => ({
    start: timeToMinutes(s.start),
    end: timeToMinutes(s.end)
  })).sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number }[] = [];
  for (const iv of intervals) {
    if (merged.length === 0) {
      merged.push({ ...iv });
    } else {
      const last = merged[merged.length - 1];
      if (iv.start <= last.end) {
        last.end = Math.max(last.end, iv.end);
      } else {
        merged.push({ ...iv });
      }
    }
  }

  // Invert intervals between 00:00 (0) and 24:00 (1440)
  const freeWindows: { start: number; end: number; duration: number }[] = [];
  let currentCursor = 0;

  for (const block of merged) {
    if (block.start > currentCursor) {
      const freeDur = block.start - currentCursor;
      if (freeDur >= 20) { // minimum 20 minutes to be a viable study block
        freeWindows.push({
          start: currentCursor,
          end: block.start,
          duration: freeDur
        });
      }
    }
    currentCursor = Math.max(currentCursor, block.end);
  }

  if (currentCursor < 1440) {
    const freeDur = 1440 - currentCursor;
    if (freeDur >= 20) {
      freeWindows.push({
        start: currentCursor,
        end: 1440,
        duration: freeDur
      });
    }
  }

  return freeWindows;
}

// Rule-based schedule generator respecting all constraints
export function generateSmartSchedule(
  profile: UserProfile,
  tasks: Task[],
  timetable: TimetableEntry[],
  dateStr: string,
  energyLevel: number = 4
): PlanGenerationResult {
  const fixedSlots = getFixedSlotsForDay(profile, dateStr, timetable);
  const freeWindows = findAvailableFreeWindows(fixedSlots);

  // Filter tasks eligible for today
  const pendingTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'skipped');

  // Separate locked tasks with existing schedules
  const allocatedItems: ProposedPlanItem[] = [];
  const remainingTasks: Task[] = [];

  for (const task of pendingTasks) {
    if (task.isLocked && task.scheduledStart && task.scheduledEnd) {
      allocatedItems.push({
        taskId: task.id,
        taskTitle: task.title,
        category: task.category,
        priority: task.priority,
        start: task.scheduledStart,
        end: task.scheduledEnd,
        durationMinutes: task.estimatedMinutes || 45,
        reason: 'Locked by student at specified time block',
        isLocked: true
      });
    } else {
      remainingTasks.push(task);
    }
  }

  // Sort remaining tasks by priority and energy fit
  // Priority order: urgent -> high -> medium -> low
  const priorityWeight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
  remainingTasks.sort((a, b) => {
    const pw = (priorityWeight[b.priority] || 1) - (priorityWeight[a.priority] || 1);
    if (pw !== 0) return pw;
    // CAT & DSA get top weight if high energy
    if (energyLevel >= 4) {
      const isAHeavy = a.category === 'dsa' || a.category === 'cat';
      const isBHeavy = b.category === 'dsa' || b.category === 'cat';
      if (isAHeavy && !isBHeavy) return -1;
      if (!isAHeavy && isBHeavy) return 1;
    }
    return (a.estimatedMinutes || 45) - (b.estimatedMinutes || 45);
  });

  // Pack tasks into free windows
  const unallocated: Task[] = [];
  let totalStudyMins = 0;

  // Clone free windows so we can subdivide them
  const windows = freeWindows.map(w => ({ ...w }));

  for (const task of remainingTasks) {
    const taskDuration = Math.min(task.estimatedMinutes || 45, 90); // Cap single block at 90m for cognitive stamina
    let placed = false;

    for (const win of windows) {
      if (win.duration >= taskDuration) {
        const itemStart = win.start;
        const itemEnd = win.start + taskDuration;

        let reason = `Allocated during peak focus window.`;
        if (profile.studentPersona === 'user_a') {
          if (itemStart >= 1200) { // After 20:00
            reason = `Prime evening deep-work slot after tuition and dinner.`;
          } else if (itemStart < 480) {
            reason = `Morning pre-college sprint slot.`;
          }
        } else {
          reason = `Uninterrupted focused study block for ${task.category.toUpperCase()} goals.`;
        }

        allocatedItems.push({
          taskId: task.id,
          taskTitle: task.title,
          category: task.category,
          priority: task.priority,
          start: minutesToTime(itemStart),
          end: minutesToTime(itemEnd),
          durationMinutes: taskDuration,
          reason,
          isLocked: false
        });

        totalStudyMins += taskDuration;

        // Shrink window with 5 min buffer
        win.start = itemEnd + 5;
        win.duration = Math.max(0, win.end - win.start);
        placed = true;
        break;
      }
    }

    if (!placed) {
      unallocated.push(task);
    }
  }

  // Sort allocated items chronologically
  allocatedItems.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

  const strategySummary = profile.studentPersona === 'user_a'
    ? `Configured around 5:30 AM gym, 6-day college schedule, and 5:30–8:00 PM tuition. High-cognition DSA & academics placed in the 20:30–22:45 post-dinner study block.`
    : `Designed for CAT Nov 2026 sprint, Deep Learning lab credits, and placement preparation with structured 45–90 min deep focus intervals.`;

  return {
    date: dateStr,
    allocatedTasks: allocatedItems,
    unallocatedTasks: unallocated,
    fixedSlots,
    totalStudyMinutes: totalStudyMins,
    strategySummary,
    usedAiProvider: false
  };
}
