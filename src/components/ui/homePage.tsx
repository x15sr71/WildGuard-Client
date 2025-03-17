// HomePage.tsx
import { useRef, useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { UploadCloud, Search, Loader2, ConstructionIcon } from "lucide-react";
import { PawPrint, MapPin } from "lucide-react";
import axios from "axios";

export function HomePage() {
  // Get darkMode from Layout's context
  const { darkMode } = useOutletContext<{ darkMode: boolean }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Ref to the carousel's inner container
  const carouselContentRef = useRef<HTMLDivElement>(null);

  // States for upload process and dummy data
  const [status, setStatus] = useState<"idle" | "uploading" | "generating" | "complete">("idle");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [displayResponse, setDisplayResponse] = useState("");
  const [dots, setDots] = useState("");

  const ngos = [
    {
      name: "Wildlife Rescue Foundation",
      location: "Portland, OR",
      description: "Specializing in forest wildlife rehabilitation",
      contact: "+1 (503) 555-0192",
    },
    {
      name: "Animal Hope Alliance",
      location: "New York, NY",
      description: "Urban animal rescue and rehabilitation",
      contact: "+1 (212) 555-0156",
    },
    {
      name: "Marine Life Protect",
      location: "Miami, FL",
      description: "Marine animal conservation and rescue",
      contact: "+1 (305) 555-0134",
    },
  ];

  const dummyResponse = `Our AI analysis indicates this animal appears to be a young deer with minor superficial injuries. 

Recommended immediate actions:
1. Keep a safe distance
2. Provide fresh water
3. Contact local wildlife rescue

Do not attempt to handle the animal directly. Our nearest partner organization has been notified.`;

  const images = [
    "https://images.prismic.io/conservation/296c12ea-d827-4bda-bc0a-e82beb4576e2_Moholoholo+Rehab+Female+Student+feeding+antelope.jpeg?auto=compress,format&rect=0,237,1512,1008&w=1200&h=800",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh75TMAAVGw33vRMnvIkTFZvMxrhLA2SBBuu3YSR_xLsg8WkO8kN0UYzbJ8rDUo5cuNFHmL8sTgofuzWagdMhjt9PpeBuJC0oQvNBzXT6XvIc_JG734bmY2Q217WqQh8NgZiduk-XD4oxA/s1600/2016_11_02+Emma+rabbit+massage-6.jpg",
    "https://cdn.sanity.io/images/fa9ovwqs/production/96c657abedc8ecc492614904206fe59d46e1b72f-2542x2487.jpg?w=800&h=783&fit=crop",
  ];

  interface GeminiApiResponse {
    text?: string;
    error?: string;
}

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setUploadedImage(URL.createObjectURL(file));

    // Convert file to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const base64Image = reader.result?.toString().split(",")[1]; // Remove base64 prefix
        setStatus("generating");

        try {
            // Send the image to Gemini API
            const response = await axios.post<GeminiApiResponse>(
                "http://localhost:3000/gemini",
                { image: base64Image },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            //console.log(base64Image)
            console.log(response)
            const geminiResponse = response.data.text || "No response from Gemini";
            console.log(geminiResponse)
            setDisplayResponse(geminiResponse);
            setStatus("complete");
        } catch (error) {
          console.log(error)
            console.error("Error processing image with Gemini:", error);
            setDisplayResponse("Failed to analyze image.");
            setStatus("complete");
        }
    };
};
  
  // Animate dots during analysis
  useEffect(() => {
    if (status === "generating") {
      const timer = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
      return () => clearInterval(timer);
    }
  }, [status]);

  // Redirect to the result view when complete (state excludes darkMode)
  useEffect(() => {
    if (status === "complete") {
      navigate("/result", { state: { uploadedImage, displayResponse, ngos } });
    }
  }, [status, navigate, uploadedImage, displayResponse, ngos]);

  // Auto-play: scroll the carousel content every 3 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselContentRef.current) {
        const container = carouselContentRef.current;
        const slideWidth = container.clientWidth;
        const newScrollLeft = container.scrollLeft + slideWidth;
        // If reached the end, scroll back to start
        if (newScrollLeft >= container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`flex flex-col items-center w-full min-h-screen ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Carousel */}
      <Carousel className="w-full">
        {/* Attach ref to CarouselContent so we can control scroll */}
        <CarouselContent ref={carouselContentRef}>
          {images.map((image, index) => (
            <CarouselItem key={index} className="relative h-[40vh] sm:h-[50vh] md:h-[60vh]">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg text-center px-4">
                    {darkMode ? "Join the WildGuard Mission" : "Animal Rescue Initiative"}
                  </h1>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Upload Section */}
      <section className={`w-full text-center py-12 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <h2 className="text-3xl font-bold mb-2">AI-Powered Animal Rescue</h2>
        <p className={darkMode ? "text-gray-300 mb-6" : "text-gray-600 mb-6"}>
          {status === "idle" ? "Upload an animal photo for specialized help" : "Processing your request..."}
        </p>
        <div
          className={`border-2 border-dashed p-6 rounded-md max-w-md mx-auto transition-colors ${
            status === "idle"
              ? (darkMode ? "border-green-500 hover:bg-gray-700" : "border-green-600 hover:bg-green-100") + " cursor-pointer"
              : "border-gray-400"
          }`}
          onClick={status === "idle" ? handleCameraClick : undefined}
        >
          {status === "idle" ? (
            <>
              <UploadCloud size={40} className={`mx-auto ${darkMode ? "text-green-400" : "text-green-600"}`} />
              <p className={`mt-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Click to upload animal photo
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                {status === "uploading" ? "Uploading image..." : `Analyzing image${dots}`}
              </p>
            </div>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`w-full py-12 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {["Upload Photo", "Analyze", "Rescue"].map((step, index) => (
            <div key={index} className={`flex flex-col items-center p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
              {index === 0 && <UploadCloud size={32} className="text-green-500" />}
              {index === 1 && <Search size={32} className="text-green-500" />}
              {index === 2 && <PawPrint size={32} className="text-green-500" />}
              <h3 className="text-xl font-semibold mt-4">{step}</h3>
              <p className="text-center mt-2">
                {index === 0 && "Capture and upload an image of the animal in need"}
                {index === 1 && "Our AI analyzes the image to identify issues and needs"}
                {index === 2 && "Connect with rescue teams and receive specialized help"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* NGO Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 w-full max-w-6xl">
        {ngos.map((ngo, index) => (
          <div key={index} className={`p-6 rounded-lg shadow-md hover:shadow-lg transition ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white"}`}>
            <div>
              <h3 className={darkMode ? "text-white" : "text-gray-900"}>{ngo.name}</h3>
              <p className={`text-sm flex items-center gap-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                <MapPin size={16} /> {ngo.location}
              </p>
              <p className={`mt-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{ngo.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{ngo.contact}</span>
                <Button className="text-sm" size="sm">
                  Contact
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
