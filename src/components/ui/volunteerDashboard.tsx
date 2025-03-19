import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Separator } from "./separator";
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
  Map,
  Home
} from "lucide-react";

const VolunteerDashboard = () => {
  const [selectedView, setSelectedView] = useState("home"); // "home" or "dashboard"
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNotifications] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // New states for image uploads and description
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const rescueRequests = [
    {
      id: 1,
      title: "Injured Fox",
      description: "A fox was found injured near the woods. Immediate attention needed.",
      location: "45.4215° N, 75.6972° W"
    },
    {
      id: 2,
      title: "Stranded Turtle",
      description: "Turtle spotted on the road. Assistance required for safe relocation.",
      location: "34.0522° N, 118.2437° W"
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Handler for image file selection (appending new images)
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls = files.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...urls]);
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handlePostRequest = () => {
    // Add posting logic here, e.g. form submission
    console.log("Posting request with images:", uploadedImages, "and description:", description);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-4 fixed h-full z-50`}>
          <div className="flex items-center gap-3 mb-8">
            <PawPrint className={`${darkMode ? 'text-white' : 'text-black'} w-8 h-8`} />
            <h1 className="text-xl font-bold">
              <span className={`${darkMode ? 'text-white' : 'text-black'}`}>Wild</span>
              <span className="text-[#0F9D58]">Guard</span>
            </h1>
          </div>
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}
              onClick={() => setSelectedView("home")}
            >
              <Home size={18} />
              Home / Help Needed
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedView("dashboard")}
              className={`w-full justify-start gap-2 ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              <BarChart size={18} />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              <Bandage size={18} />
              Active Missions
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              <Calendar size={18} />
              Schedule
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              <Map size={18} />
              Rescue Map
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          {/* Navbar (always visible) */}
          <header className="flex justify-between items-center mb-8">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, Sarah 🐾
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${darkMode ? 'text-white' : 'text-gray-900'} relative`}
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
                  <div ref={notificationsRef} className="fixed right-4 top-20 z-50">
                    <Card className={`w-80 shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Notifications ({unreadNotifications})
                          </h3>
                          <Button
                            variant="link"
                            size="sm"
                            className={`${darkMode ? 'text-white' : 'text-gray-900'}`}
                            onClick={() => {/* Add mark all read logic */ }}
                          >
                            Mark all read
                          </Button>
                        </div>
                        <Separator className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        <div className="space-y-4 mt-4 max-h-96 overflow-y-auto">
                          {notifications.map(notification => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${!notification.read ? 'border-l-4 border-green-500' : ''} hover:bg-gray-100 dark:hover:bg-gray-700`}
                              onClick={() => setSelectedLocation(notification.location)}
                            >
                              <div className="flex gap-3">
                                <Bandage className="w-5 h-5 text-green-600" />
                                <div className="flex-1">
                                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
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

              {/* Theme Toggle Button */}
              <Button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-800" />}
              </Button>

              {/* Avatar Dropdown */}
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
                  className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} w-48 rounded-md shadow-lg`}
                >
                  <DropdownMenuItem className={`${darkMode ? 'hover:bg-gray-700 text-white border-b border-gray-700' : 'hover:bg-gray-100 text-gray-900 border-b border-gray-200'}`}>
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <Separator className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <DropdownMenuItem className={`${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Content based on selected view */}
          {selectedView === "home" && (
            <section className="mb-8">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Need Help? Post Your Request
              </h2>
              <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Please add images related to your concern and describe the issue below.
              </p>
              <div className="mt-4 space-y-4">
                {/* Image Upload Area */}
                <div
                  className="flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-green-600 p-4 rounded cursor-pointer"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <div className="flex items-center gap-2">
                    <PawPrint className={`${darkMode ? 'text-white' : 'text-black'} w-5 h-5`} />
                    <span className={`${darkMode ? 'text-white' : 'text-black'}`}>Add Images</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  ref={imageInputRef}
                  onChange={handleImageChange}
                />
                {/* Image Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {uploadedImages.map((imgUrl, index) => (
                      <img
                        key={index}
                        src={imgUrl}
                        alt={`Uploaded ${index}`}
                        className="max-h-32 object-contain rounded"
                      />
                    ))}
                  </div>
                )}

                {/* Description Textarea */}
                <div className="mt-4">
                  <textarea
                    placeholder="Describe your concern here..."
                    value={description}
                    onChange={handleDescriptionChange}
                    className={`w-full p-2 border rounded focus:border-green-600 focus:ring-green-600 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
                    rows={5}
                  ></textarea>
                </div>
                <Button
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2"
                  onClick={handlePostRequest}
                >
                  Post Request
                </Button>
              </div>
            </section>
          )}

          {selectedView === "dashboard" && (
            <>
              {selectedLocation && (
                <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-green-800 border border-green-700 text-green-200' : 'bg-green-100 border border-green-200 text-green-800'}`}>
                  <p>
                    Selected Location: <strong>{selectedLocation}</strong>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Missions</p>
                      <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>5</p>
                    </div>
                    <Bandage className="w-5 h-5 text-green-600" />
                  </div>
                </Card>
                <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Upcoming Shifts</p>
                      <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>3</p>
                    </div>
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                </Card>
                <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rescues This Month</p>
                      <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>27</p>
                    </div>
                    <PawPrint className={`${darkMode ? 'text-white' : 'text-black'}`} size={24} />
                  </div>
                </Card>
              </div>

              <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-8`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Rescue Operations Map
                  </h3>
                  <Button variant="ghost" className="text-green-600">
                    <Map className="w-4 h-4 mr-2" />
                    Refresh Location
                  </Button>
                </div>
                <div className={`h-96 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                  <Map className={`w-16 h-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Map integration coming soon
                  </p>
                </div>
              </Card>

              <section className="mb-8">
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Rescue Requests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rescueRequests.map((request) => (
                    <Card
                      key={request.id}
                      className={`p-4 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                    >
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {request.title}
                      </h3>
                      <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {request.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {request.location}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
