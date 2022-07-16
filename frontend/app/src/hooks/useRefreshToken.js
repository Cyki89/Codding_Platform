import jwtDecode from "jwt-decode";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAccessToken, setUser } = useAuth();

  const refresh = async () => {
    const response = await axios.post(
      "/jwt/refresh",
      {},
      { withCredentials: true }
    );

    const access = response.data.access_token;
    setAccessToken(access);
    setUser(jwtDecode(access));

    return access;
  };
  return refresh;
};

export default useRefreshToken;
