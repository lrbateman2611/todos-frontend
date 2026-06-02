import { useState, useEffect } from "react";
import { Outlet } from "@tanstack/react-router";
import { AuthHeader } from "./AuthHeader";

export function RootLayout() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme-mode");
    return saved === "dark" || false;
  });

  useEffect(() => {
    localStorage.setItem("theme-mode", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <>
      <AuthHeader isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
      <Outlet />
    </>
  );
}
