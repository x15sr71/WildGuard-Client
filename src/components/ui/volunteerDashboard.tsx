import { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Separator } from "./separator";
import { Switch } from "./switch";

import { 
  Bell,
  MapPin,
  Bandage,
  PawPrint,
  BarChart,
  User,
  Sun,
  Moon,
  Calendar,
  Map
} from "lucide-react";

const VolunteerDashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNotifications] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: 1,
      title: "Urgent Care Needed",
      message: "Orphaned panda cub requires feeding assistance",
      location: "23.8141° N, 90.4125° E",
      read: false
    },
    {
      id: 2,
      title: "Rescue Mission",
      message: "Injured spotted deer reported in urban area",
      location: "23.7945° N, 90.4143° E",
      read: true
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && 
          !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 fixed h-full z-50">
          <div className="flex items-center gap-3 mb-8">
            <PawPrint className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-bold dark:text-white">WildGuard</h2>
          </div>
          
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <BarChart size={18} />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bandage size={18} />
              Active Missions
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <Calendar size={18} />
              Schedule
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <Map size={18} />
              Rescue Map
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold dark:text-white">Welcome back, Sarah 🐾</h1>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="dark:text-white relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNotifications(!showNotifications);
                  }}
                >
                  <Bell className="w-5 h-5" />
                  {hasNotifications && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </Button>

                {showNotifications && (
                  <div 
                    ref={notificationsRef}
                    className="fixed right-4 top-20 z-50"
                  >
                    <Card className="w-80 shadow-xl dark:bg-gray-800 dark:border-gray-700">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold dark:text-white">
                            Notifications ({unreadNotifications})
                          </h3>
                          <Button 
                            variant="link" 
                            size="sm"
                            className="dark:text-white"
                            onClick={() => {/* Add mark all read logic */}}
                          >
                            Mark all read
                          </Button>
                        </div>
                        <Separator className="dark:bg-gray-700" />
                        <div className="space-y-4 mt-4 max-h-96 overflow-y-auto">
                          {notifications.map(notification => (
                            <div 
                              key={notification.id}
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                !notification.read 
                                  ? 'bg-green-50 dark:bg-green-900/30' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                              onClick={() => setSelectedLocation(notification.location)}
                            >
                              <div className="flex gap-3">
                                <Bandage className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <div className="flex-1">
                                  <p className="font-medium dark:text-white">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1 text-sm text-green-600 dark:text-green-400">
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

              <div className="flex items-center gap-2">
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-green-600 dark:data-[state=unchecked]:bg-gray-600"
                />
                {darkMode ? (
                  <Moon className="text-gray-200" size={20} />
                ) : (
                  <Sun className="text-yellow-500" size={20} />
                )}
              </div>

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
                  className="dark:bg-gray-800 dark:border-gray-700 w-48"
                >
                  <DropdownMenuItem className="dark:hover:bg-gray-700">
                    <User className="w-4 h-4 mr-2 dark:text-white" />
                    <span className="dark:text-white">Profile</span>
                  </DropdownMenuItem>
                  <Separator className="dark:bg-gray-700" />
                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Selected Location Display */}
          {selectedLocation && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <p className="text-green-600 dark:text-green-400">
                Selected Location: {selectedLocation}
              </p>
            </div>
          )}

          {/* Dashboard Content */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="p-6 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Active Missions</p>
                  <p className="text-3xl font-bold mt-2 dark:text-white">5</p>
                </div>
                <Bandage className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Upcoming Shifts</p>
                  <p className="text-3xl font-bold mt-2 dark:text-white">3</p>
                </div>
                <Calendar className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </Card>

            <Card className="p-6 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Rescues This Month</p>
                  <p className="text-3xl font-bold mt-2 dark:text-white">27</p>
                </div>
                <PawPrint className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </Card>
          </div>

          {/* Map Section */}
          <Card className="p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">Rescue Operations Map</h3>
              <Button variant="ghost" className="text-green-600 dark:text-green-400">
                <Map className="w-4 h-4 mr-2" />
                Refresh Location
              </Button>
            </div>
            <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Map className="w-16 h-16 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-500 dark:text-gray-400 ml-2">Map integration coming soon</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;