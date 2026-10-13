import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, logoutRequest, profileRequest, registerRequest } from "../../api/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al abrir la página revisamos si ya hay una sesión (cookie) activa
  useEffect(() => {
    profileRequest()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signup = async (data) => {
    const newUser = await registerRequest(data);
    setUser(newUser);
    return newUser;
  };

  const signin = async (data) => {
    const loggedUser = await loginRequest(data);
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = async () => {
    await logoutRequest().catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: user?.rol === "admin", signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
