// Navbar.tsx
import React, { useRef, useEffect } from "react";
import { Button } from "./button";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Separator } from "./separator";
import { Bell, Sun, Moon, User } from "lucide-react";
import { Card } from "./card";
import { Bandage, MapPin } from "lucide-react";

type Notification = {
  id: number;
  title: string;
  message: string;
  location: string;
  read: boolean;
};

type NavbarProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  notifications: Notification[];
  unreadNotifications: number;
  setSelectedLocation: (location: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  toggleDarkMode,
  showNotifications,
  setShowNotifications,
  notifications,
  unreadNotifications,
  setSelectedLocation,
}) => {
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowNotifications]);

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
        Welcome back, Sarah 🐾
      </h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className={`${darkMode ? "text-white" : "text-gray-900"} relative`}
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
            }}
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </Button>
          {showNotifications && (
            <div ref={notificationsRef} className="fixed right-4 top-20 z-50">
              <Card
                className={`w-80 shadow-xl ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Notifications ({unreadNotifications})
                    </h3>
                    <Button
                      variant="link"
                      size="sm"
                      className={`${darkMode ? "text-white" : "text-gray-900"}`}
                      onClick={() => {
                        /* Mark all read logic */
                      }}
                    >
                      Mark all read
                    </Button>
                  </div>
                  <Separator className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                  <div className="space-y-4 mt-4 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
  <div
    key={notification.id}
    className={`p-3 rounded-lg cursor-pointer transition-colors ${
      !notification.read ? "border-l-4 border-green-500" : ""
    } hover:bg-gray-100 dark:hover:bg-gray-700`}
    onClick={() => setSelectedLocation(notification.location)}
  >
    <div className="flex gap-3">
      {/* Use the Bandage icon for the notification */}
      <Bandage className="w-5 h-5 text-green-600" />
      <div className="flex-1">
        <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
          {notification.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {notification.message}
        </p>
        <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
          {/* Use the MapPin icon for location */}
          <MapPin className="w-4 h-4" />
          <span>{notification.location}</span>
        </div>
      </div>
    </div>
  </div>
))}

                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
        <Button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-800" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
              <AvatarImage src="/user-avatar.jpg" />
              <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                SA
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={`${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
            } w-48 rounded-md shadow-lg`}
          >
            <DropdownMenuItem
              className={`${
                darkMode ? "hover:bg-gray-700 text-white border-b border-gray-700" : "hover:bg-gray-100 text-gray-900 border-b border-gray-200"
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <Separator className={`${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
            <DropdownMenuItem className={`${darkMode ? "text-red-400" : "text-red-600"}`}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
