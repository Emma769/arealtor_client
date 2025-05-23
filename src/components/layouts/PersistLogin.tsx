import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import Loading from "../ui/Loading";
import { REFRESH_TOKEN_KEY } from "../../constants/constants";

export default function PersistLogin() {
  const refreshfn = useRefreshToken();
  const { payload } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyLogin = async () => {
      try {
        await refreshfn();
      } catch (err) {
        console.error(err);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!payload.token) {
      verifyLogin();
    } else {
      setLoading(false);
    }
  }, []);

  return loading ? <Loading /> : <Outlet />;
}
