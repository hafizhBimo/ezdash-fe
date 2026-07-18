import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MonitoringPage from './pages/MonitoringPage';
import StokConsignmentPage from './pages/StokConsignmentPage';
import PemakaianPage from './pages/PemakaianPage';
import CoveragePage from './pages/CoveragePage';
import AlertExceptionPage from './pages/AlertExceptionPage';
import DeadStockPage from './pages/DeadStockPage';
import LaporanDetailPage from './pages/LaporanDetailPage';
import SettingsPage from './pages/SettingsPage';
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

          <Route path="/stok-consignment" element={<PrivateRoute><MainLayout><StokConsignmentPage /></MainLayout></PrivateRoute>} />
          <Route path="/pemakaian" element={<PrivateRoute><MainLayout><PemakaianPage /></MainLayout></PrivateRoute>} />
          <Route path="/coverage" element={<PrivateRoute><MainLayout><CoveragePage /></MainLayout></PrivateRoute>} />
          <Route path="/alert-exception" element={<PrivateRoute><MainLayout><AlertExceptionPage /></MainLayout></PrivateRoute>} />
          <Route path="/dead-stock" element={<PrivateRoute><MainLayout><DeadStockPage /></MainLayout></PrivateRoute>} />
          <Route path="/laporan-detail" element={<PrivateRoute><MainLayout><LaporanDetailPage /></MainLayout></PrivateRoute>} />

          <Route 
            path="/settings" 
            element={
              <PrivateRoute roles={['ADMIN']}>
                <MainLayout>
                  <SettingsPage />
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
