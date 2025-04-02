import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export function ResultView() {
  const { darkMode } = useOutletContext<{ darkMode: boolean }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [visibleText, setVisibleText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);
  
  if (!state) {
    return (
      <div className="p-6 text-center">
        <p className="text-base text-gray-700 dark:text-gray-300">
          No result data available. Please go back and upload an image.
        </p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const { uploadedImage, displayResponse, ngos } = state;

  useEffect(() => {
    if (displayResponse) {
      setLoading(false);
      const fullText = displayResponse.trim();
      let currentIndex = -1;
      const interval = setInterval(() => {
        currentIndex++;
        if (currentIndex < fullText.length) {
          setVisibleText((prev) => prev + fullText[currentIndex]);
        } else {
          clearInterval(interval);
        }
      });
      return () => clearInterval(interval);
    }
  }, [displayResponse]);

  // Paginate the NGOs list
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNgos = ngos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(ngos.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={`w-full flex flex-col md:flex-row p-6 gap-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Left Column: Image & Analysis */}
      <div className="flex-1 flex flex-col gap-6">
        <div className={`rounded-lg overflow-hidden shadow-sm ${darkMode ? "border border-gray-700" : "border border-gray-200"}`}>
          <img
            src={uploadedImage}
            alt="Uploaded preview"
            className="w-full max-h-[12cm] object-contain"
          />
        </div>
        <div className={`flex-1 rounded-lg p-6 shadow-lg ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
          {loading ? (
            <div className="text-center text-gray-500">Analyzing image...</div>
          ) : (
            <div className="prose prose-sm dark:prose-invert text-base font-sans tracking-normal leading-relaxed fade-in">
              <ReactMarkdown>{visibleText}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: NGO List */}
      <div className="md:w-96 flex flex-col gap-4">
        <h3 className={`text-2xl font-semibold tracking-wide pb-2 border-b-2 ${darkMode ? "text-white border-blue-500" : "text-gray-900 border-blue-500"}`}>
          Nearby Organizations
        </h3>

        {/* "Post Help Needed" Button */}
        <Button
          className="bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-lg px-4 py-2 transition hover:scale-105 active:scale-95"
          onClick={() => navigate("/volunteer-login")}
        >
          Need Help? Get in touch with nearby Volunteers
        </Button>

        {currentNgos && currentNgos.length > 0 ? (
          currentNgos.map((ngo: any, index: number) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md transition-colors ${
                darkMode
                  ? "bg-gray-800 border border-gray-700 hover:bg-gray-750"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <h4 className={`text-lg font-medium tracking-wide ${darkMode ? "text-white" : "text-gray-900"}`}>
                {ngo.name}
              </h4>
              <p className={`text-sm flex items-center gap-1 mt-1 tracking-tight ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                <MapPin size={14} /> {ngo.location}
                {ngo.distance && <span> - {Number(ngo.distance).toFixed(2)} km</span>}
              </p>
              {ngo.focusArea && (
                <p className={`mt-1 text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <strong>Focus Area:</strong> {ngo.focusArea}
                </p>
              )}
              <p className={`mt-2 text-base leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {ngo.description}
              </p>
              {ngo.summary && (
                <p className={`mt-2 text-base leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <strong>Summary:</strong> {ngo.summary}
                </p>
              )}
              {ngo.affiliations && (
                <p className={`mt-2 text-base leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <strong>Affiliations:</strong> {ngo.affiliations}
                </p>
              )}
              {ngo.emergencyResponse && (
                <p className={`mt-2 text-base leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <strong>Emergency Response:</strong> {ngo.emergencyResponse}
                </p>
              )}
              {ngo.operatingHours && (
                <p className={`mt-2 text-base leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <strong>Operating Hours:</strong> {ngo.operatingHours}
                </p>
              )}
              <div className="mt-4 flex flex-col gap-1">
                {ngo.contactNumber && (
                  <span className={`text-sm tracking-normal ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <strong>Phone:</strong> {ngo.contactNumber}
                  </span>
                )}
                {ngo.emailAddress && (
                  <span className={`text-sm tracking-normal ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <strong>Email:</strong> {ngo.emailAddress}
                  </span>
                )}
              </div>
              <div className="mt-4 flex justify-between">
                {ngo.googleMapLocation && (
                  <Button
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 hover:scale-105 active:scale-95 transition"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${ngo.googleMapLocation.latitude},${ngo.googleMapLocation.longitude}`,
                        "_blank"
                      )
                    }
                  >
                    Get Location
                  </Button>
                )}
                {ngo.website && (
                  <Button
                    className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-4 hover:scale-105 active:scale-95 transition"
                    onClick={() =>
                      window.open(
                        ngo.website.startsWith("http") ? ngo.website : `http://${ngo.website}`,
                        "_blank"
                      )
                    }
                  >
                    Visit Website
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No nearby NGOs found.</p>
        )}

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-between">
          <Button
            className="bg-gray-500 hover:bg-gray-600 text-white"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            className="bg-gray-500 hover:bg-gray-600 text-white"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

