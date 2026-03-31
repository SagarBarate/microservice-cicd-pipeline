import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/doctors", label: "Doctors" },
  { to: "/patients", label: "Patients" },
  { to: "/appointments", label: "Appointments" },
  { to: "/appointments/book", label: "Book Appointment" },
  { to: "/health", label: "Health Check" }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>HealthFlow</h2>
      <nav>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "active-nav" : "")}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
