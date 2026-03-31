import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";

function DashboardLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-area">
        <Topbar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
