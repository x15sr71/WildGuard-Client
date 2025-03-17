import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export function ResultView() {
  const { darkMode } = useOutletContext<{ darkMode: boolean }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [streamedText, setStreamedText] = useState("");

  if (!state) {
    return (
      <div className="p-6 text-center">
        <p>No result data available. Please go back and upload an image.</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const { uploadedImage, displayResponse, ngos } = state;

  useEffect(() => {
    if (displayResponse) {
      setLoading(false);
      setStreamedText("");
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < displayResponse.length) {
          setStreamedText((prev) => prev + displayResponse[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [displayResponse]);

  return (
    <div className={`w-full flex flex-col md:flex-row p-6 gap-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Left Column: Image & Analysis */}
      <div className="flex-1 flex flex-col gap-6">
        <div className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? "border border-gray-700" : "border border-gray-200"}`}>
          <img 
            src={uploadedImage} 
            alt="Uploaded preview" 
            className="w-full h-64 object-cover"
          />
        </div>
        <div className={`flex-1 rounded-lg p-6 shadow-lg ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
          {loading ? (
            <div className="text-center text-gray-500">Analyzing image...</div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">
              {streamedText}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: NGO List */}
      <div className="md:w-96 flex flex-col gap-4">
        <h3 className="text-xl font-bold">Nearby Organizations</h3>
        {ngos && ngos.length > 0 ? (
          ngos.map((ngo: any, index: number) => (
            <div 
              key={index}
              className={`p-6 rounded-lg shadow-sm ${darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"} transition-colors`}
            >
              <h4 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {ngo.name}
              </h4>
              <p className={`text-sm flex items-center gap-1 mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                <MapPin size={14} /> {ngo.location}
              </p>
              <p className={`mt-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {ngo.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {ngo.contact}
                </span>
                <Button className="text-sm" size="sm">
                  Contact
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No nearby NGOs found.</p>
        )}
      </div>
    </div>
  );
}
