import { api } from "../api";
import useAuth from "./useAuth";

export default function useRefreshToken() {
  const { setPayload } = useAuth();

  const refresh = async () => {
    const resp = await api.get("/api/auth/refresh", {
      withCredentials: true,
    });
    const payload = resp.data;
    setPayload(payload);
    return payload.token;
  };

  return refresh;
}
