"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AdminTheme = "light" | "dark";

interface ThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
  setTheme: (t: AdminTheme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem("admin_theme") as AdminTheme | null;
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // default to light
        setThemeState("light");
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // safe fallback
    }
  }, []);

  const setTheme = (t: AdminTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem("admin_theme", t);
      if (t === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      window.dispatchEvent(new Event("admin_theme_changed"));
    } catch {
      // safe fallback
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
