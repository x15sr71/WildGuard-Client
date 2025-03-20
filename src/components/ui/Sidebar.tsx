// Sidebar.tsx
import React from "react";
import { Button } from "./button";
import { Home, BarChart, Bandage, Calendar, Map, PawPrint, Image } from "lucide-react";

type SidebarProps = {
  darkMode: boolean;
  setSelectedView: (view: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ darkMode, setSelectedView }) => {
  return (
    <div className={`w-64 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg p-4 fixed h-full z-50`}>
      <div className="flex items-center gap-3 mb-8">
        <PawPrint className={`${darkMode ? 'text-white' : 'text-black'} w-8 h-8`} />
        <h1 className="text-xl font-bold">
          <span className={`${darkMode ? "text-white" : "text-black"}`}>Wild</span>
          <span className="text-[#0F9D58]">Guard</span>
        </h1>
      </div>
      <nav className="space-y-2">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 ${
            darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"
          }`}
          onClick={() => setSelectedView("home")}
        >
          <Home size={18} />
          Home / Help Needed
        </Button>
        

        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 ${
            darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"
          }`}
          onClick={() => setSelectedView("animalHelpPosts")}
        >
          <Image size={18} />
          Animal Help Posts
        </Button>


        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 ${
            darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"
          }`}
          onClick={() => setSelectedView("dashboard")}
        >
          <BarChart size={18} />
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 ${
            darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Bandage size={18} />
          Active Missions
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 ${
            darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Calendar size={18} />
          Schedule
        </Button>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 ${
            darkMode ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Map size={18} />
          Rescue Map
        </Button>
      </nav>
    </div>
  );
};

export default Sidebar;
