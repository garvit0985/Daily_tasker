import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { excelDb, DB_PATH } from './excelDb';
import {
  INITIAL_USERS,
  INITIAL_TASKS,
  INITIAL_FOCUS_SESSIONS,
  INITIAL_TIMETABLE,
  INITIAL_EXAMS,
  INITIAL_SUBJECTS,
  INITIAL_ACTIVITY_FEED
} from './initialSeed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend dev server
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize database on boot and seed if empty
async function initServer() {
  console.log('[Excel DB] Initializing Excel database at:', DB_PATH);
  await excelDb.init();

  const stats = await excelDb.getStats();
  if (stats.counts.Tasks === 0 && stats.counts.Users === 0) {
    console.log('[Excel DB] Database is empty. Seeding initial records...');
    await excelDb.seed({
      Users: INITIAL_USERS,
      Tasks: INITIAL_TASKS,
      FocusSessions: INITIAL_FOCUS_SESSIONS,
      Timetable: INITIAL_TIMETABLE,
      Exams: INITIAL_EXAMS,
      Subjects: INITIAL_SUBJECTS,
      ActivityFeed: INITIAL_ACTIVITY_FEED
    });
    console.log('[Excel DB] Seed data populated successfully!');
  } else {
    console.log('[Excel DB] Loaded existing database with records:', stats.counts);
  }
}

// -------------------------------------------------------------
// Root & System Endpoints
// -------------------------------------------------------------

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const stats = await excelDb.getStats();
    res.json({
      status: 'ok',
      engine: 'Excel Database (ExcelJS)',
      databaseFile: DB_PATH,
      databaseExists: fs.existsSync(DB_PATH),
      serverTime: new Date().toISOString(),
      stats
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Download the actual .xlsx Excel database file
app.get('/api/database/download', (_req: Request, res: Response) => {
  if (!fs.existsSync(DB_PATH)) {
    return res.status(404).json({ error: 'Excel database file not found' });
  }
  res.download(DB_PATH, 'studyos_database.xlsx', (err) => {
    if (err) {
      console.error('[Excel DB] Error downloading file:', err);
    }
  });
});

// Force re-seed database with initial data
app.post('/api/database/seed', async (_req: Request, res: Response) => {
  try {
    const result = await excelDb.seed({
      Users: INITIAL_USERS,
      Tasks: INITIAL_TASKS,
      FocusSessions: INITIAL_FOCUS_SESSIONS,
      Timetable: INITIAL_TIMETABLE,
      Exams: INITIAL_EXAMS,
      Subjects: INITIAL_SUBJECTS,
      ActivityFeed: INITIAL_ACTIVITY_FEED
    });
    res.json({ success: true, message: 'Database seeded successfully', result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// Users Endpoints
// -------------------------------------------------------------

app.get('/api/users', async (_req: Request, res: Response) => {
  try {
    const users = await excelDb.getAll('Users');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await excelDb.getById('Users', req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const newUser = await excelDb.insert('Users', req.body);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const updated = await excelDb.update('Users', req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// Tasks Endpoints (Full CRUD)
// -------------------------------------------------------------

app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const { userId, status, category } = req.query;
    let tasks = await excelDb.getAll<any>('Tasks');

    if (userId) {
      tasks = tasks.filter(t => String(t.userId) === String(userId));
    }
    if (status) {
      tasks = tasks.filter(t => String(t.status) === String(status));
    }
    if (category) {
      tasks = tasks.filter(t => String(t.category) === String(category));
    }

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const task = await excelDb.getById('Tasks', req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req: Request, res: Response) => {
  try {
    const taskData = req.body;
    if (!taskData.title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const newTask = await excelDb.insert('Tasks', taskData);
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const updated = await excelDb.update('Tasks', req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await excelDb.delete('Tasks', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// Focus Sessions Endpoints
// -------------------------------------------------------------

app.get('/api/focus', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    let sessions = await excelDb.getAll<any>('FocusSessions');
    if (userId) {
      sessions = sessions.filter(s => String(s.userId) === String(userId));
    }
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/focus', async (req: Request, res: Response) => {
  try {
    const session = await excelDb.insert('FocusSessions', req.body);
    res.status(201).json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/focus/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await excelDb.delete('FocusSessions', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Focus session not found' });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// Timetable Endpoints
// -------------------------------------------------------------

app.get('/api/timetable', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    let list = await excelDb.getAll<any>('Timetable');
    if (userId) {
      list = list.filter(t => String(t.userId) === String(userId));
    }
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/timetable', async (req: Request, res: Response) => {
  try {
    const entry = await excelDb.insert('Timetable', req.body);
    res.status(201).json(entry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/timetable/:id', async (req: Request, res: Response) => {
  try {
    const updated = await excelDb.update('Timetable', req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Timetable entry not found' });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/timetable/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await excelDb.delete('Timetable', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Timetable entry not found' });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// Exams Endpoints
// -------------------------------------------------------------

app.get('/api/exams', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    let list = await excelDb.getAll<any>('Exams');
    if (userId) {
      list = list.filter(e => String(e.userId) === String(userId));
    }
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/exams', async (req: Request, res: Response) => {
  try {
    const exam = await excelDb.insert('Exams', req.body);
    res.status(201).json(exam);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/exams/:id', async (req: Request, res: Response) => {
  try {
    const updated = await excelDb.update('Exams', req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Exam not found' });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/exams/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await excelDb.delete('Exams', req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Exam not found' });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// Subjects Endpoints
// -------------------------------------------------------------

app.get('/api/subjects', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    let list = await excelDb.getAll<any>('Subjects');
    if (userId) {
      list = list.filter(s => String(s.userId) === String(userId));
    }
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/subjects', async (req: Request, res: Response) => {
  try {
    const subject = await excelDb.insert('Subjects', req.body);
    res.status(201).json(subject);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------------------------
// Activity Feed Endpoints
// -------------------------------------------------------------

app.get('/api/activity', async (_req: Request, res: Response) => {
  try {
    const feed = await excelDb.getAll('ActivityFeed');
    res.json(feed);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activity', async (req: Request, res: Response) => {
  try {
    const event = await excelDb.insert('ActivityFeed', req.body);
    res.status(201).json(event);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express Server
initServer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[Excel Backend] Server running at http://localhost:${PORT}`);
      console.log(`[Excel Backend] Excel Database File: ${DB_PATH}`);
      console.log(`[Excel Backend] Download Excel File: http://localhost:${PORT}/api/database/download`);
    });
  })
  .catch((err) => {
    console.error('[Excel Backend] Failed to initialize server:', err);
  });
