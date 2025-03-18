import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PawPrint, Search, Sun, Moon } from "lucide-react";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);

  // Define paths where the navbar should be hidden
  const hideNavPaths = ["/volunteer-login", "/volunteer-dashboard"];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Conditionally render the NavBar */}
      {!hideNavPaths.includes(location.pathname) && (
        <header
          className={`fixed top-0 w-full ${
            darkMode
              ? "bg-gray-900 bg-opacity-80 backdrop-blur-md"
              : "bg-white shadow-md"
          } p-4 flex flex-wrap md:flex-nowrap justify-between items-center z-50`}
        >
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#0F9D58] flex items-center justify-center">
              <PawPrint className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">
              Wild<span className="text-[#0F9D58]">Guard</span>
            </h1>
          </div>

          {/* Search Bar with Icon Inside */}
          <div className="relative w-full md:max-w-lg mt-2 md:mt-0 md:ml-27">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0F9D58] w-5 h-5" />
            <Input
              placeholder="Search NGOs or locations..."
              className={`w-full pl-12 pr-4 py-2 rounded-full border-2 ${
                darkMode
                  ? "bg-gray-700 border-[#0F9D58] text-white placeholder-gray-400"
                  : "border-[#0F9D58]"
              }`}
            />
          </div>

          <div className="flex gap-2 items-center mt-2 md:mt-0">
            <Button
              className="bg-[#0F9D58] hover:bg-[#0E8C51] text-white rounded-full px-4 hover:scale-105 active:scale-95 transition"
              onClick={() => navigate("/volunteer-login")}
            >
              Volunteer Login
            </Button>
            <Button
              className="bg-[#0F9D58] hover:bg-[#0E8C51] text-white rounded-full px-4 hover:scale-105 active:scale-95 transition"
              onClick={() => navigate("/volunteer-dashboard")}
            >
              NGO Login
            </Button>
            <Button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-800" />
              )}
            </Button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={hideNavPaths.includes(location.pathname) ? "" : "pt-20 flex-1"}>
        <Outlet context={{ darkMode }} />
      </main>

      {/* Footer */}
      <footer
        className={`text-center p-6 w-full ${
          darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-800 text-white"
        }`}
      >
        <p>&copy; 2025 WildGuard. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
