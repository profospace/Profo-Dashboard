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

// layout
import PropertyManagerLayout from './components/Layout';
import LoadingPage from './components/Loading/LoadingPage';


// Pages
// import AwsS3ImageGallery from './pages/AwsS3ImageGallery';
// import NewListOption from './pages/NewListOption';
// import ListOptions from './pages/ListOptions';
// import DeeplinkGenerator from './pages/DeeplinkGenerator';
// import PropertyManagement from './pages/Property/PropertyManagement';
// import BuilderAuthConnection from './pages/Builder Management/BuilderAuthConnection';
// import PropertyAdd from './pages/Property/PropertyAdd';
// import PropertyEdit from './pages/Property/PropertyEdit';
// import PropertyDrafts from './pages/Property/PropertyDrafts';
// import ProjectsListPage from './pages/Project/ProjectsList';
// import AddProjectPage from './pages/Project/AddProjectPage';
// import EditProjectPage from './pages/Project/EditProjectPage';
// import ProjectDetailPage from './pages/Project/ProjectDetailPage';
// import ProjectDraftsPage from './pages/Project/ProjectDraftPage';
// import CitiesManagementPage from './pages/City/CitiesManagementPage';
// import ColorsPage from './pages/ColorApiForm/ColorsPage';
// import AdsPage from './pages/Ads Management/AdsPage';
// import AdCreatePage from './pages/Ads Management/AdCreatePage';
// import AdEditPage from './pages/Ads Management/AdEditPage';
// import BuildersListPage from './pages/Builder Management/BuilderListPage';
// import BuilderUploadPage from './pages/Builder Management/BuilderUploadPage';
// import BuilderDetailPage from './pages/Builder Management/BuilderDetailPage';
// import BuilderUpdateInfo from './pages/Builder Management/BuilderUpdateInfo';
// import CreateBuildingPage from './pages/Building/CreateBuildingPage';
// import EditBuildingPage from './pages/Building/EditBuildingPage';
// import AllBuildingsPage from './pages/Building/AllBuildingsPage';
// import UploadBuildingPage from './pages/Building/UploadBuildingPage';
// import BuildingDetailPage from './pages/Building/BuildingDetailPage';
// import DraftBuildingsPage from './pages/Building/DraftBuildingsPage';
// import ConnectPropertiesPage from './pages/Project/ConnectPropertiesPage';
// import DisconnectPropertiesPage from './pages/Project/DisconnectPropertiesPage';
// import AndroidFeedPreview from './pages/Testing/AndroidFeedPreview';
// import ConnectPropertiesToBuildingPage from './pages/Building/ConnectPropertiesToBuildingPage';
// import DisconnectPropertiesFromBuildingPage from './pages/Building/DisconnectPropertiesFromBuildingPage';
// import ConnectBuildingsPage from './pages/Builder Management/ConnectBuildingsPage';
// import DisconnectBuildingsPage from './pages/Builder Management/DisconnectBuildingsPage';
// import ConnectProjectsPage from './pages/Builder Management/ConnectProjectsPage';
// import DisconnectProjectsPage from './pages/Builder Management/DisconnectProjectsPage';

const AwsS3ImageGallery = lazy(() => import('./pages/AwsS3ImageGallery'));
const NewListOption = lazy(() => import('./pages/NewListOption'));
const ListOptions = lazy(() => import('./pages/ListOptions'));
const DeeplinkGenerator = lazy(() => import('./pages/DeeplinkGenerator'));
const PropertyManagement = lazy(() => import('./pages/Property/PropertyManagement'));
const BuilderAuthConnection = lazy(() => import('./pages/Builder Management/BuilderAuthConnection'));
const PropertyAdd = lazy(() => import('./pages/Property/PropertyAdd'));
const PropertyEdit = lazy(() => import('./pages/Property/PropertyEdit'));
const PropertyDrafts = lazy(() => import('./pages/Property/PropertyDrafts'));
const ProjectsListPage = lazy(() => import('./pages/Project/ProjectsList'));
const AddProjectPage = lazy(() => import('./pages/Project/AddProjectPage'));
const EditProjectPage = lazy(() => import('./pages/Project/EditProjectPage'));
const ProjectDetailPage = lazy(() => import('./pages/Project/ProjectDetailPage'));
const ProjectDraftsPage = lazy(() => import('./pages/Project/ProjectDraftPage'));
const CitiesManagementPage = lazy(() => import('./pages/City/CitiesManagementPage'));
const ColorsPage = lazy(() => import('./pages/ColorApiForm/ColorsPage'));
const AdsPage = lazy(() => import('./pages/Ads Management/AdsPage'));
const AdCreatePage = lazy(() => import('./pages/Ads Management/AdCreatePage'));
const AdEditPage = lazy(() => import('./pages/Ads Management/AdEditPage'));
const BuildersListPage = lazy(() => import('./pages/Builder Management/BuilderListPage'));
const BuilderUploadPage = lazy(() => import('./pages/Builder Management/BuilderUploadPage'));
const BuilderDetailPage = lazy(() => import('./pages/Builder Management/BuilderDetailPage'));
const BuilderUpdateInfo = lazy(() => import('./pages/Builder Management/BuilderUpdateInfo'));
const CreateBuildingPage = lazy(() => import('./pages/Building/CreateBuildingPage'));
const EditBuildingPage = lazy(() => import('./pages/Building/EditBuildingPage'));
const AllBuildingsPage = lazy(() => import('./pages/Building/AllBuildingsPage'));
const UploadBuildingPage = lazy(() => import('./pages/Building/UploadBuildingPage'));
const BuildingDetailPage = lazy(() => import('./pages/Building/BuildingDetailPage'));
const DraftBuildingsPage = lazy(() => import('./pages/Building/DraftBuildingsPage'));
const ConnectProjectPropertiesPage = lazy(() => import('./pages/Project/ConnectProjectPropertiesPage'));
const DisconnectProjectPropertiesPage = lazy(() => import('./pages/Project/DisconnectProjectPropertiesPage'));
const AndroidFeedPreview = lazy(() => import('./pages/Testing/AndroidFeedPreview'));
const ConnectPropertiesToBuildingPage = lazy(() => import('./pages/Building/ConnectPropertiesToBuildingPage'));
const DisconnectPropertiesFromBuildingPage = lazy(() => import('./pages/Building/DisconnectPropertiesFromBuildingPage'));


import ConnectBuilderBuildingsPage from './pages/Builder Management/ConnectBuilderBuildingsPage';
import DisconnectBuilderBuildingsPage from './pages/Builder Management/DisconnectBuilderBuildingsPage';
import ConnectBuilderProjectsPage from './pages/Builder Management/ConnectBuilderProjectsPage';
import DisconnectBuilderProjectsPage from './pages/Builder Management/DisconnectBuilderProjectsPage';
import ConnectBuilderPropertiesPage from './pages/Builder Management/ConnectBuilderPropertiesPage';
import DisconnectBuilderPropertiesPage from './pages/Builder Management/DisconnectBuilderPropertiesPage';
import UsersManagement from './pages/User/UsersManagement';
import UserActivity from './pages/User/UserActivity';
import AdList from './pages/Ads Management/AdList';
import AdForm from './pages/Ads Management/AdForm';
import AdDetail from './pages/Ads Management/AdDetail';

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
              {/* <Route path="/buildings" element={<BuildingsPage />} /> */}

              {/* User */}
              <Route path="/user-management" element={<UsersManagement />} />
              <Route path="/user-activity/:userId/history" element={<UserActivity />} />



              <Route path="/leads" element={<LeadsManagementPage />} />
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/aws-image-gallery" element={<AwsS3ImageGallery />} />
              <Route path="/new-list-option" element={<NewListOption />} />
              <Route path="/list-option" element={<ListOptions />} />
              <Route path="/deeplink-generator" element={<DeeplinkGenerator />} />

              <Route path="/cities" element={<CitiesManagementPage />} />

              {/* color api */}
              <Route path="/color-api" element={<ColorsPage />} />

              {/* ads managementr */}
              {/* <Route path="/ads" element={<AdList />} />
              <Route path="/post-new-ad" element={<AdCreatePage />} />
              <Route path="/edit-ad/:id" element={<AdEditPage />} /> */}
              <Route path="/ads" element={<AdList />} />
              <Route path="/ads/post-new-ad" element={<AdForm />} />
              <Route path="/ads/:id" element={<AdDetail />} />
              <Route path="/ads/:id/edit" element={<AdForm />} />

              {/* Builder */}
              <Route path="/builder/all" element={<BuildersListPage />} />
              <Route path="/builder/upload" element={<BuilderUploadPage />} />
              <Route path="/builder/detail/:id" element={<BuilderDetailPage />} />
              <Route path="/builder/update/:builderId" element={<BuilderUpdateInfo />} />
              <Route path="/builder-auth-connection" element={<BuilderAuthConnection />} />

              {/* Builder-Building , Project , Properties */}
              <Route path="/builder/connect-buildings/:builderId" element={<ConnectBuilderBuildingsPage />} />
              <Route path="/builder/disconnect-buildings/:builderId" element={<DisconnectBuilderBuildingsPage />} />

              <Route path="/builder/connect-projects/:builderId" element={<ConnectBuilderProjectsPage />} />
              <Route path="/builder/disconnect-projects/:builderId" element={<DisconnectBuilderProjectsPage />} />

              <Route path="/builder/connect-properties/:builderId" element={<ConnectBuilderPropertiesPage />} />
              <Route path="/builder/disconnect-properties/:builderId" element={<DisconnectBuilderPropertiesPage />} />




              {/* Property */}
              <Route path="/properties-management" element={<PropertyManagement />} />
              <Route path="/property-add" element={<PropertyAdd />} />
              <Route path="/property-edit/:propertyId" element={<PropertyEdit />} />
              <Route path="/property-drafts" element={<PropertyDrafts />} />

              {/* Building */}
              {/* <Route path="/upload-new-building" element={<CreateBuildingPage />} />
              <Route path="/edit-building/:id" element={<EditBuildingPage />} />
              <Route path="/building/detail/:id" element={<BuilderDetailPage />} />
              <Route path="/building/all" element={<BuildersListPage />} /> */}
              <Route path="/buildings" element={<AllBuildingsPage />} />
              <Route path="/buildings/new" element={<UploadBuildingPage />} />
              <Route path="/buildings/edit/:buildingId" element={<EditBuildingPage />} />
              <Route path="/buildings/:buildingId" element={<BuildingDetailPage />} />
              <Route path="/buildings/drafts" element={<DraftBuildingsPage />} />
              <Route path="/buildings/connect/:buildingId" element={<ConnectPropertiesToBuildingPage />} />
              <Route path="/buildings/disconnect/:buildingId" element={<DisconnectPropertiesFromBuildingPage />} />

              {/* Project */}
              {/* <Route path="/projects-management" element={<ProjectManagementPage />} /> */}
              <Route path="/projects" element={<ProjectsListPage />} />
              <Route path="/projects/add" element={<AddProjectPage />} />
              <Route path="/projects/edit/:projectId" element={<EditProjectPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
              <Route path="/projects/drafts" element={<ProjectDraftsPage />} />
              <Route path="/projects/:projectId/connect-properties" element={<ConnectProjectPropertiesPage />} />
              <Route path="/projects/:projectId/disconnect-properties" element={<DisconnectProjectPropertiesPage />} />

              {/* <Route path="/testing" element={<AndroidFeedPreview />} /> */}

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </PropertyManagerLayout>
      </Router>
    </LoadScript>
  );
}

export default App;