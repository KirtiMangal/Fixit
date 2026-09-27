import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PersonalMaintenanceDashboard from '../PersonalMaintenanceDashboard';
import TechnicianDashboard from './TechnicianDashboard';
import ExpertDashboard from './ExpertDashboard';
import AdminDashboard from './AdminDashboard';

export const DashboardRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'TECHNICIAN':
      return <TechnicianDashboard />;
    case 'EXPERT':
      return <ExpertDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'CUSTOMER':
    default:
      return <PersonalMaintenanceDashboard />;
  }
};

export default DashboardRouter;
