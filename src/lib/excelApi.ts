// Client-side API service to communicate with the Excel Database Backend

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface BackendHealth {
  status: 'ok' | 'error';
  engine: string;
  databaseFile: string;
  databaseExists: boolean;
  serverTime: string;
  stats: {
    filePath: string;
    fileSizeBytes: number;
    lastModified: string | null;
    counts: Record<string, number>;
  };
}

// Check if Excel backend is online and healthy
export async function checkBackendHealth(): Promise<BackendHealth | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE}/health`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Download URL for Excel database file
export function getExcelDownloadUrl(): string {
  return `${API_BASE}/database/download`;
}

// -----------------------------------------------------------------
// Tasks API
// -----------------------------------------------------------------

export async function apiGetTasks(userId?: string): Promise<any[]> {
  try {
    const url = userId ? `${API_BASE}/tasks?userId=${encodeURIComponent(userId)}` : `${API_BASE}/tasks`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('[Excel API] Failed to fetch tasks from backend:', err);
    return [];
  }
}

export async function apiCreateTask(taskData: any): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[Excel API] Failed to create task in Excel DB:', err);
    return null;
  }
}

export async function apiUpdateTask(taskId: string, updates: any): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(taskId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[Excel API] Failed to update task in Excel DB:', err);
    return null;
  }
}

export async function apiDeleteTask(taskId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(taskId)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.warn('[Excel API] Failed to delete task in Excel DB:', err);
    return false;
  }
}

// -----------------------------------------------------------------
// Focus Sessions API
// -----------------------------------------------------------------

export async function apiGetFocusSessions(userId?: string): Promise<any[]> {
  try {
    const url = userId ? `${API_BASE}/focus?userId=${encodeURIComponent(userId)}` : `${API_BASE}/focus`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('[Excel API] Failed to fetch focus sessions:', err);
    return [];
  }
}

export async function apiCreateFocusSession(sessionData: any): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/focus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[Excel API] Failed to create focus session in Excel DB:', err);
    return null;
  }
}

// -----------------------------------------------------------------
// Users API
// -----------------------------------------------------------------

export async function apiGetUsers(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('[Excel API] Failed to fetch users:', err);
    return [];
  }
}

export async function apiUpdateUser(userId: string, updates: any): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[Excel API] Failed to update user in Excel DB:', err);
    return null;
  }
}
