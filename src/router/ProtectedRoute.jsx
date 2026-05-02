import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const isLoggedIn = !!localStorage.getItem("token");
  const location = useLocation();

  return isLoggedIn
    ? <Outlet />
    : (
      <Navigate
        to="/login"
        state={{ redirectTo: location.pathname }}
        replace
      />
    );
}

export default ProtectedRoute;