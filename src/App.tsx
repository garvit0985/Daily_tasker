// DUO OS — Main Application Router & Context Providers
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TogetherPage } from './pages/TogetherPage';
import { SchedulePage } from './pages/SchedulePage';
import { TasksPage } from './pages/TasksPage';
import { FocusPage } from './pages/FocusPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { ExamsPage } from './pages/ExamsPage';
import { CareerPage } from './pages/CareerPage';
import { InsightsPage } from './pages/InsightsPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected App Routes inside Shell Layout */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/together" element={<TogetherPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/focus" element={<FocusPage />} />
                <Route path="/academics" element={<AcademicsPage />} />
                <Route path="/exams" element={<ExamsPage />} />
                <Route path="/career" element={<CareerPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* Redirect root and catch-all */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </HashRouter>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
