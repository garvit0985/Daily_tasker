import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

// Excel Database File Path
export const DB_DIR = path.join(process.cwd(), 'server', 'data');
export const DB_PATH = path.join(DB_DIR, 'database.xlsx');

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Queue to handle concurrent Excel file writes safely
class AsyncLock {
  private queue: Promise<unknown> = Promise.resolve();

  async acquire<T>(fn: () => Promise<T>): Promise<T> {
    const next = this.queue.then(fn, fn);
    this.queue = next.catch(() => {});
    return next;
  }
}

const lock = new AsyncLock();

// Column Schema Definitions
export interface ColumnDefinition {
  header: string;
  key: string;
  width: number;
}

export const SCHEMAS: Record<string, ColumnDefinition[]> = {
  Users: [
    { header: 'ID', key: 'id', width: 25 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Display Name', key: 'displayName', width: 20 },
    { header: 'Student Persona', key: 'studentPersona', width: 18 },
    { header: 'Degree Program', key: 'degreeProgram', width: 32 },
    { header: 'Year of Study', key: 'yearOfStudy', width: 14 },
    { header: 'College Name', key: 'collegeName', width: 30 },
    { header: 'Bio', key: 'bio', width: 45 },
    { header: 'Created At', key: 'createdAt', width: 22 }
  ],
  Tasks: [
    { header: 'ID', key: 'id', width: 26 },
    { header: 'User ID', key: 'userId', width: 24 },
    { header: 'Title', key: 'title', width: 35 },
    { header: 'Description', key: 'description', width: 40 },
    { header: 'Category', key: 'category', width: 16 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Priority', key: 'priority', width: 14 },
    { header: 'Due Date', key: 'dueDate', width: 15 },
    { header: 'Estimated Minutes', key: 'estimatedMinutes', width: 18 },
    { header: 'Actual Minutes', key: 'actualMinutes', width: 16 },
    { header: 'Is Locked', key: 'isLocked', width: 12 },
    { header: 'Is Private', key: 'isPrivate', width: 12 },
    { header: 'Subject Code', key: 'subjectId', width: 16 },
    { header: 'Subject Name', key: 'subjectName', width: 24 },
    { header: 'Scheduled Date', key: 'scheduledDate', width: 16 },
    { header: 'Scheduled Start', key: 'scheduledStart', width: 16 },
    { header: 'Scheduled End', key: 'scheduledEnd', width: 16 },
    { header: 'Completed At', key: 'completedAt', width: 22 },
    { header: 'Created At', key: 'createdAt', width: 22 }
  ],
  FocusSessions: [
    { header: 'ID', key: 'id', width: 26 },
    { header: 'User ID', key: 'userId', width: 24 },
    { header: 'Task Title', key: 'taskTitle', width: 32 },
    { header: 'Category', key: 'category', width: 16 },
    { header: 'Duration Minutes', key: 'durationMinutes', width: 18 },
    { header: 'Time Slot', key: 'timeSlot', width: 20 },
    { header: 'Start Time', key: 'startTime', width: 14 },
    { header: 'End Time', key: 'endTime', width: 14 },
    { header: 'Date', key: 'date', width: 16 },
    { header: 'Mode', key: 'mode', width: 14 },
    { header: 'Energy Score', key: 'energyScore', width: 14 },
    { header: 'Focus Score', key: 'focusScore', width: 14 },
    { header: 'Reflection Notes', key: 'reflectionNotes', width: 40 },
    { header: 'Created At', key: 'createdAt', width: 22 }
  ],
  Timetable: [
    { header: 'ID', key: 'id', width: 24 },
    { header: 'User ID', key: 'userId', width: 24 },
    { header: 'Day of Week', key: 'dayOfWeek', width: 14 },
    { header: 'Subject Code', key: 'subjectCode', width: 16 },
    { header: 'Subject Name', key: 'subjectName', width: 28 },
    { header: 'Faculty', key: 'faculty', width: 22 },
    { header: 'Room', key: 'room', width: 14 },
    { header: 'Is Lab', key: 'isLab', width: 12 },
    { header: 'Start Time', key: 'startTime', width: 14 },
    { header: 'End Time', key: 'endTime', width: 14 }
  ],
  Exams: [
    { header: 'ID', key: 'id', width: 24 },
    { header: 'User ID', key: 'userId', width: 24 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Exam Type', key: 'examType', width: 16 },
    { header: 'Target Score', key: 'targetScore', width: 15 },
    { header: 'Exam Date', key: 'examDate', width: 16 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Created At', key: 'createdAt', width: 22 }
  ],
  Subjects: [
    { header: 'ID', key: 'id', width: 24 },
    { header: 'User ID', key: 'userId', width: 24 },
    { header: 'Code', key: 'code', width: 16 },
    { header: 'Name', key: 'name', width: 28 },
    { header: 'Credits', key: 'credits', width: 12 },
    { header: 'Grade Target', key: 'gradeTarget', width: 14 },
    { header: 'Total Units', key: 'totalUnits', width: 14 },
    { header: 'Completed Units', key: 'completedUnits', width: 16 },
    { header: 'Attendance %', key: 'attendancePct', width: 16 }
  ],
  ActivityFeed: [
    { header: 'ID', key: 'id', width: 24 },
    { header: 'User ID', key: 'userId', width: 24 },
    { header: 'Actor Name', key: 'actorName', width: 18 },
    { header: 'Action Type', key: 'actionType', width: 18 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Description', key: 'description', width: 45 },
    { header: 'Timestamp', key: 'timestamp', width: 22 }
  ]
};

// Styling Helpers for Excel Worksheets
function styleSheetHeader(worksheet: ExcelJS.Worksheet) {
  const headerRow = worksheet.getRow(1);
  headerRow.height = 26;
  headerRow.font = {
    name: 'Segoe UI',
    bold: true,
    size: 11,
    color: { argb: 'FFFFFFFF' }
  };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' } // Slate 900
  };
  headerRow.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: false
  };

  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF334155' } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      bottom: { style: 'medium', color: { argb: 'FF3B82F6' } }, // Blue highlight bottom border
      right: { style: 'thin', color: { argb: 'FF334155' } }
    };
  });

  worksheet.views = [{ state: 'frozen', ySplit: 1, showGridLines: true }];
}

function styleDataRow(row: ExcelJS.Row, rowIndex: number) {
  row.height = 22;
  const isEven = rowIndex % 2 === 0;
  row.eachCell((cell) => {
    cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF1E293B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
    };
    if (isEven) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF8FAFC' } // Subtle alternate row zebra shading
      };
    }
  });
}

export class ExcelDatabase {
  private filePath: string;

  constructor(filePath: string = DB_PATH) {
    this.filePath = filePath;
  }

  // Load or create workbook
  private async loadWorkbook(): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    if (fs.existsSync(this.filePath)) {
      await workbook.xlsx.readFile(this.filePath);
    } else {
      // Create fresh workbook with all sheets
      for (const [sheetName, columns] of Object.entries(SCHEMAS)) {
        const sheet = workbook.addWorksheet(sheetName);
        sheet.columns = columns.map(c => ({
          header: c.header,
          key: c.key,
          width: c.width
        }));
        styleSheetHeader(sheet);
      }
      await workbook.xlsx.writeFile(this.filePath);
    }
    return workbook;
  }

  // Save workbook atomically
  private async saveWorkbook(workbook: ExcelJS.Workbook): Promise<void> {
    const tempPath = `${this.filePath}.tmp`;
    await workbook.xlsx.writeFile(tempPath);
    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath);
    }
    fs.renameSync(tempPath, this.filePath);
  }

  // Initialize DB and ensure all sheets exist
  public async init(): Promise<void> {
    return lock.acquire(async () => {
      const workbook = await this.loadWorkbook();
      let updated = false;

      for (const [sheetName, columns] of Object.entries(SCHEMAS)) {
        let sheet = workbook.getWorksheet(sheetName);
        if (!sheet) {
          sheet = workbook.addWorksheet(sheetName);
          sheet.columns = columns.map(c => ({
            header: c.header,
            key: c.key,
            width: c.width
          }));
          styleSheetHeader(sheet);
          updated = true;
        }
      }

      if (updated || !fs.existsSync(this.filePath)) {
        await this.saveWorkbook(workbook);
      }
    });
  }

  // Generic Get All Records from a Sheet
  public async getAll<T = Record<string, any>>(sheetName: string): Promise<T[]> {
    return lock.acquire(async () => {
      const workbook = await this.loadWorkbook();
      const sheet = workbook.getWorksheet(sheetName);
      if (!sheet) return [];

      const schema = SCHEMAS[sheetName];
      if (!schema) return [];

      const results: T[] = [];
      const rowCount = sheet.rowCount;

      for (let r = 2; r <= rowCount; r++) {
        const row = sheet.getRow(r);
        // Check if row is empty
        const idCell = row.getCell(1).value;
        if (!idCell && idCell !== 0) continue;

        const record: Record<string, any> = {};
        schema.forEach((col, idx) => {
          const rawVal = row.getCell(idx + 1).value;
          // Handle ExcelJS rich text or objects
          if (rawVal && typeof rawVal === 'object' && 'text' in (rawVal as any)) {
            record[col.key] = (rawVal as any).text;
          } else {
            record[col.key] = rawVal === undefined ? null : rawVal;
          }
        });
        results.push(record as T);
      }

      return results;
    });
  }

  // Generic Get By ID
  public async getById<T = Record<string, any>>(sheetName: string, id: string): Promise<T | null> {
    const all = await this.getAll<T>(sheetName);
    return all.find((item: any) => String(item.id) === String(id)) || null;
  }

  // Generic Insert Record
  public async insert<T extends Record<string, any>>(sheetName: string, data: T): Promise<T> {
    return lock.acquire(async () => {
      const workbook = await this.loadWorkbook();
      let sheet = workbook.getWorksheet(sheetName);
      const schema = SCHEMAS[sheetName];

      if (!sheet) {
        sheet = workbook.addWorksheet(sheetName);
        sheet.columns = schema.map(c => ({ header: c.header, key: c.key, width: c.width }));
        styleSheetHeader(sheet);
      }

      const id = data.id || `${sheetName.toLowerCase().slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const createdAt = data.createdAt || new Date().toISOString();

      const newRecord = {
        ...data,
        id,
        createdAt
      };

      const rowValues = schema.map(col => {
        const val = newRecord[col.key];
        return val === undefined ? null : val;
      });

      const newRow = sheet.addRow(rowValues);
      styleDataRow(newRow, sheet.rowCount);

      await this.saveWorkbook(workbook);
      return newRecord;
    });
  }

  // Generic Update Record
  public async update<T extends Record<string, any>>(
    sheetName: string,
    id: string,
    updates: Partial<T>
  ): Promise<T | null> {
    return lock.acquire(async () => {
      const workbook = await this.loadWorkbook();
      const sheet = workbook.getWorksheet(sheetName);
      const schema = SCHEMAS[sheetName];
      if (!sheet || !schema) return null;

      const rowCount = sheet.rowCount;
      let targetRowIndex = -1;
      let currentRecord: Record<string, any> = {};

      for (let r = 2; r <= rowCount; r++) {
        const row = sheet.getRow(r);
        const cellId = row.getCell(1).value;
        if (cellId && String(cellId) === String(id)) {
          targetRowIndex = r;
          schema.forEach((col, idx) => {
            currentRecord[col.key] = row.getCell(idx + 1).value;
          });
          break;
        }
      }

      if (targetRowIndex === -1) return null;

      const updatedRecord = {
        ...currentRecord,
        ...updates,
        id // Keep ID immutable
      };

      const targetRow = sheet.getRow(targetRowIndex);
      schema.forEach((col, idx) => {
        const val = updatedRecord[col.key];
        targetRow.getCell(idx + 1).value = val === undefined ? null : val;
      });

      styleDataRow(targetRow, targetRowIndex);
      await this.saveWorkbook(workbook);

      return updatedRecord as T;
    });
  }

  // Generic Delete Record
  public async delete(sheetName: string, id: string): Promise<boolean> {
    return lock.acquire(async () => {
      const workbook = await this.loadWorkbook();
      const sheet = workbook.getWorksheet(sheetName);
      if (!sheet) return false;

      const rowCount = sheet.rowCount;
      let targetRowIndex = -1;

      for (let r = 2; r <= rowCount; r++) {
        const row = sheet.getRow(r);
        const cellId = row.getCell(1).value;
        if (cellId && String(cellId) === String(id)) {
          targetRowIndex = r;
          break;
        }
      }

      if (targetRowIndex === -1) return false;

      sheet.spliceRows(targetRowIndex, 1);
      await this.saveWorkbook(workbook);
      return true;
    });
  }

  // Bulk Seed Data into Excel Database
  public async seed(data: Record<string, any[]>): Promise<{ seededCounts: Record<string, number> }> {
    return lock.acquire(async () => {
      const workbook = new ExcelJS.Workbook();
      const seededCounts: Record<string, number> = {};

      for (const [sheetName, schema] of Object.entries(SCHEMAS)) {
        const sheet = workbook.addWorksheet(sheetName);
        sheet.columns = schema.map(c => ({ header: c.header, key: c.key, width: c.width }));
        styleSheetHeader(sheet);

        const items = data[sheetName] || [];
        items.forEach((item, index) => {
          const rowValues = schema.map(col => {
            const val = item[col.key];
            return val === undefined ? null : val;
          });
          const row = sheet.addRow(rowValues);
          styleDataRow(row, index + 2);
        });

        seededCounts[sheetName] = items.length;
      }

      await this.saveWorkbook(workbook);
      return { seededCounts };
    });
  }

  // Get Stats & Meta Information
  public async getStats(): Promise<{
    filePath: string;
    fileSizeBytes: number;
    lastModified: string | null;
    counts: Record<string, number>;
  }> {
    return lock.acquire(async () => {
      let fileSizeBytes = 0;
      let lastModified: string | null = null;

      if (fs.existsSync(this.filePath)) {
        const stats = fs.statSync(this.filePath);
        fileSizeBytes = stats.size;
        lastModified = stats.mtime.toISOString();
      }

      const workbook = await this.loadWorkbook();
      const counts: Record<string, number> = {};

      for (const sheetName of Object.keys(SCHEMAS)) {
        const sheet = workbook.getWorksheet(sheetName);
        counts[sheetName] = sheet ? Math.max(0, sheet.rowCount - 1) : 0;
      }

      return {
        filePath: this.filePath,
        fileSizeBytes,
        lastModified,
        counts
      };
    });
  }
}

export const excelDb = new ExcelDatabase();
