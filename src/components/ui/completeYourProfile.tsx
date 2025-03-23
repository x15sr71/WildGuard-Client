// VolunteerCompleteProfilePage.jsx
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
import { auth } from "../../firebase/firebaseInitialize"; // adjust path accordingly

// Helper function to submit additional profile data to the backend
async function submitVolunteerProfile(data: any, idToken: any) {
  try {
    const response = await fetch("http://localhost:3000/volunteer-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to complete profile");
    }
    return await response.json();
  } catch (error) {
    console.error("Error completing profile:", error);
    throw error;
  }
}

export function VolunteerCompleteProfilePage() {
  const [currentLocation, setCurrentLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleProfileSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      // Ensure the user is authenticated and get the ID token
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user");
      }
      const idToken = await user.getIdToken();

      // Prepare profile data (convert comma-separated skills to an array)
      const profileData = {
        currentLocation,
        skills: skills.split(",").map((skill) => skill.trim()),
        phone,
      };

      const response = await submitVolunteerProfile(profileData, idToken);
      console.log("Profile completed successfully:", response);
      // After profile completion, redirect to the dashboard
      navigate("/dashboard");
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
              <Input
                id="currentLocation"
                type="text"
                placeholder="Enter your current location"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="rounded-full border-green-500 focus:ring-green-500 text-black"
              />
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
                type="text"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-full border-green-500 focus:ring-green-500 text-black"
              />
            </div>
            {errorMsg && (
              <div className="text-red-600 text-sm">{errorMsg}</div>
            )}
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
