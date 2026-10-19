// Realistic seed data for Excel Database initial setup

export const INITIAL_USERS = [
  {
    id: 'usr_a_core_cs_2026',
    email: 'garvit.cs@duoos.internal',
    displayName: 'Garvit',
    studentPersona: 'user_a',
    degreeProgram: 'BTech in Computer Science & Engineering',
    yearOfStudy: 3,
    collegeName: 'National Institute of Technology',
    bio: '3rd-year CS student balancing daily gym, full-day college, evening tuition, and competitive programming.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_b_ds_ai_2026',
    email: 'bittu.ai@duoos.internal',
    displayName: 'Bittu',
    studentPersona: 'user_b',
    degreeProgram: 'BTech in Data Science & Artificial Intelligence',
    yearOfStudy: 4,
    collegeName: 'National Institute of Technology',
    bio: 'Final-year AI/Data Science student aiming for 99+ percentile in CAT Nov 2026, GATE DA, and tech placements.',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task_a_001',
    userId: 'usr_a_core_cs_2026',
    title: 'Operating Systems — Virtual Memory & Paging practice',
    description: 'Solve questions on page replacement algorithms (FIFO, LRU, Optimal) and TLB hit ratio calculation.',
    category: 'academics',
    status: 'planned',
    priority: 'high',
    dueDate: '2026-10-25',
    estimatedMinutes: 60,
    actualMinutes: 0,
    isLocked: false,
    isPrivate: false,
    subjectId: 'CS301',
    subjectName: 'Operating Systems',
    scheduledDate: '2026-10-20',
    scheduledStart: '20:15',
    scheduledEnd: '21:15',
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_a_002',
    userId: 'usr_a_core_cs_2026',
    title: 'LeetCode 102 — Binary Tree Level Order Traversal (BFS)',
    description: 'Solve using Queue BFS and record time/space complexity analysis.',
    category: 'dsa',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: '2026-10-21',
    estimatedMinutes: 45,
    actualMinutes: 20,
    isLocked: false,
    isPrivate: false,
    subjectId: 'DSA_CORE',
    subjectName: 'Data Structures & Algorithms',
    scheduledDate: '2026-10-20',
    scheduledStart: '21:30',
    scheduledEnd: '22:15',
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_a_003',
    userId: 'usr_a_core_cs_2026',
    title: 'Daily Evening Gym — Chest & Triceps routine',
    description: '60 minutes strength training: Bench press, incline DB press, cable tricep pushdowns.',
    category: 'fitness',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-10-19',
    estimatedMinutes: 60,
    actualMinutes: 65,
    isLocked: true,
    isPrivate: false,
    subjectId: 'FIT_01',
    subjectName: 'Fitness & Health',
    scheduledDate: '2026-10-19',
    scheduledStart: '05:30',
    scheduledEnd: '06:30',
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_b_001',
    userId: 'usr_b_ds_ai_2026',
    title: 'CAT 2026 QA — Time, Speed & Distance Advanced Drills',
    description: 'Complete 25 high-difficulty questions on circular tracks, escalators, and relative speed from TIME booklet.',
    category: 'cat',
    status: 'planned',
    priority: 'urgent',
    dueDate: '2026-10-22',
    estimatedMinutes: 90,
    actualMinutes: 0,
    isLocked: false,
    isPrivate: false,
    subjectId: 'CAT_QA',
    subjectName: 'Quantitative Aptitude',
    scheduledDate: '2026-10-20',
    scheduledStart: '10:00',
    scheduledEnd: '11:30',
    completedAt: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_b_002',
    userId: 'usr_b_ds_ai_2026',
    title: 'Deep Learning — Attention Mechanism & Transformer Architecture',
    description: 'Read Vaswani et al. 2017 paper sections 1-3; implement Scaled Dot-Product Attention in PyTorch.',
    category: 'career',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-10-24',
    estimatedMinutes: 75,
    actualMinutes: 30,
    isLocked: false,
    isPrivate: false,
    subjectId: 'AI401',
    subjectName: 'Deep Learning & Neural Networks',
    scheduledDate: '2026-10-20',
    scheduledStart: '14:00',
    scheduledEnd: '15:15',
    completedAt: null,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_FOCUS_SESSIONS = [
  {
    id: 'foc_001',
    userId: 'usr_a_core_cs_2026',
    taskTitle: 'OS Lab Thread Scheduling Implementation in C',
    category: 'academics',
    durationMinutes: 50,
    mode: 'pomodoro',
    energyScore: 4,
    focusScore: 5,
    reflectionNotes: 'Great deep focus! Solved pthread mutex race condition.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'foc_002',
    userId: 'usr_b_ds_ai_2026',
    taskTitle: 'CAT Mock Analysis — DILR Section Review',
    category: 'cat',
    durationMinutes: 60,
    mode: 'deep_work',
    energyScore: 5,
    focusScore: 5,
    reflectionNotes: 'Understood matrix puzzle arrangement mistake in set 2.',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_TIMETABLE = [
  {
    id: 'tt_a_mon_1',
    userId: 'usr_a_core_cs_2026',
    dayOfWeek: 1, // Mon
    subjectCode: 'CS301',
    subjectName: 'Operating Systems',
    faculty: 'Dr. R. K. Sharma',
    room: 'LH-302',
    isLab: false,
    startTime: '08:00',
    endTime: '09:00'
  },
  {
    id: 'tt_a_mon_2',
    userId: 'usr_a_core_cs_2026',
    dayOfWeek: 1,
    subjectCode: 'CS302',
    subjectName: 'Computer Networks',
    faculty: 'Prof. Ananya Sen',
    room: 'LH-302',
    isLab: false,
    startTime: '09:00',
    endTime: '10:00'
  },
  {
    id: 'tt_a_mon_3',
    userId: 'usr_a_core_cs_2026',
    dayOfWeek: 1,
    subjectCode: 'CS305L',
    subjectName: 'OS Lab',
    faculty: 'Dr. R. K. Sharma & TA',
    room: 'Lab-4',
    isLab: true,
    startTime: '14:00',
    endTime: '16:00'
  },
  {
    id: 'tt_b_mon_1',
    userId: 'usr_b_ds_ai_2026',
    dayOfWeek: 1,
    subjectCode: 'AI401',
    subjectName: 'Deep Learning',
    faculty: 'Dr. V. K. Raman',
    room: 'AI-Hall-1',
    isLab: false,
    startTime: '09:00',
    endTime: '10:30'
  }
];

export const INITIAL_EXAMS = [
  {
    id: 'ex_a_001',
    userId: 'usr_a_core_cs_2026',
    title: 'Mid-Term Exam: Operating Systems',
    examType: 'Midterm',
    targetScore: '85/100',
    examDate: '2026-11-12',
    status: 'Upcoming',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ex_a_002',
    userId: 'usr_a_core_cs_2026',
    title: 'Database Management Systems Lab Viva',
    examType: 'Practical',
    targetScore: '45/50',
    examDate: '2026-11-20',
    status: 'Upcoming',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ex_b_001',
    userId: 'usr_b_ds_ai_2026',
    title: 'Common Admission Test (CAT 2026)',
    examType: 'National Entrance',
    targetScore: '99.5 %ile',
    examDate: '2026-11-29',
    status: 'Target',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_SUBJECTS = [
  {
    id: 'sub_a_001',
    userId: 'usr_a_core_cs_2026',
    code: 'CS301',
    name: 'Operating Systems',
    credits: 4,
    gradeTarget: 'A+',
    totalUnits: 5,
    completedUnits: 2,
    attendancePct: 88
  },
  {
    id: 'sub_a_002',
    userId: 'usr_a_core_cs_2026',
    code: 'CS302',
    name: 'Computer Networks',
    credits: 4,
    gradeTarget: 'A',
    totalUnits: 5,
    completedUnits: 1.5,
    attendancePct: 82
  },
  {
    id: 'sub_b_001',
    userId: 'usr_b_ds_ai_2026',
    code: 'AI401',
    name: 'Deep Learning',
    credits: 4,
    gradeTarget: 'O (Outstanding)',
    totalUnits: 6,
    completedUnits: 3,
    attendancePct: 91
  }
];

export const INITIAL_ACTIVITY_FEED = [
  {
    id: 'act_001',
    userId: 'usr_a_core_cs_2026',
    actorName: 'Garvit',
    actionType: 'task_completed',
    title: 'Finished Gym Session',
    description: 'Chest & Triceps workout logged (65 mins)',
    timestamp: new Date().toISOString()
  },
  {
    id: 'act_002',
    userId: 'usr_b_ds_ai_2026',
    actorName: 'Bittu',
    actionType: 'focus_completed',
    title: 'Completed Focus Session',
    description: 'CAT DILR Mock Analysis (60 mins deep focus)',
    timestamp: new Date().toISOString()
  }
];
