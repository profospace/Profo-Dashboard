import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { LoadScript } from "@react-google-maps/api";


// Import Redux actions
import { getProperties } from './redux/features/properties/propertiesSlice';
import { getProjects } from './redux/features/Projects/projectsSlice';
import { getBuildings } from './redux/features/Buildings/buildingsSlice';
import { getLeads } from './redux/features/Leads/leadsSlice';
import LoadingFallback from './components/LoadingFallback';
import AwsS3ImageGallery from './pages/AwsS3ImageGallery';
import NewListOption from './pages/NewListOption';
import ListOptions from './pages/ListOptions';
import PropertyManagerLayout from './components/Layout';
import DeeplinkGenerator from './pages/DeeplinkGenerator';
import PropertyManagement from './pages/Property/PropertyManagement';
import BuildingManagement from './pages/BuildingManagement';
import ProjectManagementPage from './pages/ProjectManagementPage';
import BuilderAuthConnection from './pages/BuilderAuthConnection';
import PropertyAdd from './pages/Property/PropertyAdd';
import PropertyEdit from './pages/Property/PropertyEdit';
import PropertyDrafts from './pages/Property/PropertyDrafts';
import LoadingPage from './components/Loading/LoadingPage';
import ProjectsListPage from './pages/Project/ProjectsList';
import AddProjectPage from './pages/Project/AddProjectPage';
import EditProjectPage from './pages/Project/EditProjectPage';
import ProjectDetailPage from './pages/Project/ProjectDetailPage';
import ProjectDraftsPage from './pages/Project/ProjectDraftPage';
import CitiesManagementPage from './pages/City/CitiesManagementPage';


// Use lazy loading for page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const BuildingsPage = lazy(() => import('./pages/BuildingsPage'));
const LeadsManagementPage = lazy(() => import('./pages/LeadsManagementPage'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'));


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

  useEffect(
    () => {
      console.log(import.meta.env.VITE_GOOGLE_API_KEY)

    }, []
  )

  return (
    <LoadScript loadingElement={<LoadingPage />} googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <Router>
        <PropertyManagerLayout>
          <Toaster position="top-center" />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/properties" element={<PropertiesPage />} /> */}
              {/* <Route path="/projects" element={<ProjectsPage />} /> */}
              <Route path="/buildings" element={<BuildingsPage />} />
              <Route path="/leads" element={<LeadsManagementPage />} />
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/aws-image-gallery" element={<AwsS3ImageGallery />} />
              <Route path="/new-list-option" element={<NewListOption />} />
              <Route path="/list-option" element={<ListOptions />} />
              <Route path="/deeplink-generator" element={<DeeplinkGenerator />} />

              <Route path="/cities" element={<CitiesManagementPage />} />

              {/* Property */}
              <Route path="/properties-management" element={<PropertyManagement />} />
              <Route path="/property-add" element={<PropertyAdd />} />
              <Route path="/property-edit/:propertyId" element={<PropertyEdit />} />
              <Route path="/property-drafts" element={<PropertyDrafts />} />

              {/* Building */}
              <Route path="/buildings-management" element={<BuildingManagement />} />
              {/* Project */}
              {/* <Route path="/projects-management" element={<ProjectManagementPage />} /> */}
              <Route path="/projects" element={<ProjectsListPage />} />
              <Route path="/projects/add" element={<AddProjectPage />} />
              <Route path="/projects/edit/:projectId" element={<EditProjectPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
              <Route path="/projects/drafts" element={<ProjectDraftsPage />} />
              {/* builder */}
              <Route path="/builder-auth-connection" element={<BuilderAuthConnection />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </PropertyManagerLayout>
      </Router>
    </LoadScript>
  );
}

export default App;