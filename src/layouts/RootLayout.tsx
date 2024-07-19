import { Outlet } from "react-router-dom";
import NavBar from "../pages/Navbar";

const RootLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-grow">
        <Outlet />
      </div>
      <NavBar />
    </div>
  );
};

export default RootLayout;
