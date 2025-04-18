import { PiHouseBold, PiSignOutBold } from "react-icons/pi";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";

export default function Nav() {
  const { payload } = useAuth();
  const logoutfn = useLogout();

  return (
    <nav className="flex justify-between items-center h-[10vh]">
      <Link to="/">
        <PiHouseBold className="text-2xl opacity-80 hover:opacity-100 transition-opacity" />
      </Link>
      <div>
        {payload.token && (
          <button onClick={logoutfn} className="cursor-pointer">
            <PiSignOutBold className="text-2xl opacity-80 hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>
    </nav>
  );
}
