import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../contexts/ThemeContext";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  const [showSun, setShowSun] = useState(theme === "dark");

  useEffect(() => {
    setShowSun(theme !== "dark");
  }, [theme]);

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(next)}
      className="p-2 relative w-10 h-10 overflow-visible"
      aria-label="Toggle Dark Mode"
    >
      <Sun
        className={`absolute inset-0 w-5 h-5 mx-auto my-auto transition-all duration-300 ease-in-out origin-center
          ${
            showSun
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75 pointer-events-none"
          }
        `}
      />

      <Moon
        className={`absolute inset-0 w-5 h-5 mx-auto my-auto transition-all duration-300 ease-in-out origin-center
          ${
            showSun
              ? "opacity-0 scale-75 pointer-events-none"
              : "opacity-100 scale-100"
          }
        `}
      />
    </Button>
  );
}
