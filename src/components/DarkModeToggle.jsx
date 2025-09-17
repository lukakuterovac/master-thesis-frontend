import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  const handleToggle = () => {
    setTheme(next);
    // simulate a short delay so animations feel smooth
  };

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle Dark Mode"
      className="relative flex items-center justify-center w-10 h-10
                 text-gray-700 dark:text-gray-200 
                 hover:text-yellow-500 dark:hover:text-blue-500 transition-colors duration-300 ease-in-out"
    >
      {theme === "dark" ? (
        <Moon className="w-4 h-4 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:-rotate-12" />
      ) : (
        <Sun className="w-4 h-4 transition-transform duration-300 ease-in-out transform hover:scale-110 hover:rotate-12" />
      )}
    </button>
  );
}
