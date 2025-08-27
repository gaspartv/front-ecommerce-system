"use client";

import api from "@/config/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  const login = (token: string, refreshToken: string) => {
    Cookies.set("token", token);
    Cookies.set("refreshToken", refreshToken);

    setIsAuthenticated(true);
    router.push("/dashboard");
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setIsAuthenticated(false);
    router.push("/front_system/");
  };

  const getUser = async () => {
    const userCookie = Cookies.get("user");
    const token = Cookies.get("token");

    const user = userCookie ? JSON.parse(userCookie) : null;

    if (!user && token) {
      const response = await api.get("/users/profile");

      if (response.data) {
        Cookies.set("user", JSON.stringify(response.data));
        return response.data;
      }
    }

    return user;
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    getUser,
  };
}
