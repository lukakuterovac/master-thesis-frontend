import { Link } from "react-router-dom";
import { Menu, Compass, PlusCircle } from "lucide-react";
import logo from "@/assets/logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="InForm Logo" className="h-12 w-12" />
          <span className="text-xl font-bold text-primary">InForm</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-sm">
          <Link
            to="/explore"
            className="group flex items-center gap-2 text-gray-700 dark:text-gray-200 
               hover:text-purple-500 dark:hover:text-purple-500 transition-colors duration-300 ease-in-out"
          >
            <Compass
              className="w-4 h-4 transition-transform duration-300 ease-in-out 
                 group-hover:scale-110 group-hover:rotate-90"
            />
            <span className="font-medium">Explore</span>
          </Link>

          <Link
            to="/create"
            className="group flex items-center gap-2 text-gray-700 dark:text-gray-200 
               hover:text-purple-500 dark:hover:text-purple-500 transition-colors duration-300 ease-in-out"
          >
            <PlusCircle
              className="w-4 h-4 transition-transform duration-300 ease-in-out 
                 group-hover:scale-110 group-hover:-rotate-90"
            />
            <span className="font-medium">Create</span>
          </Link>
        </nav>

        {/* Right side: Dark mode + menu */}
        <div className="flex space-x-2">
          <DarkModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu className="w-6 h-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {user && (
                <>
                  <Link to="/user-settings">
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuLabel className="text-gray-500">
                Account
              </DropdownMenuLabel>

              {user ? (
                <Link onClick={signOut}>
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </Link>
              ) : (
                <>
                  <Link to="/sign-in">
                    <DropdownMenuItem>Sign In</DropdownMenuItem>
                  </Link>
                  <Link to="/sign-up">
                    <DropdownMenuItem>Sign Up</DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
