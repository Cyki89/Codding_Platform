import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import useAuth from "../../hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";
import LoadingScreen from "../annimations/LoadingScreen";

const PersistLogin = () => {
  const effectRun = useRef(false);
  const refresh = useRefreshToken();
  const { accessToken, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (effectRun.current === true) return;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    !accessToken || !user ? verifyRefreshToken() : setIsLoading(false);

    return () => (effectRun.current = true);
  }, []);

  return <>{isLoading ? <LoadingScreen /> : <Outlet />}</>;
};

export default PersistLogin;
