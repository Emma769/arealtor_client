import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import Loading from "../ui/Loading";

export default function PersistLogin() {
  const refreshfn = useRefreshToken();
  const { payload } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await refreshfn();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (payload.token) {
      setLoading(false);
      return;
    }

    verifyLogin();
  }, []);

  return loading ? <Loading /> : <Outlet />;
}
