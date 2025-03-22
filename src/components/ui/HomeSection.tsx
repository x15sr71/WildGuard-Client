import React, { ChangeEvent, useState, useEffect } from "react";
import { Button } from "./button";
import { MapPin, Map, PawPrint } from "lucide-react";
import MapPicker from "./mapPicker";
import axios from "axios";
import PostSuccess from "./postSuccess";

type HomeSectionProps = {
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

const HomeSection: React.FC<HomeSectionProps> = ({
  darkMode,
  incidentLocation,
  setIncidentLocation,
  uploadedImages,
  handleImageChange,
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
  const [incidentCoordinates, setIncidentCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  // Local state for debouncing the text input
  const [locationQuery, setLocationQuery] = useState(incidentLocation);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postData, setPostData] = useState<any>(null);

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

  const handlePostRequest = async (payload: any) => {
    try {
      const response = await axios.post("http://localhost:3000/api/post-request", payload);
      console.log("Post successful:", response.data);
      setPostSuccess(true);
      setPostData(response.data);
    } catch (error) {
      console.error("Error posting request:", error);
    }
  };

  // Construct and send payload on post
  const onPostRequest = () => {
    const payload = {
      firebaseId: "U5PDLZFt2yfO5DcTZKGrkCkkEb43",
      incidentLocation: {
        place: incidentLocation,
        gpsLocation: incidentCoordinates
          ? {
              latitude: incidentCoordinates.lat.toString(),
              longitude: incidentCoordinates.lng.toString(),
            }
          : null,
      },
      uploadedImages,
      noticedAt,
      currentActions,
      description,
    };
    handlePostRequest(payload);
  };

  return (
    <section className="mb-8">
      {postSuccess && postData && <PostSuccess show={postSuccess} onClose={() => setPostSuccess(false)} />}
      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "!text-[#000000]"}`}>
        Need Help? Post Your Request
      </h2>
      <p className={`mt-4 ${darkMode ? "text-gray-300" : "!text-[#000000]"}`}>
        Please add images related to your concern and describe the issue below.
      </p>
      <div className="mt-4 space-y-4">
        {/* Image Upload Section */}
        <div
          className="flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-green-600 p-4 rounded cursor-pointer"
          onClick={() => imageInputRef.current?.click()}
        >
          <div className="flex items-center gap-2">
            <PawPrint className={`${darkMode ? "text-white" : "text-black"} w-5 h-5`} />
            <span className={`${darkMode ? "text-white" : "text-black"}`}>Add Images</span>
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
        {uploadedImages.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {uploadedImages.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Uploaded ${index}`}
                className="max-h-32 object-contain rounded shadow-sm"
              />
            ))}
          </div>
        )}
        {/* Location and Date Inputs */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Incident Location Input */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-white" : "!text-[#000000]"}`}>
              Incident Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter city and state..."
                value={incidentLocation}
                onChange={handleLocationChange}
                className={`w-full p-2 pl-10 border rounded focus:border-green-600 focus:ring-green-600 ${
                  darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 !text-[#000000] border-gray-300"
                }`}
              />
              <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <button
                onClick={() => setShowMapPicker(true)}
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
            {showMapPicker && (
              <MapPicker
                incidentLocation={incidentLocation}
                onMapClick={handleMapClick}
                // When a location is selected from the map, update both the text and the coordinates
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
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-white" : "!text-[#000000]"}`}>
              Noticed At
            </label>
            <input
              type="datetime-local"
              value={noticedAt}
              onChange={(e) => setNoticedAt(e.target.value)}
              className={`w-full p-2 border rounded focus:border-green-600 focus:ring-green-600 ${
                darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 !text-[#000000] border-gray-300"
              }`}
            />
          </div>
        </div>
        {/* Current Actions Input */}
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-white" : "!text-[#000000]"}`}>
            Current Actions
          </label>
          <textarea
            placeholder="Describe what you are doing to help..."
            value={currentActions}
            onChange={(e) => setCurrentActions(e.target.value)}
            className={`w-full p-2 border rounded focus:border-green-600 focus:ring-green-600 ${
              darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 !text-[#000000] border-gray-300"
            }`}
            rows={3}
          ></textarea>
        </div>
        {/* Description Input */}
        <div className="mt-4">
          <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-white" : "!text-[#000000]"}`}>
            Description
          </label>
          <textarea
            placeholder="Describe your concern here..."
            value={description}
            onChange={handleDescriptionChange}
            className={`w-full p-2 border rounded focus:border-green-600 focus:ring-green-600 ${
              darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 !text-[#000000] border-gray-300"
            }`}
            rows={5}
          ></textarea>
        </div>
        <Button
          className="mt-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2"
          onClick={onPostRequest}
        >
          Post Request
        </Button>
      </div>
    </section>
  );
};

export default HomeSection;
