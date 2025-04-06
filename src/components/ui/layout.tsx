import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PawPrint, Search, Sun, Moon } from "lucide-react";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize darkMode from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Update dark mode class on <html> tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Define paths where the navbar should be hidden
  const hideNavPaths = ["/volunteer-login", "/volunteer-dashboard", "/signup", "/complete-profile"];

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {!hideNavPaths.includes(location.pathname) && (
        <header
          className={`fixed top-0 left-0 right-0 w-full ${
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

          <div className="relative w-full md:max-w-lg mt-2 md:mt-0 md:ml-27">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0F9D58] w-5 h-5" />
            <Input
              placeholder="Search NGOs or locations..."
              className={`w-full pl-12 py-2 rounded-full border border-[#0F9D58] focus:outline-none focus:ring-1 focus:ring-[#0F9D58] ${
                darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
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
              onClick={() => {
                const newMode = !darkMode;
                setDarkMode(newMode);
                localStorage.setItem("darkMode", String(newMode));
              }}
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

      <main className={hideNavPaths.includes(location.pathname) ? "" : "pt-28 md:pt-24 flex-1"}>
        <Outlet context={{ darkMode, searchQuery }} />
      </main>

      {/* <footer
  className={`text-center p-2 w-full ${
    darkMode
      ? "bg-gray-900 text-gray-300" 
      : "bg-white text-gray-800"
  }`}
  style={{ backgroundColor: darkMode ? '#121212' : '#ffffff' }}
>
  <p>&copy; 2025 WildGuard. All Rights Reserved.</p>
</footer> */}
    </div>
  );
}