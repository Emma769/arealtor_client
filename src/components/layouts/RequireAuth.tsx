import { Outlet, Navigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function RequireAuth() {
  const location = useLocation();
  const { payload } = useAuth();

  return payload.token ? (
    <Outlet />
  ) : (
    <Navigate to="login" replace state={{ from: location }} />
  );
}
