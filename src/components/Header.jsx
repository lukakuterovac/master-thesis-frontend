import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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

export default function Header() {
  const { token } = useAuth();

  return (
    <header className="w-full border-b shadow-sm ">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="InForm Logo" className="h-12 w-12" />
          <span className="text-xl font-bold text-primary">InForm</span>
        </Link>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {/* Replace with auth state later */}

          {/* Avatar (if logged in) */}
          {/* <Avatar>
            <AvatarFallback>LK</AvatarFallback>
          </Avatar> */}
        </div>
        <div className="flex space-x-2">
          <DarkModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu className="w-6 h-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {token && (
                <>
                  <Link to="/dashboard">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuLabel className="text-gray-500">
                Account
              </DropdownMenuLabel>
              {token && (
                <>
                  <Link>
                    <DropdownMenuItem>Sign Out</DropdownMenuItem>
                  </Link>
                </>
              )}
              {!token && (
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
