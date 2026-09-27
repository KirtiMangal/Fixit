import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import ReportProblem from './pages/ReportProblem';
import MyProblems from './pages/MyProblems';
import ProblemDetails from './pages/ProblemDetails';
import MyThings from './pages/MyThings';

// Modules 2-13 Pages
import Technicians from './pages/Technicians';
import ServiceRequests from './pages/ServiceRequests';
import DiyGuides from './pages/DiyGuides';
import Experts from './pages/Experts';
import Repairs from './pages/Repairs';
import Maintenance from './pages/Maintenance';
import PersonalMaintenanceDashboard from './pages/PersonalMaintenanceDashboard';

import DashboardRouter from './pages/dashboards/DashboardRouter';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import TechnicianDashboard from './pages/dashboards/TechnicianDashboard';
import ExpertDashboard from './pages/dashboards/ExpertDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

const NotFound = () => (
  <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
    <h2>404 - Page Not Found</h2>
    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>The page you are looking for does not exist.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Module 4: DIY Guides */}
          <Route path="/diy-guides" element={<DiyGuides />} />
          <Route path="/resolve" element={<DiyGuides />} />

          {/* Module 2: Technicians Marketplace */}
          <Route path="/technicians" element={<Technicians />} />

          {/* Module 5: Experts Mentoring */}
          <Route path="/experts" element={<Experts />} />

          {/* Inventory & Asset Management */}
          <Route
            path="/things"
            element={
              <ProtectedRoute>
                <MyThings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <MyThings />
              </ProtectedRoute>
            }
          />

          {/* Problem Reporting & AI Diagnosis */}
          <Route
            path="/problems"
            element={
              <ProtectedRoute>
                <MyProblems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems/report"
            element={
              <ProtectedRoute>
                <ReportProblem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems/:id"
            element={
              <ProtectedRoute>
                <ProblemDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/diagnose" element={<Navigate to="/problems/report" replace />} />

          {/* Module 3: Service Requests & Bookings */}
          <Route
            path="/service-requests"
            element={
              <ProtectedRoute>
                <ServiceRequests />
              </ProtectedRoute>
            }
          />

          {/* Module 6: Repair History & Spending Metrics */}
          <Route
            path="/repairs"
            element={
              <ProtectedRoute>
                <Repairs />
              </ProtectedRoute>
            }
          />
          <Route path="/history" element={<Navigate to="/repairs" replace />} />

          {/* Module 7: Maintenance Reminders */}
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <Maintenance />
              </ProtectedRoute>
            }
          />

          {/* Module 11: Personal Maintenance Hub */}
          <Route
            path="/maintenance-hub"
            element={
              <ProtectedRoute>
                <PersonalMaintenanceDashboard />
              </ProtectedRoute>
            }
          />

          {/* Role-Specific Dashboards */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <PersonalMaintenanceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/technician"
            element={
              <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                <TechnicianDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/expert"
            element={
              <ProtectedRoute allowedRoles={['EXPERT']}>
                <ExpertDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </AuthProvider>
  );
}

export default App;
