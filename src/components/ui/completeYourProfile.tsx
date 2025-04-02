import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { auth } from "../../firebase/firebaseInitialize";
import MapPicker from "../ui/mapPicker"; // Ensure correct capitalization/path
import { Map as MapIcon } from "lucide-react"; // Import the Map icon

interface VolunteerProfileData {
  currentLocation: string;
  skills: string[];
  phone: string;
  currentLocationCoordinates: { lat: number; lng: number } | null;
}

async function submitVolunteerProfile(data: VolunteerProfileData, idToken: string) {
  console.log("submitVolunteerProfile called with:", data);
  try {
    const res = await fetch("http://localhost:3000/volunteer-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("Failed to complete profile");
    }
    return await res.json();
  } catch (error) {
    console.error("Error completing profile:", error);
    throw error;
  }
}

export function VolunteerCompleteProfilePage() {
  const [currentLocation, setCurrentLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [phone, setPhone] = useState("");
  const [currentLocationCoordinates, setCurrentLocationCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setCurrentLocationCoordinates({ lat, lng });
      setCurrentLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleLocationSelect = (
    location: string,
    coordinates: { lat: number; lng: number }
  ) => {
    setCurrentLocation(location);
    setCurrentLocationCoordinates(coordinates);
    setShowMapPicker(false);
  };

const geocodeAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=AIzaSyDNNeLMYjAf_V2eEVJQPmf7j2M8TzXqyO8`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const lat = result.geometry.location.lat;
      const lng = result.geometry.location.lng;

      setCurrentLocationCoordinates({ lat, lng });

      // Ensure input field updates instantly
      if (result.formatted_address) {
        setCurrentLocation(result.formatted_address); // ✅ Ensure instant UI update
      }
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
};


  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      const idToken = await user.getIdToken();
      const profileData = {
        currentLocation,
        skills: skills.split(",").map((skill) => skill.trim()),
        phone,
        currentLocationCoordinates,
      };

      await submitVolunteerProfile(profileData, idToken);
      navigate("/volunteer-dashboard");
    } catch (error) {
      setErrorMsg("Profile completion failed. Please try again.");
      console.error("Profile completion error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold text-[#2D2D2D]">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Provide additional details to complete your volunteer profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <div className="space-y-2">
              <Label htmlFor="currentLocation" className="text-gray-700">
                Current Location
              </Label>
              <div className="relative">
                <Input
                  id="currentLocation"
                  type="text"
                  placeholder="Enter your current location or use the map picker"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  onBlur={() => geocodeAddress(currentLocation)} // ✅ Trigger geocoding on blur
                  className="rounded-full border-green-500 focus:ring-green-500 text-black"
                />

                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700"
                >
                  <MapIcon className="w-5 h-5" />
                </button>
              </div>
              {showMapPicker && (
                <MapPicker
                  incidentLocation={currentLocation}
                  onMapClick={handleMapClick}
                  onLocationSelect={handleLocationSelect}
                  darkMode={false}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-gray-700">
                Skills (comma separated)
              </Label>
              <Input
                id="skills"
                type="text"
                placeholder="e.g. first aid, wildlife tracking"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="rounded-full border-green-500 focus:ring-green-500 text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-full border-green-500 focus:ring-green-500 text-black"
              />
            </div>
            {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-5"
              type="submit"
            >
              Complete Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
