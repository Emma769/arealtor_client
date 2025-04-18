import { useEffect } from "react";
import { xapi } from "../api";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

export default function useAxiosPrivate() {
  const { payload } = useAuth();
  const refreshfn = useRefreshToken();

  useEffect(() => {
    const req = xapi.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `${payload.type} ${payload.token}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const res = xapi.interceptors.response.use(
      (resp) => resp,
      async (err) => {
        const config = err?.config;
        if (err.status === 401 && !config?.sent) {
          config.sent = true;
          const token = await refreshfn();
          config.headers.Authorization = `${payload.type} ${token}`;
          return xapi(config);
        }
        return Promise.reject(err);
      }
    );

    return () => {
      xapi.interceptors.request.eject(req);
      xapi.interceptors.response.eject(res);
    };
  }, [payload.token]);

  return xapi;
}
