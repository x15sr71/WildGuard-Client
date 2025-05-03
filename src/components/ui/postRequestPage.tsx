import React, { ChangeEvent, useState, useEffect } from "react";
import { Button } from "./button";
import {
  MapPin,
  Map,
  PawPrint,
  Camera,
  Leaf,
  Clock,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import MapPicker from "./mapPicker";
import axios from "axios";
import PostSuccess from "./postSuccess";

type PostRequestProps = {
  darkMode: boolean;
  incidentLocation: string;
  setIncidentLocation: (location: string) => void;
  uploadedImages: string[];
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
  description: string;
  handleDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  noticedAt: string;
  setNoticedAt: (val: string) => void;
  currentActions: string;
  setCurrentActions: (val: string) => void;
  handlePostRequest: (payload: any) => void;
  showMapPicker: boolean;
  setShowMapPicker: (show: boolean) => void;
  handleMapClick: (event: google.maps.MapMouseEvent) => void;
};

const PostRequest: React.FC<PostRequestProps> = ({
  darkMode,
  incidentLocation,
  setIncidentLocation,
  imageInputRef,
  description,
  handleDescriptionChange,
  noticedAt,
  setNoticedAt,
  currentActions,
  setCurrentActions,
  showMapPicker,
  setShowMapPicker,
  handleMapClick,
}) => {
  // New state to hold the GPS coordinates
  const [incidentCoordinates, setIncidentCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  // Local state for debouncing the text input
  const [locationQuery, setLocationQuery] = useState(incidentLocation);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postData, setPostData] = useState<any>(null);
  const [animalType, setAnimalType] = useState<string>("");
  const [urgencyLevel, setUrgencyLevel] = useState<string>("medium");

  // New state for storing image files for backend upload
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // Modified state for image previews
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Debounce effect: calls geocodeAddress 500ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationQuery) {
        geocodeAddress(locationQuery);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [locationQuery]);

  // Geocode function (replace YOUR_API_KEY with your actual API key)
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
        setIncidentCoordinates({ lat, lng });
        // Update the incident location with the formatted address if available
        if (result.formatted_address) {
          setIncidentLocation(result.formatted_address);
          setLocationQuery(result.formatted_address);
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setIncidentLocation(newLocation);
    setLocationQuery(newLocation);
  };

  const validNoticedAt = noticedAt
    ? new Date(noticedAt).toISOString()
    : new Date().toISOString();

  // Modified image change handler to store actual files and create proper previews
  const handleModifiedImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      newFiles.forEach((file) => {
        // Check if the file is an image
        if (!file.type.startsWith("image/")) {
          console.error("Selected file is not an image:", file);
          return;
        }

        // Check if file has non-zero size
        if (file.size <= 0) {
          console.error("Selected file is empty:", file);
          return;
        }

        // Log file details for debugging
        console.log("File details:", file);

        // Create a blob URL and log it
        const objectUrl = URL.createObjectURL(file);
        console.log("Created blob URL:", objectUrl);

        // Update state with the valid file and its preview URL
        setImageFiles((prevFiles) => [...prevFiles, file]);
        setImagePreviews((prevPreviews) => [...prevPreviews, objectUrl]);
      });
    }
  };

  // Function to remove an image
  const removeImage = (index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      // Revoke the URL to avoid memory leaks
      URL.revokeObjectURL(prevPreviews[index]);
      return prevPreviews.filter((_, i) => i !== index);
    });
  };

  // Modified post request handler with FormData for image upload
  const handlePostRequest = async (payload: any) => {
    try {
      // Create FormData for multipart/form-data (file uploads)
      const formData = new FormData();

      // Append each image file
      imageFiles.forEach((file) => {
        formData.append(`images`, file);
      });

      // Append other data as JSON
      formData.append("data", JSON.stringify(payload));

      const response = await axios.post(
        "http://localhost:8080/api/post-request",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Post successful:", response.data);
      setPostSuccess(true);
      setPostData(response.data);
    } catch (error) {
      console.error("Error posting request:", error);
    }
  };

  const firebaseId = localStorage.getItem("firebaseId");

  // Construct and send payload on post
  const onPostRequest = () => {
    const payload = {
      firebaseId: firebaseId,
      incidentLocation: {
        place: incidentLocation,
        gpsLocation: incidentCoordinates
          ? {
              latitude: incidentCoordinates.lat.toString(),
              longitude: incidentCoordinates.lng.toString(),
            }
          : null,
      },
      currentActions,
      description,
      animalType,
      urgencyLevel,
      imageCount: imageFiles.length, // Let the backend know how many images to expect
      validNoticedAt,
    };
    handlePostRequest(payload);
  };

  const animalTypes = [
    "Bird",
    "Mammal",
    "Reptile",
    "Amphibian",
    "Fish",
    "Insect",
    "Other",
  ];

  return (
    <section className="mb-8 relative">
      {/* Nature-themed decorative elements */}
      <div className="absolute -top-4 -left-4 w-16 h-16 text-green-600 opacity-20">
        <Leaf className="w-full h-full" />
      </div>
      <div className="absolute -bottom-4 -right-4 w-16 h-16 text-green-600 opacity-20">
        <PawPrint className="w-full h-full" />
      </div>

      {postSuccess && postData && (
        <PostSuccess show={postSuccess} onClose={() => setPostSuccess(false)} />
      )}

      <div
        className={`p-6 rounded-lg ${
          darkMode ? "bg-gray-800/50" : "bg-green-50/50"
        } border ${darkMode ? "border-green-800" : "border-green-200"}`}
      >
        <h2
          className={`text-2xl font-bold flex items-center ${
            darkMode ? "text-white" : "!text-[#2e7d32]"
          } mb-2`}
        >
          <PawPrint className="w-6 h-6 mr-2" />
          Wildlife Rescue Request
        </h2>

        <p
          className={`mb-6 ${
            darkMode ? "text-gray-300" : "!text-[#4b5563]"
          } border-l-4 ${
            darkMode ? "border-green-700" : "border-green-500"
          } pl-3 italic`}
        >
          Help us save wildlife by providing detailed information about the
          situation.
        </p>

        <div className="mt-4 space-y-6">
          {/* Image Upload Section - Enhanced */}
          <div className="rounded-lg overflow-hidden border border-dashed border-gray-300">
            <div
              className={`flex flex-col items-center justify-center p-6 transition-all duration-300 hover:bg-green-100 hover:border-green-600 cursor-pointer ${
                darkMode ? "bg-gray-700/50" : "bg-white/80"
              }`}
              onClick={() => imageInputRef.current?.click()}
            >
              <Camera
                className={`${
                  darkMode ? "text-green-400" : "text-green-600"
                } w-8 h-8 mb-2`}
              />
              <span
                className={`${
                  darkMode ? "text-white" : "text-green-800"
                } font-medium mb-1`}
              >
                Add Photos
              </span>
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Upload clear images to help our rescue team
              </span>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            ref={imageInputRef}
            onChange={handleModifiedImageChange}
          />

          {/* Fixed Image Preview Grid */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {imagePreviews.map((imgUrl, index) => (
                <div key={index} className="relative group">
                  <div className="h-32 w-full relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imgUrl}
                      alt={`Uploaded ${index}`}
                      className="h-full w-full object-cover"
                      style={{ display: "block" }}
                    />
                    <button
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {/*
            // Temporarily removed overlay for testing:
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
          */}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Animal Type Selection */}
          <div className="mt-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-white" : "!text-[#2e7d32]"
              }`}
            >
              Animal Type
              <span className="text-sm text-red-400 italic opacity-80">
                ( * optional )
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {animalTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setAnimalType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    animalType === type
                      ? darkMode
                        ? "bg-green-700 text-white"
                        : "bg-green-600 text-white"
                      : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 !text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Location and Date Inputs - Grouped */}
          <div className="mt-4 space-y-4">
            {/* Incident Location Input */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-white" : "!text-[#2e7d32]"
                }`}
              >
                <MapPin className="w-4 h-4 inline mr-1" />
                Incident Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter city and state..."
                  value={incidentLocation}
                  onChange={handleLocationChange}
                  className={`w-full p-3 pl-10 border rounded-lg focus:border-green-600 focus:ring-green-600 ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white !text-[#000000] border-gray-300"
                  }`}
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <button
                  onClick={() => setShowMapPicker(true)}
                  type="button"
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-green-400" : "text-green-600"
                  } hover:text-green-800`}
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>
              {showMapPicker && (
                <MapPicker
                  incidentLocation={incidentLocation}
                  onMapClick={handleMapClick}
                  onLocationSelect={(location, coordinates) => {
                    setIncidentLocation(location);
                    setLocationQuery(location);
                    setIncidentCoordinates(coordinates);
                  }}
                  darkMode={darkMode}
                />
              )}
            </div>

            {/* Noticed At Input */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-white" : "!text-[#2e7d32]"
                }`}
              >
                <Clock className="w-4 h-4 inline mr-1" />
                When Did You Notice It?
              </label>
              <input
                type="datetime-local"
                value={noticedAt}
                onChange={(e) => setNoticedAt(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:border-green-600 focus:ring-green-600 ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white !text-[#000000] border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Urgency Level Selector */}
          <div className="mt-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-white" : "!text-[#2e7d32]"
              }`}
            >
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setUrgencyLevel("low")}
                className={`p-2 rounded-lg flex flex-col items-center justify-center ${
                  urgencyLevel === "low"
                    ? darkMode
                      ? "bg-blue-700 text-white"
                      : "bg-blue-100 !text-blue-800 border-2 border-blue-500"
                    : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 !text-gray-600"
                }`}
              >
                <span className="font-medium">Low</span>
                <span className="text-xs mt-1">Can wait</span>
              </button>
              <button
                onClick={() => setUrgencyLevel("medium")}
                className={`p-2 rounded-lg flex flex-col items-center justify-center ${
                  urgencyLevel === "medium"
                    ? darkMode
                      ? "bg-yellow-700 text-white"
                      : "bg-yellow-100 !text-yellow-800 border-2 border-yellow-500"
                    : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 !text-gray-600"
                }`}
              >
                <span className="font-medium">Medium</span>
                <span className="text-xs mt-1">Needs attention</span>
              </button>
              <button
                onClick={() => setUrgencyLevel("high")}
                className={`p-2 rounded-lg flex flex-col items-center justify-center ${
                  urgencyLevel === "high"
                    ? darkMode
                      ? "bg-red-700 text-white"
                      : "bg-red-100 !text-red-800 border-2 border-red-500"
                    : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 !text-gray-600"
                }`}
              >
                <span className="font-medium">High</span>
                <span className="text-xs mt-1">Emergency</span>
              </button>
            </div>
          </div>

          {/* Current Actions Input - Enhanced */}
          <div className="mt-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-white" : "!text-[#2e7d32]"
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-1" />
              What Are You Doing To Help?
            </label>
            <textarea
              placeholder="Describe what you are doing to help the animal..."
              value={currentActions}
              onChange={(e) => setCurrentActions(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:border-green-600 focus:ring-green-600 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white !text-[#000000] border-gray-300"
              }`}
              rows={3}
            ></textarea>
          </div>

          {/* Description Input - Enhanced */}
          <div className="mt-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-white" : "!text-[#2e7d32]"
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Describe The Situation
            </label>
            <textarea
              placeholder="Please describe what you see, the animal's condition, behavior, and any hazards present..."
              value={description}
              onChange={handleDescriptionChange}
              className={`w-full p-3 border rounded-lg focus:border-green-600 focus:ring-green-600 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white !text-[#000000] border-gray-300"
              }`}
              rows={5}
            ></textarea>
          </div>

          {/* Submit Button - Enhanced */}
          <div className="mt-6 flex justify-center">
            <Button
              className={`flex items-center px-6 py-3 ${
                darkMode
                  ? "bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700"
                  : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              } text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-lg`}
              onClick={onPostRequest}
            >
              <Send className="w-5 h-5 mr-2" />
              Send Rescue Request
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostRequest;
