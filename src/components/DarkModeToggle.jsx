import { useState } from "react";
import { Sun, Moon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setLoading(true);
    setTheme(next);
    setLoading(false);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleToggle}
      className="p-2 relative w-10 h-10 overflow-visible"
      aria-label="Toggle Dark Mode"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : theme === "dark" ? (
        <Moon className="w-5 h-5 transition-all duration-300" />
      ) : (
        <Sun className="w-5 h-5 transition-all duration-300" />
      )}
    </Button>
  );
}
