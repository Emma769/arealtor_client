import { REFRESH_TOKEN_KEY } from "../constants/constants";
import useAuth from "./useAuth";

export default function useLogout() {
  const { resetPayload } = useAuth();

  const logout = async () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    resetPayload();
  };

  return logout;
}
