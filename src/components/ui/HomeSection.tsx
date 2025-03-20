// HomeSection.tsx
import React, { ChangeEvent } from "react";
import { Button } from "./button";
import { MapPin, Map, PawPrint } from "lucide-react";
import MapPicker from "./mapPicker";

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
  handlePostRequest: () => void;
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
  handlePostRequest,
  showMapPicker,
  setShowMapPicker,
  handleMapClick,
}) => {
  return (
    <section className="mb-8">
      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
        Need Help? Post Your Request
      </h2>
      <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        Please add images related to your concern and describe the issue below.
      </p>
      <div className="mt-4 space-y-4">
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
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
              Incident Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter city and state..."
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                className={`w-full p-2 pl-10 border rounded focus:border-green-600 focus:ring-green-600 ${
                  darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-gray-900 border-gray-300"
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
                onLocationSelect={(location) => setIncidentLocation(location)}
                darkMode={darkMode}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
              Noticed At
            </label>
            <input
              type="datetime-local"
              value={noticedAt}
              onChange={(e) => setNoticedAt(e.target.value)}
              className={`w-full p-2 border rounded focus:border-green-600 focus:ring-green-600 ${
                darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-gray-900 border-gray-300"
              }`}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
            Current Actions
          </label>
          <textarea
            placeholder="Describe what you are doing to help..."
            value={currentActions}
            onChange={(e) => setCurrentActions(e.target.value)}
            className={`w-full p-2 border rounded focus:border-green-600 focus:ring-green-600 ${
              darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-gray-900 border-gray-300"
            }`}
            rows={3}
          ></textarea>
        </div>
        <div className="mt-4">
          <textarea
            placeholder="Describe your concern here..."
            value={description}
            onChange={handleDescriptionChange}
            className={`w-full p-2 border rounded focus:border-green-600 focus:ring-green-600 ${
              darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-gray-900 border-gray-300"
            }`}
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
  );
};

export default HomeSection;
