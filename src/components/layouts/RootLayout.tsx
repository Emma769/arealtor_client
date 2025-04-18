import { Outlet } from "react-router";
import Nav from "../ui/Nav";

export default function RootLayout() {
  return (
    <div className="w-[809px] max-w-[90%] mx-auto">
      <Nav />
      <Outlet />
    </div>
  );
}
