import { useState, useEffect } from "react";
import { Outlet } from "@tanstack/react-router";
import { AuthHeader } from "./AuthHeader";
import { useAuthState } from "../hooks/useAuthState";

export function RootLayout() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme-mode");
    return saved === "dark" || false;
  });
  const { user, isLoading, login, logout } = useAuthState();

  useEffect(() => {
    localStorage.setItem("theme-mode", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <>
      <AuthHeader
        username={isLoading ? null : (user?.name ?? null)}
        onLogin={() => login()}
        onLogout={logout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      <Outlet />
    </>
  );
}
