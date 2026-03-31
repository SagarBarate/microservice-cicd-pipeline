import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/common/Alert";
import InputField from "../../components/common/InputField";
import { useAuth } from "../../hooks/useAuth";
import { loginUser } from "../../services/authService";
import { getErrorMessage } from "../../utils/helpers";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = await loginUser(username.trim());
      if (!token) {
        throw new Error("Login succeeded but token was missing.");
      }
      login(token);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Login failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>HealthFlow Admin Login</h1>
        <p>Sign in with your username to continue.</p>
        <InputField
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />
        <Alert type="error" message={error} />
        <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
