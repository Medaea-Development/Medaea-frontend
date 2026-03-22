import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { APP_ROUTES } from "../../../../config/constants";
import Loader from "../../../../components/ui/Loader";

const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Get the org selection status
  const selectedOrg = localStorage.getItem("selectedOrganization");

  if (isLoading) {
    return <Loader variant="fullscreen" message="Loading..." />;
  }

  // ONLY redirect to calendar if they are logged in AND have finished org selection
  if (isAuthenticated && selectedOrg) {
    return <Navigate to={APP_ROUTES.CALENDAR} replace />;
  }

  // If they are not authenticated, OR they are authenticated but need to pick an org,
  // stay on the Login page (where the modal is).
  return <Outlet />;
};

export default GuestRoute;
