import { useEffect, useState } from "react";

const useLoadGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (!window.google?.maps) {
        console.error("Google Maps library failed to load.");
        return;
      }

      try {
        await window.google.maps.importLibrary("maps"); // Ensure core library is loaded
        await window.google.maps.importLibrary("places"); // Ensure Places API is loaded
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading Google Maps libraries:", error);
      }
    };

    loadGoogleMaps();
  }, []);

  return isLoaded;
};

export default useLoadGoogleMaps;
