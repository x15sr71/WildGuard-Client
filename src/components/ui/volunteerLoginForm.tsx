import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // or your preferred routing solution
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
import { Checkbox } from "@/components/ui/checkbox";
import { PawPrint } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase/firebaseInitialize"; // adjust path based on your project structure

// Helper function to call your backend /auth/login endpoint
async function callBackendLogin(idToken: any) {
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
      throw new Error("Backend login failed");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in backend login:", error);
    throw error;
  }
}

export function VolunteerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Handle email/password login
  const handleEmailLogin = async (e: any) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      // Sign in via Firebase with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in with email:", userCredential.user);

      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      // Call backend /auth/login endpoint to verify token and store user info
      const backendResponse = await callBackendLogin(idToken);
      console.log("Backend login success:", backendResponse);

      // Redirect after successful login and backend processing
      navigate("/dashboard");
    } catch (error) {
      console.error("Email login error:", error);
      setErrorMsg("Invalid email or password");
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async () => {
    setErrorMsg("");
    const provider = new GoogleAuthProvider();
    try {
      // Sign in via Firebase with Google popup
      const result = await signInWithPopup(auth, provider);
      console.log("User logged in with Google:", result.user);

      // Get Firebase ID token
      const idToken = await result.user.getIdToken();
      // Call backend /auth/login endpoint to verify token and store user info
      const backendResponse = await callBackendLogin(idToken);
      console.log("Backend login success:", backendResponse);

      // Redirect after successful login and backend processing
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMsg("Google login failed. Please try again.");
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
            Volunteer Login
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Continue your wildlife conservation journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="rounded-full border-green-500 focus:ring-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="rounded-full border-green-500 focus:ring-green-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="text-red-600 text-sm">{errorMsg}</div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="text-green-600" />
                <Label htmlFor="remember" className="text-gray-600">
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-5"
              type="submit"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </span>
            <span className="relative px-2 bg-gray-50 text-sm text-gray-500">
              OR
            </span>
          </div>

          {/* Google OAuth Button */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-5"
          >
            Sign In with Google
          </Button>

          <div className="text-center text-sm text-gray-600">
            Not registered yet?{" "}
            <Link to="/signup" className="text-green-600 hover:underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
