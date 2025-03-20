// DashboardSection.tsx
import React from "react";
import {Card} from "./card";
import { MapPin, Calendar, PawPrint, Map } from "lucide-react";
// import { Separator } from "./separator";
import { Button } from "./button";
import { Bandage } from "lucide-react";

type RescueRequest = {
  id: number;
  title: string;
  description: string;
  location: string;
};

type DashboardSectionProps = {
  darkMode: boolean;
  selectedLocation: string | null;
  rescueRequests: RescueRequest[];
};

const DashboardSection: React.FC<DashboardSectionProps> = ({
  darkMode,
  selectedLocation,
  rescueRequests,
}) => {
  return (
    <>
      {selectedLocation && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            darkMode
              ? "bg-green-800 border border-green-700 text-green-200"
              : "bg-green-100 border border-green-200 text-green-800"
          }`}
        >
          <p>
            Selected Location: <strong>{selectedLocation}</strong>
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          className={`p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Active Missions
              </p>
              <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                5
              </p>
            </div>
            <div className="w-5 h-5 text-green-600"><Bandage></Bandage></div>
          </div>
        </Card>
        <Card
          className={`p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Upcoming Shifts
              </p>
              <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                3
              </p>
            </div>
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
        </Card>
        <Card
          className={`p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Rescues This Month
              </p>
              <p className={`text-3xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                27
              </p>
            </div>
            <PawPrint className={`${darkMode ? "text-white" : "text-black"}`} size={24} />
          </div>
        </Card>
      </div>
      <Card
        className={`p-6 ${darkMode ? "bg-gray-800" : "bg-white"} border ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } mb-8`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Rescue Operations Map
          </h3>
          <Button variant="ghost" className="text-green-600">
            <Map className="w-4 h-4 mr-2" />
            Refresh Location
          </Button>
        </div>
        <div
          className={`h-96 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg flex items-center justify-center`}
        >
          <Map className={`w-16 h-16 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
          <p className={`ml-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Map integration coming soon
          </p>
        </div>
      </Card>
      <section className="mb-8">
        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Recent Rescue Requests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rescueRequests.map((request) => (
            <Card
              key={request.id}
              className={`p-4 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}
            >
              <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {request.title}
              </h3>
              <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {request.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {request.location}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
};

export default DashboardSection;
