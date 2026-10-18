# DUO OS — AI Study & Career Platform for Two BTech Students

**DUO OS** is a shared productivity, study planning, exam preparation, and career command center engineered specifically for two BTech engineering students sharing an invitation-based workspace:
- **User A (Garvit)**: 3rd-year Core Computer Science
  - Fixed Commitments: Morning Gym @ 5:30 AM (60m), 6-day College (8:00 AM – 5:30 PM), Evening Tuition Teaching (5:30 PM – 7:45/8:00 PM), Protected Sleep (23:00 – 05:00).
  - Priorities: Academics & Labs, LeetCode & DSA Problem Solving, Summer 2027 SWE Internships, Gradual CAT 2027 Quantitative Foundation.
- **User B (Bittu)**: 4th-year Data Science & Artificial Intelligence
  - Fixed Commitments: 3-day College (configurable Mon/Wed/Fri 8:00 AM – 5:30 PM), Protected Sleep (23:30 – 06:00).
  - Priorities: Academics (Deep Learning Capstone), CAT Examination in November 2026 (Urgent Priority #1), GATE Data Science & AI (GATE DA 2027), Placements & AI Engineering Interviews.
- **Operating Timeline**: October 18, 2026 – December 31, 2026.

---

## 🚀 Key Features

1. **Dual-Student Workspace & 1-Click Instant Persona Switching**
   - Seamlessly switch between Garvit's 6-day schedule and Bittu's 3-day schedule with real-time feedback.
   - Consent-based shared workspace (`DUO-2026-NIT`) connecting both profiles.

2. **Shared Real-Time Dashboard (`/together`) — The Signature Feature**
   - Side-by-side live partner cards displaying real-time activity, focus sessions, today's completion rates, and next upcoming commitments.
   - **Consent-based Shared Mood System**: Happy, Focused, Motivated, Tired, Stressed, Low, Need a break with optional notes and privacy toggle.
   - Real-time shared activity feed with live timestamped events.
   - Dual-mode synchronization: Runs via browser `BroadcastChannel` for instant multi-tab real-time updates out of the box, with seamless upgrade to **Supabase Realtime**.

3. **Smart AI Daily Planner & Constraint Engine (`/schedule`)**
   - Strictly protects fixed commitments: Never schedules over gym, college, tuition, or protected sleep hours.
   - Adapts to user energy levels (1 to 5) and slots high-cognition DSA and CAT mocks during prime cognitive windows.
   - Preview generated daily schedules with full transparent explanations before applying to the calendar.
   - Lock specific tasks or time blocks to prevent automatic rescheduling.

4. **Timetable Parser & OCR Confirmation (`/onboarding`)**
   - User A: Uploads CSV, text, or OCR dumps of college timetables, with an interactive editable confirmation table to verify extracted subjects, rooms, and lab slots.
   - User B: Selectable 3-day college configurator that automatically reserves the remaining 4 days for focused CAT/GATE sprints.

5. **Deep Focus Engine & Web Audio Ambience (`/focus`)**
   - 25/5 Pomodoro, 50/10 Deep Work, and Custom session durations.
   - **Native Web Audio Synthesizer**: Generates authentic pink-noise rain, 6Hz theta binaural beats, and cafe hum directly in the browser without external audio dependencies.
   - Fullscreen focus mode with distraction awareness alerts.
   - Broadcasts active focus sessions to partner in real-time.

6. **Academic Syllabus Coverage (`/academics`)**
   - Full semester course breakdown (CS301-304 for CS, AI401-404 for AI/DS).
   - Topic difficulty tags (Easy, Medium, Hard), revision counter, and unit-by-unit syllabus mastery tracking.

7. **Competitive Exam Tracker (`/exams`)**
   - Urgent CAT 2026 Countdown with sectional targets for VARC, DILR, and QA.
   - Full-length AIMCAT & SIMCAT mock test logs with score cards, accuracy percent, and flagged weak topics.
   - **Post-CAT Rebalancing Advisor**: Suggests calibrated roadmap shifting focus to GATE DA and placement rounds once CAT is confirmed completed.
   - CAT 2027 gradual 3-year milestone tracker for User A.

8. **Career Command Center (`/career`)**
   - 8-stage application pipeline Kanban: Saved → Preparing → Applied → Assessment → Interview → Offer.
   - Personalized verified job feeds for Google, Microsoft, Flipkart, Fractal Analytics, and Amazon with verified career URLs.

9. **Analytics & Reflective Weekly Reviews (`/insights`)**
   - Focus minute totals, completed tasks, and syllabus coverage dials.
   - Non-judgmental weekly review form: "What went well?", "What remains incomplete?", "Were schedules realistic?", and top 3 priorities for next week.

10. **Customizable Design System & Themes (`/settings`)**
    - Deep Midnight Navy default theme (`#070A11`, `#0D1322`).
    - Clean Light Mode with Apple-inspired contrast.
    - Custom accent colors: Electric Violet, Deep Indigo, Fresh Mint, Electric Sky, and Warm Coral.
    - Protected schedule configuration editor.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React icons, Canvas-Confetti.
- **Routing**: React Router (HashRouter for static and dev hosting compatibility).
- **State & Realtime**: Local persistent reactive store with `BroadcastChannel` cross-tab live bus + Supabase JS Client bridge.
- **Audio**: Web Audio API native sound synthesizer.
- **Backend / Database**: Supabase PostgreSQL schema with Row Level Security (RLS) policies and Realtime publications (`supabase/migrations/20261018000000_duo_os_schema.sql`).

---

## 📦 Getting Started

### 1. Run Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Testing Multi-User Realtime Sync
1. Open [http://localhost:5173](http://localhost:5173) in Tab 1 (as **Garvit**).
2. Open [http://localhost:5173](http://localhost:5173) in Tab 2 and click **"Switch to Bittu"** in the top navigation.
3. In Tab 1, complete a task or update your mood. Notice Tab 2's `/together` page updates in real time!

### 3. Connecting Supabase (Optional)
1. In your Supabase project dashboard, open the **SQL Editor**.
2. Run the script located at `supabase/migrations/20261018000000_duo_os_schema.sql`.
3. In DUO OS, navigate to **Settings** (`#/settings`), paste your **Supabase Project URL** and **Public Anon Key**, and click **Save Credentials**.
