"use client";

import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux";
import jwt from "jsonwebtoken";
import { setSession } from "@/context/sessionSlice";
import { initialUser } from "@/types/userType";

interface AuthMiddlewareProps {
  children: ReactNode;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const navigate = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    const token = Cookies.get(process.env.COOKIE_NAME!);

    if (!token) {
      navigate.push("/login");
      return;
    }

    try {
      // Dekode token
      const decoded: any = jwt.decode(token);

      if (!decoded) {
        Cookies.remove("token");
        navigate.push("/login");
        return;
      }

      // Set user ke Redux jika belum ada
      if (user === initialUser) {
        dispatch(setSession(decoded));
      }

      setAuthorized(true);
    } catch (error) {
      console.error("Invalid token:", error);
      Cookies.remove("token");
      navigate.push("/login");
    }
  }, [dispatch, navigate, user]);

  if (!authorized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthMiddleware;
