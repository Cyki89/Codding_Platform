import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { validToken } from "../utils/auth";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const { accessToken, logout } = useAuth();
  const refreshAccess = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (request) => {
        if (!request.headers["Authorization"]) {
          request.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        if (validToken(accessToken)) return request;

        try {
          const newAccess = await refreshAccess();
          request.headers.Authorization = `Bearer ${newAccess}`;
          return request;
        } catch (error) {
          return logout();
        }
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [accessToken, refreshAccess]);

  return axiosPrivate;
};

export default useAxiosPrivate;
