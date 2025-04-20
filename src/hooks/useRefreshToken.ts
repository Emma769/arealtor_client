import { api } from "../api";
import { REFRESH_TOKEN_KEY } from "../constants/constants";
import useAuth from "./useAuth";

export default function useRefreshToken() {
  const { setPayload } = useAuth();

  const refresh = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const resp = await api.post("/api/auth/refresh", { refreshToken });
    const payload = resp.data;
    setPayload((prev) => ({ ...prev, token: payload.accessToken.value }));
    return payload.value;
  };

  return refresh;
}
