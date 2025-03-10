import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from './components/Layout';

// Import your page components
import Dashboard from './pages/Dashboard';
import PropertiesPage from './pages/PropertiesPage';
import ProjectsPage from './pages/ProjectsPage';
import BuildingsPage from './pages/BuildingsPage';
import LeadsManagementPage from './pages/LeadsManagementPage';
import UserManagementPage from './pages/UserManagementPage';

// Import Redux actions
import { getProperties } from './redux/features/properties/propertiesSlice';
import { getProjects } from './redux/features/Projects/projectsSlice';
import { getBuildings } from './redux/features/Buildings/buildingsSlice';
import { getLeads } from './redux/features/Leads/leadsSlice';

function App() {
  const dispatch = useDispatch();

  // Pre-fetch some data when the app loads
  useEffect(() => {
    // Only dispatching actions for data we might need on the dashboard
    dispatch(getProperties());
    dispatch(getProjects());
    dispatch(getBuildings());
    dispatch(getLeads());
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/buildings" element={<BuildingsPage />} />
          <Route path="/leads" element={<LeadsManagementPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;