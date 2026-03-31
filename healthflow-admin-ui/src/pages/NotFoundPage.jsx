import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="empty-state">
      <h2>404 - Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link className="btn btn-primary" to="/dashboard">
        Go to dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
