// DUO OS — Comprehensive Realistic Seed Datasets (Oct 18 – Dec 31, 2026)
import {
  UserProfile,
  Task,
  TimetableEntry,
  Subject,
  ExamGoal,
  MockTest,
  JobOpportunity,
  JobApplication,
  ActivityEvent,
  MoodUpdate,
  WeeklyReview
} from './types';

export const USER_A_PROFILE: UserProfile = {
  id: 'usr_a_core_cs_2026',
  email: 'garvit.cs@duoos.internal',
  displayName: 'Garvit',
  studentPersona: 'user_a',
  degreeProgram: 'BTech in Computer Science & Engineering',
  yearOfStudy: 3,
  collegeName: 'National Institute of Technology',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: '3rd-year CS student balancing daily gym, full-day college, evening tuition teaching, and competitive programming.',
  fixedCommitments: {
    gymEnabled: true,
    gymTime: '05:30',
    gymDurationMinutes: 60,
    collegeDaysPerWeek: 6,
    collegeStartTime: '08:00',
    collegeEndTime: '17:30',
    tuitionEnabled: true,
    tuitionStartTime: '17:30',
    tuitionEndTime: '20:00',
    sleepTargetHours: 7.0,
    protectedSleepStart: '23:00',
    protectedSleepEnd: '05:00',
    travelBufferMinutes: 30,
    mealBreakMinutes: 45
  },
  themePreference: {
    mode: 'dark',
    accent: 'violet',
    reducedMotion: false,
    backgroundPattern: 'mesh'
  },
  priorities: [
    'Academics, semester coursework & lab assignments',
    'DSA practice (Daily LeetCode medium/hard & algorithms)',
    'SWE summer 2027 internship & off-campus applications',
    'Gradual long-term CAT 2027 preparation (Vedic math, QA basics)'
  ],
  createdAt: '2026-10-18T00:00:00Z'
};

export const USER_B_PROFILE: UserProfile = {
  id: 'usr_b_ds_ai_2026',
  email: 'bittu.ai@duoos.internal',
  displayName: 'Bittu',
  studentPersona: 'user_b',
  degreeProgram: 'BTech in Data Science & Artificial Intelligence',
  yearOfStudy: 4,
  collegeName: 'National Institute of Technology',
  avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  bio: 'Final-year AI/Data Science student aiming for 99+ percentile in CAT Nov 2026, GATE DA, and tech placements.',
  fixedCommitments: {
    gymEnabled: true,
    gymTime: '06:30',
    gymDurationMinutes: 45,
    collegeDaysPerWeek: 3,
    collegeSpecificDays: [1, 3, 5], // Mon, Wed, Fri
    collegeStartTime: '08:00',
    collegeEndTime: '17:30',
    tuitionEnabled: false,
    tuitionStartTime: '00:00',
    tuitionEndTime: '00:00',
    sleepTargetHours: 7.5,
    protectedSleepStart: '23:30',
    protectedSleepEnd: '06:00',
    travelBufferMinutes: 25,
    mealBreakMinutes: 45
  },
  themePreference: {
    mode: 'dark',
    accent: 'mint',
    reducedMotion: false,
    backgroundPattern: 'mesh'
  },
  priorities: [
    'Academics (Final year capstone & deep learning credits)',
    'CAT 2026 examination (November 29, 2026 — Urgent Priority)',
    'GATE Data Science & AI (GATE DA 2027 syllabus)',
    'Placement interviews, job applications & ML engineering roles'
  ],
  createdAt: '2026-10-18T00:00:00Z'
};

export const SEED_WORKSPACE = {
  id: 'ws_duo_shared_2026',
  name: 'DUO Central • Garvit & Bittu',
  inviteCode: 'DUO-2026-NIT',
  createdAt: '2026-10-18T00:00:00Z'
};

export const SEED_SUBJECTS_USER_A: Subject[] = [
  {
    id: 'sub_a_1',
    userId: USER_A_PROFILE.id,
    code: 'CS301',
    title: 'Computer Networks',
    credits: 4,
    professor: 'Dr. K. Ramanujan',
    colorCode: '#8B5CF6',
    topics: [
      { id: 'top_a_1', subjectId: 'sub_a_1', unitNumber: 1, title: 'OSI & TCP/IP Protocol Architectures', difficulty: 'easy', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_2', subjectId: 'sub_a_1', unitNumber: 2, title: 'Data Link Layer: Sliding Window & Flow Control', difficulty: 'medium', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_3', subjectId: 'sub_a_1', unitNumber: 3, title: 'Network Layer: Dijkstra, Bellman-Ford & OSPF', difficulty: 'hard', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_4', subjectId: 'sub_a_1', unitNumber: 4, title: 'Transport Layer: TCP Congestion Control & UDP Sockets', difficulty: 'medium', isCompleted: false, revisionCount: 0 }
    ]
  },
  {
    id: 'sub_a_2',
    userId: USER_A_PROFILE.id,
    code: 'CS302',
    title: 'Database Management Systems',
    credits: 4,
    professor: 'Dr. Meenakshi Sundaram',
    colorCode: '#38BDF8',
    topics: [
      { id: 'top_a_5', subjectId: 'sub_a_2', unitNumber: 1, title: 'Relational Algebra & Tuple Calculus', difficulty: 'medium', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_6', subjectId: 'sub_a_2', unitNumber: 2, title: 'Advanced SQL, Triggers & Views', difficulty: 'easy', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_7', subjectId: 'sub_a_2', unitNumber: 3, title: 'Normal Forms (1NF through BCNF, 4NF)', difficulty: 'hard', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_8', subjectId: 'sub_a_2', unitNumber: 4, title: 'ACID Properties, Concurrency Control & 2PL', difficulty: 'hard', isCompleted: false, revisionCount: 0 }
    ]
  },
  {
    id: 'sub_a_3',
    userId: USER_A_PROFILE.id,
    code: 'CS303',
    title: 'Operating Systems & Concurrency',
    credits: 4,
    professor: 'Dr. Vikramaditya Sen',
    colorCode: '#10B981',
    topics: [
      { id: 'top_a_9', subjectId: 'sub_a_3', unitNumber: 1, title: 'Process States, PCB & Context Switching', difficulty: 'easy', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_10', subjectId: 'sub_a_3', unitNumber: 2, title: 'CPU Scheduling Algorithms & POSIX Threads', difficulty: 'medium', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_11', subjectId: 'sub_a_3', unitNumber: 3, title: 'Semaphores, Monitors & Deadlock Banker’s Algo', difficulty: 'hard', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_12', subjectId: 'sub_a_3', unitNumber: 4, title: 'Virtual Memory, Demand Paging & Page Replacement', difficulty: 'hard', isCompleted: false, revisionCount: 0 }
    ]
  },
  {
    id: 'sub_a_4',
    userId: USER_A_PROFILE.id,
    code: 'CS304',
    title: 'Design & Analysis of Algorithms',
    credits: 4,
    professor: 'Dr. S. Mukherjee',
    colorCode: '#F59E0B',
    topics: [
      { id: 'top_a_13', subjectId: 'sub_a_4', unitNumber: 1, title: 'Asymptotic Notations & Master Theorem', difficulty: 'easy', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_14', subjectId: 'sub_a_4', unitNumber: 2, title: 'Divide & Conquer: Strassen & Closest Pair', difficulty: 'medium', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_15', subjectId: 'sub_a_4', unitNumber: 3, title: 'Dynamic Programming: MCM, Knapsack & Tree DP', difficulty: 'hard', isCompleted: false, revisionCount: 0 },
      { id: 'top_a_16', subjectId: 'sub_a_4', unitNumber: 4, title: 'NP-Completeness: 3-SAT Reduction & Vertex Cover', difficulty: 'hard', isCompleted: false, revisionCount: 0 }
    ]
  }
];

export const SEED_SUBJECTS_USER_B: Subject[] = [
  {
    id: 'sub_b_1',
    userId: USER_B_PROFILE.id,
    code: 'AI401',
    title: 'Deep Learning & Neural Architectures',
    credits: 4,
    professor: 'Dr. R. Banerjee',
    colorCode: '#10B981',
    topics: [
      { id: 'top_b_1', subjectId: 'sub_b_1', unitNumber: 1, title: 'Backprop & Optimizer Mathematics (Adam, RMSProp)', difficulty: 'medium', isCompleted: false, revisionCount: 0 },
      { id: 'top_b_2', subjectId: 'sub_b_1', unitNumber: 2, title: 'CNNs, ResNets & Vision Transformers', difficulty: 'medium', isCompleted: false, revisionCount: 0 },
      { id: 'top_b_3', subjectId: 'sub_b_1', unitNumber: 3, title: 'Sequence Models, Multi-head Self-Attention & LLM decoders', difficulty: 'hard', isCompleted: false, revisionCount: 0 },
      { id: 'top_b_4', subjectId: 'sub_b_1', unitNumber: 4, title: 'Diffusion Models & GAN Latent Spaces', difficulty: 'hard', isCompleted: false, revisionCount: 0 }
    ]
  },
  {
    id: 'sub_b_2',
    userId: USER_B_PROFILE.id,
    code: 'AI402',
    title: 'Natural Language Processing',
    credits: 4,
    professor: 'Dr. P. Sengupta',
    colorCode: '#8B5CF6',
    topics: [
      { id: 'top_b_5', subjectId: 'sub_b_2', unitNumber: 1, title: 'Tokenization, BPE, Word2Vec & GloVe embeddings', difficulty: 'easy', isCompleted: false, revisionCount: 0 },
      { id: 'top_b_6', subjectId: 'sub_b_2', unitNumber: 2, title: 'BERT, RoBERTa & Fine-tuning Strategies', difficulty: 'medium', isCompleted: false, revisionCount: 0 },
      { id: 'top_b_7', subjectId: 'sub_b_2', unitNumber: 3, title: 'LoRA, QLoRA, RLHF & Direct Preference Optimization', difficulty: 'hard', isCompleted: false, revisionCount: 0 },
      { id: 'top_b_8', subjectId: 'sub_b_2', unitNumber: 4, title: 'RAG Architectures & Vector Database Indexing', difficulty: 'medium', isCompleted: false, revisionCount: 0 }
    ]
  },
  {
    id: 'sub_b_3',
    userId: USER_B_PROFILE.id,
    code: 'AI403',
    title: 'Big Data Systems & Cloud Analytics',
    credits: 3,
    professor: 'Dr. G. Swaminathan',
    colorCode: '#38BDF8',
    topics: [
      { id: 'top_b_9', subjectId: 'sub_b_3', unitNumber: 1, title: 'MapReduce & HDFS Distributed File Architecture', difficulty: 'easy', isCompleted: false, revisionCount: 0 },
      { id: 'top_b_10', subjectId: 'sub_b_3', unitNumber: 2, title: 'Apache Spark RDD, DataFrames & Catalyst Optimizer', difficulty: 'medium', isCompleted: false, revisionCount: 0 },
      { id: 'top_b_11', subjectId: 'sub_b_3', unitNumber: 3, title: 'Stream Processing: Kafka & Spark Streaming', difficulty: 'hard', isCompleted: false, revisionCount: 0 }
    ]
  }
];

export const SEED_EXAMS: ExamGoal[] = [
  {
    id: 'exam_cat_2026',
    userId: USER_B_PROFILE.id,
    examType: 'CAT_2026',
    title: 'Common Admission Test (CAT 2026)',
    examDate: '2026-11-29', // Sunday, Nov 29, 2026
    targetScore: 105,
    targetPercentile: 99.4,
    isCompleted: false,
    notes: 'Primary focus: Speed in DILR sets and QA arithmetic accuracy under 40-minute sectional limits.'
  },
  {
    id: 'exam_gate_da_2027',
    userId: USER_B_PROFILE.id,
    examType: 'GATE_DA',
    title: 'GATE 2027 (Data Science & AI)',
    examDate: '2027-02-07',
    targetScore: 78,
    targetPercentile: 99.8,
    isCompleted: false,
    notes: 'Secondary target after CAT: Probability, Linear Algebra, Machine Learning & Algorithms.'
  },
  {
    id: 'exam_cat_2027',
    userId: USER_A_PROFILE.id,
    examType: 'CAT_2027',
    title: 'CAT 2027 Long-Term Foundation',
    examDate: '2027-11-28',
    targetScore: 110,
    targetPercentile: 99.5,
    isCompleted: false,
    notes: '3-year gradual runway: 1 weekly quant topic + daily 30-min Aeon essay reading.'
  },
  {
    id: 'exam_gate_cs_2027',
    userId: USER_A_PROFILE.id,
    examType: 'GATE_CS',
    title: 'GATE CS 2027 Pre-Registration',
    examDate: '2027-02-13',
    targetScore: 82,
    targetPercentile: 99.7,
    isCompleted: false,
    notes: 'Core subjects alignment: OS, DBMS, DAA, Networks, TOC.'
  }
];

export const SEED_MOCKS: MockTest[] = [];

export const SEED_TASKS_TODAY: Task[] = [
  // User A Tasks (Today: Oct 18, 2026)
  {
    id: 'tsk_a_1',
    userId: USER_A_PROFILE.id,
    title: 'Gym Workout: Push & Core Routine',
    category: 'fitness',
    status: 'planned',
    priority: 'high',
    dueDate: '2026-10-18',
    estimatedMinutes: 60,
    actualMinutes: 0,
    isLocked: true,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '05:30',
    scheduledEnd: '06:30',
    orderIndex: 1,
    createdAt: '2026-10-18T05:00:00Z'
  },
  {
    id: 'tsk_a_2',
    userId: USER_A_PROFILE.id,
    title: 'College Lab: Dijkstra & Routing Protocol Simulation in C++',
    category: 'academics',
    subjectId: 'sub_a_1',
    subjectName: 'Computer Networks',
    status: 'planned',
    priority: 'urgent',
    dueDate: '2026-10-18',
    estimatedMinutes: 90,
    actualMinutes: 0,
    isLocked: true,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '14:00',
    scheduledEnd: '15:30',
    orderIndex: 2,
    createdAt: '2026-10-18T08:00:00Z'
  },
  {
    id: 'tsk_a_3',
    userId: USER_A_PROFILE.id,
    title: 'Tuition Class: Teaching Calculus & Coordinate Geometry Batch',
    category: 'tuition',
    status: 'planned',
    priority: 'high',
    dueDate: '2026-10-18',
    estimatedMinutes: 135,
    actualMinutes: 0,
    isLocked: true,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '17:30',
    scheduledEnd: '19:45',
    orderIndex: 3,
    createdAt: '2026-10-18T07:00:00Z'
  },
  {
    id: 'tsk_a_4',
    userId: USER_A_PROFILE.id,
    title: 'LeetCode Daily: Graph Shortest Path with Alternating Colors',
    category: 'dsa',
    status: 'planned',
    priority: 'urgent',
    dueDate: '2026-10-18',
    estimatedMinutes: 50,
    actualMinutes: 0,
    isLocked: false,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '20:30',
    scheduledEnd: '21:20',
    orderIndex: 4,
    createdAt: '2026-10-18T12:00:00Z'
  },
  {
    id: 'tsk_a_5',
    userId: USER_A_PROFILE.id,
    title: 'Google Summer 2027 SWE Internship: Update Resume & Submit',
    category: 'career',
    status: 'planned',
    priority: 'high',
    dueDate: '2026-10-18',
    estimatedMinutes: 40,
    actualMinutes: 0,
    isLocked: false,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '21:30',
    scheduledEnd: '22:10',
    orderIndex: 5,
    createdAt: '2026-10-18T13:00:00Z'
  },
  {
    id: 'tsk_a_6',
    userId: USER_A_PROFILE.id,
    title: 'CAT 2027 Foundation: 20 Quant Arithmetic Drills (Ratios & Percentages)',
    category: 'cat',
    status: 'planned',
    priority: 'medium',
    dueDate: '2026-10-18',
    estimatedMinutes: 35,
    actualMinutes: 0,
    isLocked: false,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '22:15',
    scheduledEnd: '22:50',
    orderIndex: 6,
    createdAt: '2026-10-18T14:00:00Z'
  },

  // User B Tasks (Today: Oct 18, 2026)
  {
    id: 'tsk_b_1',
    userId: USER_B_PROFILE.id,
    title: 'Morning Wellness & Focus Walk',
    category: 'fitness',
    status: 'planned',
    priority: 'medium',
    dueDate: '2026-10-18',
    estimatedMinutes: 45,
    actualMinutes: 0,
    isLocked: true,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '06:30',
    scheduledEnd: '07:15',
    orderIndex: 1,
    createdAt: '2026-10-18T06:00:00Z'
  },
  {
    id: 'tsk_b_2',
    userId: USER_B_PROFILE.id,
    title: 'CAT 2026 Sectional Sprint: 40-Min DILR Set Analysis',
    category: 'cat',
    status: 'planned',
    priority: 'urgent',
    dueDate: '2026-10-18',
    estimatedMinutes: 60,
    actualMinutes: 0,
    isLocked: false,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '10:00',
    scheduledEnd: '11:00',
    orderIndex: 2,
    createdAt: '2026-10-18T08:00:00Z'
  },
  {
    id: 'tsk_b_3',
    userId: USER_B_PROFILE.id,
    title: 'Deep Learning Assignment: Fine-tuning DistilBERT on Custom Sentiment Corpus',
    category: 'academics',
    subjectId: 'sub_b_1',
    subjectName: 'Deep Learning & Neural Architectures',
    status: 'planned',
    priority: 'urgent',
    dueDate: '2026-10-18',
    estimatedMinutes: 90,
    actualMinutes: 0,
    isLocked: false,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '18:00',
    scheduledEnd: '19:30',
    orderIndex: 3,
    createdAt: '2026-10-18T09:00:00Z'
  },
  {
    id: 'tsk_b_4',
    userId: USER_B_PROFILE.id,
    title: 'CAT VARC: 4 RC Passages with strict 8-min per passage pacing',
    category: 'cat',
    status: 'planned',
    priority: 'high',
    dueDate: '2026-10-18',
    estimatedMinutes: 45,
    actualMinutes: 0,
    isLocked: false,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '20:15',
    scheduledEnd: '21:00',
    orderIndex: 4,
    createdAt: '2026-10-18T11:00:00Z'
  },
  {
    id: 'tsk_b_5',
    userId: USER_B_PROFILE.id,
    title: 'Flipkart ML Associate application & screening assessment review',
    category: 'career',
    status: 'planned',
    priority: 'high',
    dueDate: '2026-10-18',
    estimatedMinutes: 45,
    actualMinutes: 0,
    isLocked: false,
    isPrivate: false,
    scheduledDate: '2026-10-18',
    scheduledStart: '21:15',
    scheduledEnd: '22:00',
    orderIndex: 5,
    createdAt: '2026-10-18T12:00:00Z'
  }
];

export const SEED_JOB_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: 'job_goog_swe_2027',
    companyName: 'Google',
    jobTitle: 'Software Engineering Intern — Summer 2027',
    roleCategory: 'software_dev',
    targetPersona: 'user_a',
    requiredSkills: ['Data Structures', 'Algorithms', 'C++ / Java / Python', 'Distributed Systems basics'],
    eligibilityCriteria: 'B.Tech graduating in 2028 (3rd-year CS/IT)',
    location: 'Bengaluru / Hyderabad',
    workMode: 'hybrid',
    compensation: '₹1,25,000 / month + housing allowance',
    officialUrl: 'https://careers.google.com/jobs/results/?q=software+engineering+intern',
    source: 'Google Careers Official',
    isVerified: true,
    deadline: '2026-11-15',
    lastChecked: '2026-10-18T10:00:00Z'
  },
  {
    id: 'job_msft_swe_2027',
    companyName: 'Microsoft',
    jobTitle: 'Software Engineering Intern (Summer 2027)',
    roleCategory: 'software_dev',
    targetPersona: 'user_a',
    requiredSkills: ['C# / C++ / Python', 'OOP', 'Data Structures & Algorithms', 'OS Concepts'],
    eligibilityCriteria: 'Current Pre-Final Year (2028 Batch), CGPA >= 7.5',
    location: 'Bengaluru / Hyderabad / Noida',
    workMode: 'hybrid',
    compensation: '₹1,00,000 / month + benefits',
    officialUrl: 'https://careers.microsoft.com/professionals/us/en/search-results',
    source: 'Microsoft University Recruiting',
    isVerified: true,
    deadline: '2026-11-20',
    lastChecked: '2026-10-18T11:30:00Z'
  },
  {
    id: 'job_flipkart_ml_2026',
    companyName: 'Flipkart',
    jobTitle: 'Associate Data Scientist / Machine Learning Engineer (2026 Batch)',
    roleCategory: 'ai_ml',
    targetPersona: 'user_b',
    requiredSkills: ['Python', 'PyTorch / TensorFlow', 'Transformers', 'SQL & Spark', 'Statistics'],
    eligibilityCriteria: 'Graduating 2026 (4th-year BTech/MTech CS/AI/DS)',
    location: 'Bengaluru',
    workMode: 'hybrid',
    compensation: '₹22,00,000 – ₹28,00,000 CTC',
    officialUrl: 'https://www.flipkartcareers.com/',
    source: 'Flipkart Campus Connect',
    isVerified: true,
    deadline: '2026-11-10',
    lastChecked: '2026-10-18T14:15:00Z'
  },
  {
    id: 'job_fractal_ai_2026',
    companyName: 'Fractal Analytics',
    jobTitle: 'AI Solutions Engineer — GenAI & NLP',
    roleCategory: 'data_science',
    targetPersona: 'user_b',
    requiredSkills: ['Python', 'LangChain', 'LlamaIndex', 'Fine-tuning LLMs', 'FastAPI'],
    eligibilityCriteria: 'Final-year engineering students (2026 Passout)',
    location: 'Mumbai / Gurugram / Bengaluru',
    workMode: 'hybrid',
    compensation: '₹16,00,000 – ₹20,00,000 CTC',
    officialUrl: 'https://fractal.ai/careers/',
    source: 'Fractal Talent Portal',
    isVerified: true,
    deadline: '2026-11-25',
    lastChecked: '2026-10-18T09:00:00Z'
  },
  {
    id: 'job_amazon_sde_both',
    companyName: 'Amazon',
    jobTitle: 'Software Development Engineer I (FTE 2026 & Intern 2027)',
    roleCategory: 'software_dev',
    targetPersona: 'both',
    requiredSkills: ['Java / C++', 'Object-Oriented Design', 'Algorithms', 'System Architecture'],
    eligibilityCriteria: 'BTech 2026 (FTE) or 2028 (Internship)',
    location: 'Hyderabad / Chennai / Bengaluru',
    workMode: 'on_site',
    compensation: '₹18,00,000 – ₹24,00,000 CTC (Intern: ₹80,000/mo)',
    officialUrl: 'https://www.amazon.jobs/en/job_categories/software-development',
    source: 'Amazon Student Portal',
    isVerified: true,
    deadline: '2026-11-30',
    lastChecked: '2026-10-18T16:00:00Z'
  }
];

export const SEED_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_a_1',
    userId: USER_A_PROFILE.id,
    opportunityId: 'job_goog_swe_2027',
    companyName: 'Google',
    jobTitle: 'Software Engineering Intern — Summer 2027',
    roleCategory: 'software_dev',
    status: 'preparing',
    appliedDate: undefined,
    resumeVersion: 'Garvit_SWE_Intern_v3_oct26.pdf',
    notes: 'Drafted tailored statement of purpose highlighting Operating Systems lab project and top 5% LeetCode rating.',
    createdAt: '2026-10-15T10:00:00Z',
    updatedAt: '2026-10-18T12:00:00Z'
  },
  {
    id: 'app_a_2',
    userId: USER_A_PROFILE.id,
    opportunityId: 'job_msft_swe_2027',
    companyName: 'Microsoft',
    jobTitle: 'Software Engineering Intern (Summer 2027)',
    roleCategory: 'software_dev',
    status: 'applied',
    appliedDate: '2026-10-14',
    resumeVersion: 'Garvit_SWE_Intern_v3_oct26.pdf',
    assessmentDate: '2026-10-25',
    notes: 'Online assessment invitation received for Codility round on Oct 25.',
    createdAt: '2026-10-14T08:00:00Z',
    updatedAt: '2026-10-17T18:00:00Z'
  },
  {
    id: 'app_b_1',
    userId: USER_B_PROFILE.id,
    opportunityId: 'job_flipkart_ml_2026',
    companyName: 'Flipkart',
    jobTitle: 'Associate Data Scientist (2026 Batch)',
    roleCategory: 'ai_ml',
    status: 'assessment',
    appliedDate: '2026-10-08',
    resumeVersion: 'Bittu_AI_DataScientist_2026.pdf',
    assessmentDate: '2026-10-22',
    interviewDate: '2026-10-29',
    compensation: '₹24,00,000 CTC',
    notes: 'Passed initial resume screen. Technical ML & coding assessment scheduled for Oct 22.',
    createdAt: '2026-10-08T11:00:00Z',
    updatedAt: '2026-10-16T15:00:00Z'
  },
  {
    id: 'app_b_2',
    userId: USER_B_PROFILE.id,
    opportunityId: 'job_fractal_ai_2026',
    companyName: 'Fractal Analytics',
    jobTitle: 'AI Solutions Engineer — GenAI & NLP',
    roleCategory: 'data_science',
    status: 'interview',
    appliedDate: '2026-10-02',
    resumeVersion: 'Bittu_AI_DataScientist_2026.pdf',
    interviewDate: '2026-10-24',
    notes: 'Round 1 technical interview cleared with principal AI scientist. Round 2 leadership & architecture on Oct 24.',
    createdAt: '2026-10-02T09:00:00Z',
    updatedAt: '2026-10-17T11:00:00Z'
  }
];

export const SEED_LIVE_MOODS: Record<string, MoodUpdate> = {
  [USER_A_PROFILE.id]: {
    id: 'mood_a_current',
    userId: USER_A_PROFILE.id,
    userName: 'Garvit',
    mood: 'focused',
    energyLevel: 4,
    message: 'Ready for today’s schedule and study goals!',
    isPrivate: false,
    createdAt: '2026-10-18T08:00:00Z'
  },
  [USER_B_PROFILE.id]: {
    id: 'mood_b_current',
    userId: USER_B_PROFILE.id,
    userName: 'Bittu',
    mood: 'focused',
    energyLevel: 4,
    message: 'Ready to study and complete today’s sessions!',
    isPrivate: false,
    createdAt: '2026-10-18T08:00:00Z'
  }
};

export const SEED_ACTIVITY_FEED: ActivityEvent[] = [
  {
    id: 'act_1',
    workspaceId: SEED_WORKSPACE.id,
    userId: USER_A_PROFILE.id,
    userName: 'Garvit',
    userPersona: 'user_a',
    eventType: 'mood_updated',
    summary: 'DUO OS initialized for Garvit & Bittu. Ready to track and log real study sessions.',
    timestamp: '2026-10-18T05:00:00Z',
    metadata: { status: 'ready' }
  }
];

export const SEED_WEEKLY_REVIEW: WeeklyReview = {
  id: 'rev_week_oct18',
  userId: USER_A_PROFILE.id,
  weekStartDate: '2026-10-18',
  wentWell: '',
  remainingIncomplete: '',
  topicsNeedingAttention: '',
  wasScheduleRealistic: true,
  scheduleFeedback: '',
  nextWeekPriorities: [
    'Set up upcoming week goal 1',
    'Set up upcoming week goal 2',
    'Set up upcoming week goal 3'
  ],
  rating: 5,
  createdAt: '2026-10-18T00:00:00Z'
};

export const SEED_TIMETABLE_A: TimetableEntry[] = [
  // Monday
  { id: 'tt_a_1', userId: USER_A_PROFILE.id, dayOfWeek: 1, subjectCode: 'CS301', subjectName: 'Computer Networks', room: 'LH-201', faculty: 'Dr. Ramanujan', isLab: false, startTime: '08:00', endTime: '09:00' },
  { id: 'tt_a_2', userId: USER_A_PROFILE.id, dayOfWeek: 1, subjectCode: 'CS302', subjectName: 'Database Management Systems', room: 'LH-201', faculty: 'Dr. Meenakshi', isLab: false, startTime: '09:15', endTime: '10:15' },
  { id: 'tt_a_3', userId: USER_A_PROFILE.id, dayOfWeek: 1, subjectCode: 'CS303', subjectName: 'Operating Systems', room: 'LH-202', faculty: 'Dr. Vikramaditya', isLab: false, startTime: '10:30', endTime: '11:30' },
  { id: 'tt_a_4', userId: USER_A_PROFILE.id, dayOfWeek: 1, subjectCode: 'CS304', subjectName: 'Design & Analysis of Algorithms', room: 'LH-203', faculty: 'Dr. Mukherjee', isLab: false, startTime: '11:45', endTime: '12:45' },
  { id: 'tt_a_5', userId: USER_A_PROFILE.id, dayOfWeek: 1, subjectCode: 'CS301-L', subjectName: 'Computer Networks Lab', room: 'Software Lab 3', faculty: 'Dr. Ramanujan', isLab: true, startTime: '14:00', endTime: '17:00' },

  // Tuesday
  { id: 'tt_a_6', userId: USER_A_PROFILE.id, dayOfWeek: 2, subjectCode: 'CS304', subjectName: 'Design & Analysis of Algorithms', room: 'LH-203', faculty: 'Dr. Mukherjee', isLab: false, startTime: '08:00', endTime: '09:00' },
  { id: 'tt_a_7', userId: USER_A_PROFILE.id, dayOfWeek: 2, subjectCode: 'CS303', subjectName: 'Operating Systems', room: 'LH-202', faculty: 'Dr. Vikramaditya', isLab: false, startTime: '09:15', endTime: '10:15' },
  { id: 'tt_a_8', userId: USER_A_PROFILE.id, dayOfWeek: 2, subjectCode: 'CS302', subjectName: 'DBMS Lab (SQL & Stored Procedures)', room: 'DB Lab 1', faculty: 'Dr. Meenakshi', isLab: true, startTime: '10:30', endTime: '13:00' },
  { id: 'tt_a_9', userId: USER_A_PROFILE.id, dayOfWeek: 2, subjectCode: 'CS301', subjectName: 'Computer Networks Tutorial', room: 'LH-201', faculty: 'Dr. Ramanujan', isLab: false, startTime: '14:30', endTime: '16:00' }
];

export const SEED_TIMETABLE_B: TimetableEntry[] = [
  // Monday (College Day)
  { id: 'tt_b_1', userId: USER_B_PROFILE.id, dayOfWeek: 1, subjectCode: 'AI401', subjectName: 'Deep Learning & Neural Architectures', room: 'Seminar Hall B', faculty: 'Dr. Banerjee', isLab: false, startTime: '08:30', endTime: '10:30' },
  { id: 'tt_b_2', userId: USER_B_PROFILE.id, dayOfWeek: 1, subjectCode: 'AI402', subjectName: 'Natural Language Processing', room: 'LH-305', faculty: 'Dr. Sengupta', isLab: false, startTime: '11:00', endTime: '13:00' },
  { id: 'tt_b_3', userId: USER_B_PROFILE.id, dayOfWeek: 1, subjectCode: 'AI401-L', subjectName: 'Deep Learning GPU Lab (PyTorch / CUDA)', room: 'AI Cluster Lab', faculty: 'Dr. Banerjee', isLab: true, startTime: '14:00', endTime: '17:00' },

  // Wednesday (College Day)
  { id: 'tt_b_4', userId: USER_B_PROFILE.id, dayOfWeek: 3, subjectCode: 'AI403', subjectName: 'Big Data Systems & Cloud Analytics', room: 'LH-302', faculty: 'Dr. Swaminathan', isLab: false, startTime: '09:00', endTime: '11:00' },
  { id: 'tt_b_5', userId: USER_B_PROFILE.id, dayOfWeek: 3, subjectCode: 'AI404', subjectName: 'Ethics & Safety in Artificial Intelligence', room: 'LH-302', faculty: 'Dr. Anita', isLab: false, startTime: '11:30', endTime: '13:00' },
  { id: 'tt_b_6', userId: USER_B_PROFILE.id, dayOfWeek: 3, subjectCode: 'AI403-L', subjectName: 'Spark & Hadoop Distributed Cluster Lab', room: 'Data Lab 4', faculty: 'Dr. Swaminathan', isLab: true, startTime: '14:00', endTime: '16:30' },

  // Friday (College Day)
  { id: 'tt_b_7', userId: USER_B_PROFILE.id, dayOfWeek: 5, subjectCode: 'AI402-L', subjectName: 'NLP Capstone & Model Evaluation Lab', room: 'AI Cluster Lab', faculty: 'Dr. Sengupta', isLab: true, startTime: '09:00', endTime: '12:00' },
  { id: 'tt_b_8', userId: USER_B_PROFILE.id, dayOfWeek: 5, subjectCode: 'AI401', subjectName: 'DL Research Paper Seminar & Discussion', room: 'Conference Room 1', faculty: 'Dr. Banerjee', isLab: false, startTime: '13:30', endTime: '15:30' }
];
