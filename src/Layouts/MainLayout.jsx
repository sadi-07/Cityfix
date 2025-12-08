import { Outlet } from "react-router";
import Navbar from "../Components/Shared/Navbar";
import Footer from "../Components/Shared/Footer";

const MainLayout = () => {
  return (
    <div className="">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
