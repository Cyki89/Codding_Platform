import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "../api/axios";

const AuthContext = createContext();

export default AuthContext;

const NORMAL_USER = 0;
const ADMIN_USER = 1;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState();
  const [user, setUser] = useState();

  const navigate = useNavigate();

  const login = async ({ email, password }) => {
    const response = await axios.post(
      "/login",
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    const data = response.data;
    setAccessToken(data.access_token);
    setUser(jwtDecode(data.access_token));
  };

  const logout = async () => {
    await axios.post("/logout", {}, { withCredentials: true });

    setAccessToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  const isAdmin = () => {
    return user && user.role === ADMIN_USER;
  };

  const contextData = {
    user,
    isAdmin,
    accessToken,
    setAccessToken,
    setUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
