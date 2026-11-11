// LEVEL UP 73 - Main Application Router
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Academics } from './pages/Academics';
import { DSATracker } from './pages/DSATracker';
import { EditingTracker } from './pages/EditingTracker';
import { EnglishTracker } from './pages/EnglishTracker';
import { GymTracker } from './pages/GymTracker';
import { WebDesigning } from './pages/WebDesigning';
import { Analytics } from './pages/Analytics';
import { CalendarPlanner } from './pages/CalendarPlanner';
import { Settings } from './pages/Settings';
import { Auth } from './pages/Auth';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400">Loading LEVEL UP 73...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Layout />;
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />

            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/dsa" element={<DSATracker />} />
              <Route path="/editing" element={<EditingTracker />} />
              <Route path="/english" element={<EnglishTracker />} />
              <Route path="/gym" element={<GymTracker />} />
              <Route path="/web" element={<WebDesigning />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/calendar" element={<CalendarPlanner />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
