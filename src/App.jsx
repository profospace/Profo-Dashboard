import React, { useEffect, lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { LoadScript } from "@react-google-maps/api";

// Import Redux actions
import { getProperties } from './redux/features/Properties/propertiesSlice';
import { getProjects } from './redux/features/Projects/projectsSlice';
import { getBuildings } from './redux/features/Buildings/buildingsSlice';
import { getLeads } from './redux/features/Leads/leadsSlice';
import LoadingFallback from './components/LoadingFallback';

// layout
import PropertyManagerLayout from './components/Layout/Layout';
import LoadingPage from './components/Loading/LoadingPage';


// Pages
const AwsS3ImageGallery = lazy(() => import('./pages/AwsS3ImageGallery'));
const NewListOption = lazy(() => import('./pages/NewListOption'));
const ListOptions = lazy(() => import('./pages/ListOptions'));
const DeeplinkGenerator = lazy(() => import('./pages/Deeplink/DeeplinkGenerator'));
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


// Builder Management Pages
const ConnectBuilderBuildingsPage = lazy(() => import('./pages/Builder Management/ConnectBuilderBuildingsPage'));
const DisconnectBuilderBuildingsPage = lazy(() => import('./pages/Builder Management/DisconnectBuilderBuildingsPage'));
const ConnectBuilderProjectsPage = lazy(() => import('./pages/Builder Management/ConnectBuilderProjectsPage'));
const DisconnectBuilderProjectsPage = lazy(() => import('./pages/Builder Management/DisconnectBuilderProjectsPage'));
const ConnectBuilderPropertiesPage = lazy(() => import('./pages/Builder Management/ConnectBuilderPropertiesPage'));
const DisconnectBuilderPropertiesPage = lazy(() => import('./pages/Builder Management/DisconnectBuilderPropertiesPage'));

// User Management Pages
const UsersManagement = lazy(() => import('./pages/User/UsersManagement'));
const UserActivity = lazy(() => import('./pages/User/UserActivity'));

// Ads Management
const AdList = lazy(() => import('./pages/Ads Management/AdList'));
const AdForm = lazy(() => import('./pages/Ads Management/AdForm'));
const AdDetail = lazy(() => import('./pages/Ads Management/AdDetail'));

// Reports
const ReportPage = lazy(() => import('./pages/Reports/ReportPage'));

// Color API Form
const ColorGradientPage = lazy(() => import('./pages/ColorApiForm/ColorGradientPage'));

// Callbacks
const Callbacks = lazy(() => import('./pages/Callback/Callbacks'));

// List Option
const ListOptionDashboard = lazy(() => import('./pages/ListOption/ListOptionDashboard'));
const UnifiedListOption = lazy(() => import('./components/ListOptions/UnifiedListOption'));
const HomeScreen = lazy(() => import('./pages/ListOption/HomeScreen'));
const ListOptionsSequence = lazy(() => import('./pages/ListOption/ListOptionsSequence'));

// Upload Entity Images
const EntityImageUpload = lazy(() => import('./pages/UploadEnitityImages/EntityImageUpload'));


const BuildingViewer = lazy(() => import('./pages/Viewer/BuildingViewer'));
const BuildingManager = lazy(() => import('./pages/Viewer/BuildingManager'));
const Manager = lazy(() => import('./pages/Viewer/Manager'));
const AdminEmailDashboard = lazy(() => import('./pages/AdminEmailDashboard'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const VerifyEmail = lazy(() => import('./pages/Verification/VerifyEmail'));

// Use lazy loading for page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const BuildingsPage = lazy(() => import('./pages/BuildingsPage'));
const LeadsManagementPage = lazy(() => import('./pages/LeadsManagementPage'));

const AuthenticationForm = lazy(() => import("./pages/Authentication/Auth/Auth"));
const LoginForm = lazy(() => import("./pages/Authentication/Login/Login"));
const SignupForm = lazy(() => import("./pages/Authentication/Signup/Signup"));
const Error = lazy(() => import('./pages/PageNotfound/Error'));
import ProtectedRoutes from './routing/ProtectedRoutes';
// import { jwtDecode } from "jwt-decode";
import AdminSyncDashboard from './pages/AdminDBSync/AdminSyncDashboard';
import WatermarkManager from './pages/Watermark/WatermarkManager';
import NotificationDashboard from './pages/Notification/NotificationDashboard';

// import { getDeviceToken } from './services/notification';
// import { onMessage } from 'firebase/messaging';
// import { messaging } from './services/firebaseInitialize';
import { getDeviceToken } from './services/notification';
import NotificationToast from './components/NotificationDashboard/NotificationToast';
import { onMessage } from 'firebase/messaging';
import { messaging } from './services/firebaseInitialize';
import NotificationStats from './pages/Notification/NotificationStats';
import AdminDBSyncHistory from './pages/AdminDBSync/AdminDBSyncHistory';
import HomePage from './pages/Video/HomePage';
import VideoUploadPage from './pages/Video/VideoUploadPage';
import VideoGalleryPage from './pages/Video/VideoGalleryPage';
import VideoPlayerPage from './pages/Video/VideoPlayerPage';
import MailDashboard from './pages/UserRecommandation/MailDashboard';
import EmailConfig from './pages/UserRecommandation/EmailConfig';
import EmailTemplates from './pages/UserRecommandation/EmailTemplates';
import EmailLogs from './pages/UserRecommandation/EmailLogs';
import ContactDashboard from './pages/UserBuilderContactDashboard/ContactDashboard';
import FunnelAnalyticsDashboard from './pages/UserBuilderContactDashboard/FunnelAnalyticsDashboard';

function App() {
  const date = new Date('2025-06-06T12:01:00.000Z')
  console.log("checkDate", date.toLocaleString())
  // const dispatch = useDispatch();
  // const navigate = useNavigate()

  // const CheckAuth = () => {
  //   const token = localStorage.getItem("authToken");

  //   if (token) {
  //     const decoded = jwtDecode(token); // doesn't verify, just decodes
  //     const currentTime = Date.now() / 1000;

  //     if (decoded?.exp && decoded.exp < currentTime) {
  //       localStorage.removeItem("authToken");
  //       navigate("/");
  //     } else {
  //       // console.log("User authenticated", decoded);
  //       // Optionally dispatch to redux: dispatch(setUser(decoded));
  //     }
  //   } else {
  //     navigate("/");
  //   }
  // };

  // useEffect(
  //   () => {
  //     CheckAuth()
  //   }, []
  // )


  // const [deviceToken, setDeviceToken] = useState(null);
  // const [notification, setNotification] = useState(null);

  // useEffect(() => {
  //   // Register service worker first to ensure it's available
  //   const registerServiceWorker = async () => {
  //     if ('serviceWorker' in navigator) {
  //       try {
  //         console.log('Registering service worker...');
  //         const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
  //           scope: '/'
  //         });
  //         console.log('Service worker registered successfully:', registration);
  //         return true;
  //       } catch (error) {
  //         console.error('Service worker registration failed:', error);
  //         return false;
  //       }
  //     } else {
  //       console.warn('Service workers not supported in this browser');
  //       return false;
  //     }
  //   };

  //   // Request notification permission and get device token when component mounts
  //   const initializeNotifications = async () => {
  //     try {
  //       // First ensure service worker is registered
  //       const swRegistered = await registerServiceWorker();

  //       if (!swRegistered) {
  //         console.warn('Skipping FCM token retrieval due to service worker registration failure');
  //         return;
  //       }

  //       // Wait a moment for service worker to initialize
  //       setTimeout(async () => {
  //         const token = await getDeviceToken();
  //         if (token) {
  //           console.log('Successfully retrieved FCM token');
  //           setDeviceToken(token);

  //           // You might want to send this token to your backend
  //           // Example: await sendTokenToBackend(token);
  //         } else {
  //           console.warn('FCM token retrieval failed or was denied');
  //         }
  //       }, 1000);
  //     } catch (error) {
  //       console.error('Error initializing notifications:', error);
  //     }
  //   };

  //   initializeNotifications();

  //   // Set up foreground message listener
  //   let unsubscribe = () => { };
  //   try {
  //     unsubscribe = onMessage(messaging, (payload) => {
  //       console.log('Foreground message received:', payload);
  //       setNotification({
  //         title: payload.notification?.title || 'New notification',
  //         body: payload.notification?.body || '',
  //         timestamp: new Date().toLocaleTimeString()
  //       });
  //     });
  //   } catch (error) {
  //     console.error('Error setting up message listener:', error);
  //   }

  //   // Clean up listener on component unmount
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  // console.log("deviceToken", deviceToken)

  const [deviceToken, setDeviceToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [tokenRegistered, setTokenRegistered] = useState(false);

  useEffect(() => {
    // Initialize notifications when component mounts
    initializeNotifications();

    // Set up foreground notification listener
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      setNotification({
        title: payload.notification?.title || 'New notification',
        body: payload.notification?.body || '',
        data: payload.data || {},
        timestamp: new Date().toLocaleTimeString()
      });
    });

    // Clean up listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Initialize notification system
  const initializeNotifications = async () => {
    try {
      // Get device token 
      const token = await getDeviceToken();

      if (token) {
        console.log('Successfully retrieved FCM token');
        setDeviceToken(token);
        setTokenRegistered(true);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  // Clear current notification
  const dismissNotification = () => {
    setNotification(null);
  };

  // console.log("deviceToken", deviceToken)

  return (
    <LoadScript loadingElement={<LoadingPage />} googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <Toaster position="top-center" />
      {/* Routes outside of layout */}
      <Suspense fallback={<LoadingFallback />}>
        {notification && (
          <NotificationToast
            notification={notification}
            onClose={dismissNotification}
          />
        )}
        <Routes>
          <Route path='/' element={<AuthenticationForm />} />
          <Route path='/signup' element={<SignupForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path="/api/admin/verify-email/:token" element={<VerifyEmail />} />

          <Route path='/' element={<ProtectedRoutes><PropertyManagerLayout /></ProtectedRoutes>}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/testing-dash" element={<AdminEmailDashboard />} />

            {/* User Recommdation Email */}
            <Route path="/email-dashboard" element={<MailDashboard />} />
            <Route path="/email-config" element={<EmailConfig />} />
            <Route path="/email-templates" element={<EmailTemplates />} />
            <Route path="/email-logs" element={<EmailLogs />} />
            {/* <Route path="*" element={<NotFound />} /> */}

            {/* Notification */}
            <Route path="/notification" element={<NotificationDashboard />} />
            <Route path="/notification-stats" element={<NotificationStats />} />

            {/* Video Streaming */}
            <Route path="/video/home" element={<HomePage />} />
            <Route path="/upload" element={<VideoUploadPage />} />
            <Route path="/videos" element={<VideoGalleryPage />} />
            <Route path="/videos/:videoId" element={<VideoPlayerPage />} />

            {/* watermark */}
            <Route path="/watermark" element={<WatermarkManager />} />


            {/* Db sync */}
            <Route path="/sync-db-prod" element={<AdminSyncDashboard />} />
            <Route path="/admin/sync-history" element={<AdminDBSyncHistory />} />

            {/* users */}
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:userId" element={<UserProfilePage />} />

            {/* Leads Management */}
            <Route path="/leads" element={<LeadsManagementPage />} />



            {/* Viewer */}
            <Route path="/viewer-manager" element={<Manager />} />
            <Route path="/viewer" element={<BuildingViewer />} />
            <Route path="/manager" element={<BuildingManager />} />


            <Route path="/upload" element={<EntityImageUpload />} />

            {/* list options */}
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/list-options-dashboard" element={<ListOptionDashboard />} />
            <Route path="/unified-list-options" element={<UnifiedListOption />} />

              // working listoption
            <Route path="/list-option" element={<ListOptions />} />
            <Route path="/list-options/sequence" element={<ListOptionsSequence />} />

            {/* Report */}
            <Route path="/reports" element={<ReportPage />} />

            <Route path="/aws-image-gallery" element={<AwsS3ImageGallery />} />
            <Route path="/new-list-option" element={<NewListOption />} />
            <Route path="/deeplink-generator" element={<DeeplinkGenerator />} />

            <Route path="/cities" element={<CitiesManagementPage />} />

            {/* color api */}
            <Route path="/color-api" element={<ColorGradientPage />} />

            {/* callback */}
            <Route path="/callbacks" element={<Callbacks />} />

            {/* User - Bulider Contact Interaction */}
            <Route path="/contact-interaction" element={<ContactDashboard />} />
            <Route path="/funnel-analytics" element={<FunnelAnalyticsDashboard />} />

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
            <Route path="/buildings" element={<AllBuildingsPage />} />
            <Route path="/buildings/new" element={<UploadBuildingPage />} />
            <Route path="/buildings/edit/:buildingId" element={<EditBuildingPage />} />
            <Route path="/buildings/:buildingId" element={<BuildingDetailPage />} />
            <Route path="/buildings/drafts" element={<DraftBuildingsPage />} />
            <Route path="/buildings/connect/:buildingId" element={<ConnectPropertiesToBuildingPage />} />
            <Route path="/buildings/disconnect/:buildingId" element={<DisconnectPropertiesFromBuildingPage />} />

            {/* Project */}
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/projects/add" element={<AddProjectPage />} />
            <Route path="/projects/edit/:projectId" element={<EditProjectPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="/projects/drafts" element={<ProjectDraftsPage />} />
            <Route path="/projects/:projectId/connect-properties" element={<ConnectProjectPropertiesPage />} />
            <Route path="/projects/:projectId/disconnect-properties" element={<DisconnectProjectPropertiesPage />} />

            {/* <Route path="/testing" element={<AndroidFeedPreview />} /> */}

            <Route path='*' element={<Error />} />
          </Route>
        </Routes>
      </Suspense>

    </LoadScript>
  );
}

export default App;