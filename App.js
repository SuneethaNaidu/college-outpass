import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import HodDashboard from './components/HodDashboard';
import SecurityScanner from './components/SecurityScanner';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Parse user info and role from localStorage (set after login)
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const user = storedUser?.uid || null;
  const role = storedUser?.role || null;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!user ? <Auth /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} role={role} allowedRoles={['student']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod"
          element={
            <ProtectedRoute user={user} role={role} allowedRoles={['hod']}>
              <HodDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/security"
          element={
            <ProtectedRoute user={user} role={role} allowedRoles={['security']}>
              <SecurityScanner />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
