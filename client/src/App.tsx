import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import { APP_ROUTES } from "./config/constants";

// GLOBAL STYLES
import "./assets/css/default.css";
import "./assets/css/login.css";
import "./assets/css/signup.css";
import "./assets/css/calendar.css";
import "./assets/css/patient.css";

import VerifyEmailPage from "./features/auth/VerifyEmailPage";
import { ToastProvider } from "./context/ToastProvider";
import ProtectedRoute from "./features/auth/components/routes/ProtectedRoute";
import GuestRoute from "./features/auth/components/routes/GuestRoute";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/ui/Loader";
import ResetPasswordPage from "./features/auth/ResetPasswordPage";
import SecuritySettings from "./features/settings/SecuritySettings";
import MainLayout from "./components/layout/MainLayout";
import { FavoritesProvider } from "./context/FavoritesContext";
import ProfilePage from "./features/profile/ProfilePage";
import BookingPage from "./features/booking/BookingPage";
import PatientPage from "./features/patient/PatientPage";
import PatientDetailPage from "./pages/patient/PatientDetailPage";
import PlaceholderPage from "./pages/PlaceholderPage";

// Restored Calendar pages
const CalendarPage          = lazy(() => import("./pages/calendar/CalendarPage"));
const ClinicCalendarPage    = lazy(() => import("./pages/calendar/ClinicCalendarPage"));
const StaffSchedulePage     = lazy(() => import("./pages/calendar/StaffSchedulePage"));
const OnCallSchedulePage    = lazy(() => import("./pages/calendar/OnCallSchedulePage"));
const RoomSchedulePage      = lazy(() => import("./pages/calendar/RoomSchedulePage"));
const BlockedTimePage       = lazy(() => import("./pages/calendar/BlockedTimePage"));
const ScheduleTemplatesPage = lazy(() => import("./pages/calendar/ScheduleTemplatesPage"));
const AvailabilityRulesPage = lazy(() => import("./pages/calendar/AvailabilityRulesPage"));

function App() {
  const HomeRedirect = () => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
      return <Loader variant="fullscreen" message="Securing session..." />;
    }
    return isAuthenticated ? (
      <Navigate to={APP_ROUTES.PATIENT} replace />
    ) : (
      <Navigate to={APP_ROUTES.LOGIN} replace />
    );
  };

  return (
    <Suspense fallback={<Loader variant="fullscreen" message="Loading..." />}>
      <FavoritesProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path={APP_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                {/* Calendar & sub-pages */}
                <Route path="/calendar"              element={<CalendarPage />} />
                <Route path="/calendar/clinic"       element={<ClinicCalendarPage />} />
                <Route path="/calendar/staff"        element={<StaffSchedulePage />} />
                <Route path="/calendar/on-call"      element={<OnCallSchedulePage />} />
                <Route path="/calendar/rooms"        element={<RoomSchedulePage />} />
                <Route path="/calendar/pto"          element={<BlockedTimePage />} />
                <Route path="/calendar/templates"    element={<ScheduleTemplatesPage />} />
                <Route path="/calendar/availability" element={<AvailabilityRulesPage />} />

                {/* Patient & sub-pages — specific routes BEFORE dynamic :id */}
                <Route path="/patient"               element={<PatientPage />} />
                <Route path="/patient/mine"          element={<PatientPage />} />
                <Route path="/patient/recent"        element={<PlaceholderPage title="Recent Patients"      icon="fa-history" />} />
                <Route path="/patient/demographics"  element={<PlaceholderPage title="Patient Demographics" icon="fa-id-card" />} />
                <Route path="/patient/care-team"     element={<PlaceholderPage title="Care Team"            icon="fa-user-md" />} />
                <Route path="/patient/problem-list"  element={<PlaceholderPage title="Problem List"         icon="fa-list-alt" />} />
                <Route path="/patient/allergies"     element={<PlaceholderPage title="Allergies"            icon="fa-exclamation-triangle" />} />
                <Route path="/patient/medications"   element={<PlaceholderPage title="Medications"          icon="fa-pills" />} />
                <Route path="/patient/immunizations" element={<PlaceholderPage title="Immunizations"        icon="fa-syringe" />} />
                <Route path="/patient/:id"           element={<PatientDetailPage />} />

                {/* Billing */}
                <Route path="/billing"           element={<PlaceholderPage title="Billing"    icon="fa-file-invoice-dollar" />} />
                <Route path="/billing/claims"    element={<PlaceholderPage title="Claims"     icon="fa-clipboard-list" />} />
                <Route path="/billing/payments"  element={<PlaceholderPage title="Payments"   icon="fa-credit-card" />} />
                <Route path="/billing/statements"element={<PlaceholderPage title="Statements" icon="fa-file-alt" />} />

                {/* Claims */}
                <Route path="/claims"         element={<PlaceholderPage title="All Claims"    icon="fa-clipboard-list" />} />
                <Route path="/claims/denied"  element={<PlaceholderPage title="Denied Claims" icon="fa-times-circle" />} />
                <Route path="/claims/pending" element={<PlaceholderPage title="Pending Claims"icon="fa-clock" />} />

                {/* Reports */}
                <Route path="/reports/productivity" element={<PlaceholderPage title="Productivity Reports" icon="fa-tachometer-alt" />} />
                <Route path="/reports/financial"    element={<PlaceholderPage title="Financial Reports"    icon="fa-dollar-sign" />} />
                <Route path="/reports/clinical"     element={<PlaceholderPage title="Clinical Reports"     icon="fa-stethoscope" />} />

                {/* EHR */}
                <Route path="/ehr/chart"   element={<PlaceholderPage title="Chart"   icon="fa-file-medical" />} />
                <Route path="/ehr/orders"  element={<PlaceholderPage title="Orders"  icon="fa-prescription" />} />
                <Route path="/ehr/results" element={<PlaceholderPage title="Results" icon="fa-flask" />} />

                {/* Other */}
                <Route path="/profile"  element={<ProfilePage />} />
                <Route path="/settings" element={<SecuritySettings />} />
              </Route>
            </Route>

            <Route path="/book-appointment" element={<BookingPage />} />
          </Routes>
        </ToastProvider>
      </FavoritesProvider>
    </Suspense>
  );
}

export default App;
