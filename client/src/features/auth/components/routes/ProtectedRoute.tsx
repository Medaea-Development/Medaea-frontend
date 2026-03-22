import { Navigate, Outlet } from "react-router-dom";
import { APP_ROUTES } from "../../../../config/constants";
import { useAuth } from "../../../../hooks/useAuth";
import Loader from "../../../../components/ui/Loader";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const selectedOrg = localStorage.getItem("selectedOrganization");

  if (isLoading) {
    return <Loader variant="fullscreen" message="Accessing secure area..." />;
  }

  // If not logged in, go to Login
  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  // If logged in but no org, go to Login (where the Modal lives)
  // BUT: Ensure GuestRoute doesn't bounce them back here!
  if (!selectedOrg) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
