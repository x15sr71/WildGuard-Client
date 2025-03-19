import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { FaLocationArrow } from "react-icons/fa";

const GOOGLE_MAPS_API_KEY = "AIzaSyDNNeLMYjAf_V2eEVJQPmf7j2M8TzXqyO8"; // Replace with your actual API key

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 28.6139, // Default latitude (New Delhi, India)
  lng: 77.209,  // Default longitude
};

const libraries: ("places")[] = ["places"];

interface MapPickerProps {
  incidentLocation: string;
  onMapClick: (event: google.maps.MapMouseEvent) => void;
  onLocationSelect: (location: string) => void;
  darkMode: boolean;
}

const MapPicker: React.FC<MapPickerProps> = ({ 
  incidentLocation, 
  onMapClick, 
  onLocationSelect,
  darkMode 
}) => {
  const initialCenter = incidentLocation
    ? {
        lat: parseFloat(incidentLocation.split(",")[0]),
        lng: parseFloat(incidentLocation.split(",")[1]),
      }
    : defaultCenter;

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !map) return;

    // Ensure the Google Maps API has loaded the marker module
    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
      if (!marker) {
        const newMarker = new google.maps.marker.AdvancedMarkerElement({
          position: mapCenter,
          map: map,
        });
        setMarker(newMarker);
      } else {
        marker.position = mapCenter;
      }
    }
  }, [isLoaded, map, marker, mapCenter]);

  const onLoadMap = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const locationString = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setMapCenter({ lat, lng });
        onLocationSelect(locationString);
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const locationString = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          setMapCenter({ lat, lng });
          onLocationSelect(locationString);
        },
        (error) => {
          console.error("Error retrieving location", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (loadError) return <div>Error loading map: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className={`mt-2 shadow-lg rounded border ${
      darkMode ? "border-gray-600" : "border-[#0F9D58]"
    } overflow-hidden`}>
      <div className="p-2 flex gap-2">
        <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
          <input 
            type="text" 
            placeholder="Search for a location..." 
            className={`p-2 border rounded w-full focus:outline-none focus:ring-2 ${
              darkMode 
                ? "bg-gray-700 border-gray-500 text-white placeholder-gray-400 focus:ring-green-500" 
                : "bg-white border-[#0F9D58] text-gray-900 placeholder-gray-500 focus:ring-[#0F9D58]"
            }`}
          />
        </Autocomplete>
        <button 
          onClick={handleUseCurrentLocation} 
          className={`p-2 border rounded hover:opacity-80 transition-opacity ${
            darkMode 
              ? "bg-gray-700 border-gray-500 text-white" 
              : "bg-white border-[#0F9D58] text-[#0F9D58]"
          }`}
        >
          <FaLocationArrow className="text-xl" />
        </button>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        onClick={onMapClick}
        onLoad={onLoadMap}
        options={{
          styles: darkMode ? [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          ] : [],
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      />
    </div>
  );
};

export default MapPicker;
