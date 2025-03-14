import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom"; // or your preferred routing solution
import { PawPrint } from "lucide-react";

export function VolunteerLoginForm() {
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
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="rounded-full border-green-500 focus:ring-green-500"
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
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="text-green-600" />
                <Label htmlFor="remember" className="text-gray-600">
                  Remember me
                </Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-5"
              type="submit"
            >
              Sign In
            </Button>

            <div className="text-center text-sm text-gray-600">
              Not registered yet?{" "}
              <Link to="/signup" className="text-green-600 hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}