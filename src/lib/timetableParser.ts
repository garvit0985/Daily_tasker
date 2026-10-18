// DUO OS — Timetable Parser & OCR Confirmation Helper
import { TimetableEntry } from './types';

export interface ParsedTimetableResult {
  entries: TimetableEntry[];
  confidenceScore: number;
  warnings: string[];
  rawTextPreview?: string;
}

const DAY_MAP: Record<string, number> = {
  sunday: 0, sun: 0,
  monday: 1, mon: 1,
  tuesday: 2, tue: 2, tues: 2,
  wednesday: 3, wed: 3,
  thursday: 4, thu: 4, thur: 4, thurs: 4,
  friday: 5, fri: 5,
  saturday: 6, sat: 6
};

export function parseRawTimetableText(
  rawText: string,
  userId: string
): ParsedTimetableResult {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const entries: TimetableEntry[] = [];
  const warnings: string[] = [];
  let currentDay = 1; // Default to Monday

  const timeRegex = /(\d{1,2}[:.]\d{2})\s*(?:-|to|–)\s*(\d{1,2}[:.]\d{2})/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line indicates a day header
    const lower = line.toLowerCase();
    let foundDay = false;
    for (const [dayName, dayNum] of Object.entries(DAY_MAP)) {
      if (lower.startsWith(dayName) || lower.includes(`day: ${dayName}`) || lower.includes(`[${dayName}]`)) {
        currentDay = dayNum;
        foundDay = true;
        break;
      }
    }
    if (foundDay) continue;

    // Check for comma or tab separated CSV format: Day, Start, End, Code, Subject, Room, Faculty
    if (line.includes(',') || line.includes('\t')) {
      const parts = (line.includes(',') ? line.split(',') : line.split('\t')).map(p => p.trim());
      if (parts.length >= 3) {
        // e.g. "Mon, 08:00, 09:00, CS301, Computer Networks, LH-201, Dr. Ramanujan"
        let d = currentDay;
        let pIdx = 0;
        const first = parts[0].toLowerCase();
        if (DAY_MAP[first] !== undefined) {
          d = DAY_MAP[first];
          pIdx = 1;
        }

        const start = normalizeTime(parts[pIdx]);
        const end = normalizeTime(parts[pIdx + 1]);
        const code = parts[pIdx + 2] || 'SUB';
        const name = parts[pIdx + 3] || code;
        const room = parts[pIdx + 4] || 'Classroom';
        const faculty = parts[pIdx + 5] || '';
        const isLab = name.toLowerCase().includes('lab') || code.toLowerCase().includes('l');

        if (start && end) {
          entries.push({
            id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            userId,
            dayOfWeek: d,
            subjectCode: code,
            subjectName: name,
            startTime: start,
            endTime: end,
            room,
            faculty,
            isLab
          });
          continue;
        }
      }
    }

    // Try regex extraction on unstructured line
    const match = line.match(timeRegex);
    if (match) {
      const start = normalizeTime(match[1]);
      const end = normalizeTime(match[2]);
      const remainder = line.replace(match[0], '').replace(/[-–|]/g, ' ').trim();
      const tokens = remainder.split(/\s+/);
      const code = tokens[0] || 'CLASS';
      const name = tokens.slice(1).join(' ') || code;
      const isLab = name.toLowerCase().includes('lab') || code.toLowerCase().includes('l');

      entries.push({
        id: `entry_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        userId,
        dayOfWeek: currentDay,
        subjectCode: code,
        subjectName: name,
        startTime: start,
        endTime: end,
        room: line.toLowerCase().includes('lab') ? 'Lab Complex' : 'LH-201',
        isLab
      });
    }
  }

  if (entries.length === 0) {
    warnings.push('Could not detect class timings automatically. You can review and manually fill the timetable entries below.');
  }

  return {
    entries,
    confidenceScore: entries.length > 3 ? 0.92 : (entries.length > 0 ? 0.65 : 0.2),
    warnings,
    rawTextPreview: rawText.slice(0, 300)
  };
}

function normalizeTime(tStr: string): string {
  if (!tStr) return '09:00';
  const clean = tStr.replace('.', ':').trim();
  const parts = clean.split(':');
  if (parts.length >= 2) {
    const h = parts[0].padStart(2, '0');
    const m = parts[1].padStart(2, '0').slice(0, 2);
    return `${h}:${m}`;
  }
  return '09:00';
}

export const SAMPLE_USER_A_TIMETABLE_CSV = `Monday, 08:00, 09:00, CS301, Computer Networks, LH-201, Dr. Ramanujan
Monday, 09:15, 10:15, CS302, Database Management Systems, LH-201, Dr. Meenakshi
Monday, 10:30, 11:30, CS303, Operating Systems, LH-202, Dr. Vikramaditya
Monday, 11:45, 12:45, CS304, Design & Analysis of Algorithms, LH-203, Dr. Mukherjee
Monday, 14:00, 17:00, CS301-L, Computer Networks Lab, Software Lab 3, Dr. Ramanujan
Tuesday, 08:00, 09:00, CS304, Design & Analysis of Algorithms, LH-203, Dr. Mukherjee
Tuesday, 09:15, 10:15, CS303, Operating Systems, LH-202, Dr. Vikramaditya
Tuesday, 10:30, 13:00, CS302-L, DBMS Lab (SQL & PL/SQL), DB Lab 1, Dr. Meenakshi
Wednesday, 08:30, 10:30, CS301, Computer Networks (Theory & Sockets), LH-201, Dr. Ramanujan
Wednesday, 11:00, 12:30, CS302, Database Normalization & Indexing, LH-201, Dr. Meenakshi
Wednesday, 14:00, 16:30, CS303-L, OS Concurrency & Kernel Lab, Systems Lab 2, Dr. Vikramaditya
Thursday, 09:00, 11:00, CS304, Advanced Dynamic Programming, LH-203, Dr. Mukherjee
Thursday, 11:30, 13:00, CS303, Virtual Memory & Paging, LH-202, Dr. Vikramaditya
Thursday, 14:30, 17:00, CS304-L, Algorithms Coding Lab, Software Lab 1, Dr. Mukherjee
Friday, 08:30, 10:00, CS302, Transaction Processing & Recovery, LH-201, Dr. Meenakshi
Friday, 10:30, 12:30, CS301, Routing Protocols & Congestion, LH-201, Dr. Ramanujan
Saturday, 09:00, 12:00, CS399, Minor Project & Research Seminar, Seminar Hall A, Dept Faculty`;

export const SAMPLE_USER_B_TIMETABLE_CSV = `Monday, 08:30, 10:30, AI401, Deep Learning & Neural Architectures, Seminar Hall B, Dr. Banerjee
Monday, 11:00, 13:00, AI402, Natural Language Processing, LH-305, Dr. Sengupta
Monday, 14:00, 17:00, AI401-L, Deep Learning GPU Lab (PyTorch), AI Cluster Lab, Dr. Banerjee
Wednesday, 09:00, 11:00, AI403, Big Data Systems & Cloud Analytics, LH-302, Dr. Swaminathan
Wednesday, 11:30, 13:00, AI404, Ethics & Safety in AI, LH-302, Dr. Anita
Wednesday, 14:00, 16:30, AI403-L, Spark Distributed Analytics Lab, Data Lab 4, Dr. Swaminathan
Friday, 09:00, 12:00, AI402-L, NLP Capstone Lab & Evaluation, AI Cluster Lab, Dr. Sengupta
Friday, 13:30, 15:30, AI401, DL Seminar & Discussion, Conference Room 1, Dr. Banerjee`;
