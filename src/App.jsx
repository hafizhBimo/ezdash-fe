import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MonitoringPage from './pages/MonitoringPage';
import UploadHistoryPage from './pages/UploadHistoryPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/monitoring" 
            element={
              <PrivateRoute>
                <MainLayout>
                  <MonitoringPage />
                </MainLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/upload" 
            element={
              <PrivateRoute roles={['ADMIN']}>
                <MainLayout>
                  <UploadHistoryPage />
                </MainLayout>
              </PrivateRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
