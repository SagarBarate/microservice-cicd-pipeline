import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Topbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <h1>Hospital Management Dashboard</h1>
      <button className="btn btn-secondary" onClick={handleLogout} type="button">
        Logout
      </button>
    </header>
  );
}

export default Topbar;
