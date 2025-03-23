// VolunteerSignupForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { PawPrint } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebaseInitialize"; // adjust path based on your project structure

// Helper function to call your backend /auth/login endpoint
async function callBackendSignup(idToken: any) {
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Attach the Firebase ID token in the Authorization header
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({}), // No additional payload required
    });
    if (!response.ok) {
      throw new Error("Backend signup failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in backend signup:", error);
    throw error;
  }
}

export function VolunteerSignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      // Create a new user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User created via Firebase:", user);

      // Update the user's display name (if provided)
      if (name) {
        await updateProfile(user, { displayName: name });
      }

      // Retrieve the Firebase ID token (JWT)
      const idToken = await user.getIdToken();
      
      // Call backend /auth/login endpoint to verify token and store basic user info
      const backendResponse = await callBackendSignup(idToken);
      console.log("Backend signup success:", backendResponse);

      // Redirect to complete profile page (do not redirect to dashboard yet)
      navigate("/complete-profile");
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMsg("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border-0">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <PawPrint className="w-12 h-12 text-[#3D8361]" />
          </div>
          <CardTitle className="text-2xl text-center font-bold text-[#2D2D2D]">
            Volunteer Signup
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Join us in making a difference for wildlife conservation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-full border-green-500 focus:ring-green-500 text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full border-green-500 focus:ring-green-500 text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full border-green-500 focus:ring-green-500 text-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Sign Up
            </Button>
          </form>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
