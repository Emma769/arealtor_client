import { useCallback } from "react";
import { api } from "../api";
import useAuth from "./useAuth";

export default function useLogout() {
  const { resetPayload } = useAuth();

  const logout = async () => {
    await api.delete("/api/auth/logout", {
      withCredentials: true,
    });
    resetPayload();
  };

  return useCallback(logout, []);
}
