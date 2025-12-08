import { Outlet } from "react-router";
import Navbar from "../Components/Shared/Navbar";

const MainLayout = () => {
  return (
    <div className="">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
