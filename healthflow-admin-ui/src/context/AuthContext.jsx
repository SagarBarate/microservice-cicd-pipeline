import { createContext, useEffect, useMemo, useState } from "react";
import { TOKEN_KEY } from "../utils/constants";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token));

  useEffect(() => {
    setIsAuthenticated(Boolean(token));
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem(TOKEN_KEY, jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const value = useMemo(
    () => ({ token, isAuthenticated, login, logout }),
    [token, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
