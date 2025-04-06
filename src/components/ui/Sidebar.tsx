import React from "react";
import { Button } from "./button";
import {
  Home,
  BarChart,
  Ban as Bandage,
  Calendar,
  Map,
  PawPrint,
  Leaf,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  darkMode: boolean;
  setSelectedView: (view: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ darkMode, setSelectedView }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`fixed top-0 left-0 w-64 h-screen ${
        darkMode ? "bg-[#0F9D58]" : "bg-green-100"
      } border-r ${
        darkMode ? "border-green-600" : "border-green-200"
      } transition-all duration-300 shadow-lg flex flex-col`}
    >
      <div className="p-4">
        <div
          className="flex items-center gap-2 mb-6 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <PawPrint
            className={`w-6 h-6 ${
              darkMode ? "text-white" : "text-green-700"
            } transition-colors`}
          />
          <div>
            <h1
              className={`text-lg font-bold ${
                darkMode ? "text-white" : "text-green-900"
              }`}
            >
              Wild
            </h1>
            <h2
              className={`text-xs ${
                darkMode ? "text-green-100" : "text-green-700"
              }`}
            >
              Guard
            </h2>
          </div>
        </div>

        <nav className="space-y-1">
          {[
            { view: "home", icon: Home, label: "Home / Help Needed" },
            {
              view: "animalHelpPosts",
              icon: PawPrint,
              label: "Animal Help Posts",
            },
            { view: "dashboard", icon: BarChart, label: "Dashboard" },
            { view: "missions", icon: Bandage, label: "Active Missions" },
            { view: "schedule", icon: Calendar, label: "Schedule" },
            { view: "map", icon: Map, label: "Rescue Map" },
          ].map((item) => (
            <Button
              key={item.view}
              className={`w-full justify-start gap-2 px-3 cursor-pointer ${
                darkMode
                  ? "hover:bg-[#1DB86B] text-white hover:text-white"
                  : "hover:bg-green-200 text-green-800"
              } transition-all duration-200 text-sm`}
              variant="ghost"
              onClick={() => setSelectedView(item.view)}
            >
              <item.icon
                className={`w-4 h-4 ${
                  darkMode ? "text-green-100" : "text-green-700"
                }`}
              />
              <span className="truncate cursor-pointer">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-3">
        <div
          className={`rounded-lg p-3 ${
            darkMode ? "bg-[#0A8048]" : "bg-green-200"
          } transition-colors duration-300 shadow-md`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Leaf
              className={`w-4 h-4 ${
                darkMode ? "text-green-200" : "text-green-700"
              }`}
            />
            <span
              className={`font-medium text-sm ${
                darkMode ? "text-white" : "text-green-900"
              }`}
            >
              Impact Stats
            </span>
          </div>
          <div
            className={`text-xs ${
              darkMode ? "text-green-50" : "text-green-800"
            }`}
          >
            <p className="truncate">Animals Rescued: 1,234</p>
            <p className="truncate">Active Volunteers: 89</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
