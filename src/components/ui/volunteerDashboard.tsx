// VolunteerDashboard.tsx
import React, { useState, useRef, ChangeEvent } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import HomeSection from "./HomeSection";
import DashboardSection from "./Dashboard";
import axios from "axios";
import {PostsFeed} from "./AnimalHelpPosts";

const VolunteerDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState("home");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Image upload and form states
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [noticedAt, setNoticedAt] = useState("");
  const [currentActions, setCurrentActions] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const posts = [
    {
      id: 1,
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600&text=Image+2",
        "/placeholder.svg?height=400&width=600&text=Image+3",
      ],
      status: "URGENT: Lost dog in Central Park area. Small brown terrier with a red collar.",
      organization: {
        name: "Animal Rescue NYC",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AR",
      },
      timestamp: "3 hours ago",
      likes: 24,
      comments: 7,
      shares: 12,
    },
    {
      id: 2,
      images: [
        "/placeholder.svg?height=400&width=600&text=Found+Cat",
        "/placeholder.svg?height=400&width=600&text=Close+Up",
      ],
      status: "FOUND: Gray tabby cat near Brooklyn Bridge. No collar, very friendly.",
      organization: {
        name: "Brooklyn Pet Finders",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "BP",
      },
      timestamp: "Yesterday at 2:15 PM",
      likes: 42,
      comments: 15,
      shares: 8,
    },
    {
      id: 3,
      images: ["/placeholder.svg?height=400&width=600&text=Adoption+Day"],
      status: "ADOPTION EVENT: This Saturday at Central Park. Many dogs and cats looking for forever homes!",
      organization: {
        name: "Forever Homes",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "FH",
      },
      timestamp: "2 days ago",
      likes: 89,
      comments: 23,
      shares: 45,
    },
  ]

  // MapPicker state
  const [showMapPicker, setShowMapPicker] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Urgent Care Needed",
      message: "Orphaned panda cub requires feeding assistance",
      location: "23.8141° N, 90.4125° E",
      read: false,
    },
    {
      id: 2,
      title: "Rescue Mission",
      message: "Injured spotted deer reported in urban area",
      location: "23.7945° N, 90.4143° E",
      read: true,
    },
  ];

  const rescueRequests = [
    {
      id: 1,
      title: "Injured Fox",
      description: "A fox was found injured near the woods. Immediate attention needed.",
      location: "45.4215° N, 75.6972° W",
    },
    {
      id: 2,
      title: "Stranded Turtle",
      description: "Turtle spotted on the road. Assistance required for safe relocation.",
      location: "34.0522° N, 118.2437° W",
    },
  ];

  // Sample data for Animal Help Posts


  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls = files.map((file) => URL.createObjectURL(file));
      setUploadedImages((prev) => [...prev, ...urls]);
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handlePostRequest = async () => {
    try {
      const requestData = {
        images: uploadedImages,
        description,
        incidentLocation,
        noticedAt,
        currentActions,
        volunteerId: "some-volunteer-id", // Replace with actual volunteer ID
      };

      console.log("Sending request with data:", requestData);

      const response = await axios.post(
        "http://localhost:3000/animalHelpPost",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const locationString = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setIncidentLocation(locationString);
      setShowMapPicker(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="flex">
        <Sidebar darkMode={darkMode} setSelectedView={setSelectedView} />
        <div className="ml-64 flex-1 p-8">
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            notifications={notifications}
            unreadNotifications={unreadNotifications}
            setSelectedLocation={setSelectedLocation}
          />
          {selectedView === "home" && (
            <HomeSection
              darkMode={darkMode}
              incidentLocation={incidentLocation}
              setIncidentLocation={setIncidentLocation}
              uploadedImages={uploadedImages}
              handleImageChange={handleImageChange}
              imageInputRef={imageInputRef as React.RefObject<HTMLInputElement>}
              description={description}
              handleDescriptionChange={handleDescriptionChange}
              noticedAt={noticedAt}
              setNoticedAt={setNoticedAt}
              currentActions={currentActions}
              setCurrentActions={setCurrentActions}
              handlePostRequest={handlePostRequest}
              showMapPicker={showMapPicker}
              setShowMapPicker={setShowMapPicker}
              handleMapClick={handleMapClick}
            />
          )}
          {selectedView === "dashboard" && (
            <DashboardSection
              darkMode={darkMode}
              selectedLocation={selectedLocation}
              rescueRequests={rescueRequests}
            />
          )}
           {selectedView === "animalHelpPosts" && <PostsFeed darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
