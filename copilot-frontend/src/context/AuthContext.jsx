import { createContext, useContext, useState, useCallback } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("copilot_token"),
  );

  const login = useCallback(async (username, password) => {
    if (import.meta.env.VITE_MOCK_AUTH === "true") {
      if (!username || !password)
        throw {
          response: { data: { detail: "Username and password required" } },
        };
      const fakeToken = `mock.${btoa(username)}.token`;
      localStorage.setItem("copilot_token", fakeToken);
      setToken(fakeToken);
      return { access_token: fakeToken };
    }

    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("copilot_token", data.access_token);
    setToken(data.access_token);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("copilot_token");
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, login, logout }}
      git
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
