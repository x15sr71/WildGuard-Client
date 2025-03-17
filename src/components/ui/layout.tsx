import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PawPrint, Search, Sun, Moon } from "lucide-react";

export function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(false);

    // Define paths where the navbar should be hidden
    const hideNavPaths = ["/volunteer-login", "/volunteer-dashboard"];

    return (
        <div className={`${darkMode ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}>
            {/* Conditionally render the NavBar */}
            {!hideNavPaths.includes(location.pathname) && (
                <header className={`fixed top-0 w-full ${darkMode ? "bg-gray-900 bg-opacity-80 backdrop-blur-md" : "bg-white shadow-md"} p-4 flex flex-wrap md:flex-nowrap justify-between items-center z-50`}>
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-[#3D8361] flex items-center justify-center">
                            <PawPrint className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold">
                            Wild<span className="text-[#3D8361]">Guard</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 w-full md:max-w-lg mt-2 md:mt-0">
                        <Input
                            placeholder="Search NGOs or locations..."
                            className={darkMode
                                ? "w-full bg-gray-700 border-2 border-green-500 text-white placeholder-gray-400 rounded-full px-4 py-2"
                                : "w-full border-2 border-green-500 rounded-full px-4 py-2"}
                        />
                        <Search className="text-green-500" />
                    </div>
                    <div className="flex gap-2 items-center mt-2 md:mt-0">
                        <Button
                            className="bg-green-600 text-white rounded-full px-4 hover:scale-105 active:scale-95 transition"
                            onClick={() => navigate("/volunteer-login")}
                        >
                            Volunteer Login
                        </Button>
                        <Button className="bg-green-600 text-white rounded-full px-4 hover:scale-105 active:scale-95 transition"
                            onClick={() => navigate("/volunteer-dashboard")}>
                            NGO Login
                        </Button>
                        <Button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition"
                        >
                            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-800" />}
                        </Button>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <div className={hideNavPaths.includes(location.pathname) ? "" : "pt-20"}>
                <Outlet context={{ darkMode }} />
            </div>

            {/* Footer */}
            <footer className={`text-center p-6 w-full mt-8 ${darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-800 text-white"}`}>
                <p>&copy; 2025 WildGuard. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
