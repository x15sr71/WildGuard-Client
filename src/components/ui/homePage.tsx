import { useRef, useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { UploadCloud, Search, Loader2, Leaf, Camera, PlusCircle, Heart } from "lucide-react";
import { PawPrint, MapPin, Globe, AlertTriangle } from "lucide-react";
import axios from "axios";

// Global variable to store the user's location
let currentUserLocation: { latitude: number; longitude: number } | null = null;

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
  const [ngos, setNgos] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showLocationTooltip, setShowLocationTooltip] = useState(false);

  // Facts about wildlife conservation
  const [wildlifeFact, setWildlifeFact] = useState("");
  const wildlifeFacts = [
    "Over 37,400 species are threatened with extinction today.",
    "Habitat loss affects 85% of all species listed as threatened or endangered.",
    "Wildlife rehabilitation saves thousands of animals each year.",
    "One rehabilitated animal can help preserve genetic diversity in its species.",
    "Your quick action can be the difference between life and death for injured wildlife."
  ];

  // Local state for location (for UI logic only)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Try to get the location after a 3-second delay on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("User location:", latitude, longitude);
            setLocation({ latitude, longitude });
            currentUserLocation = { latitude, longitude };
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocation(null);
            currentUserLocation = null;
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }, 500);

    // Set a random wildlife fact
    setWildlifeFact(wildlifeFacts[Math.floor(Math.random() * wildlifeFacts.length)]);

    return () => clearTimeout(timer);
  }, []);

  // Modified camera click handler to check location permission
  const handleCameraClick = () => {
    if (!currentUserLocation) {
      setShowLocationTooltip(true);
      setTimeout(() => setShowLocationTooltip(false), 5000);
      
      // Try to re-fetch the location if it's not available.
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Got location after pop-up:", latitude, longitude);
            setLocation({ latitude, longitude });
            currentUserLocation = { latitude, longitude };
            // Now trigger the file input.
            fileInputRef.current?.click();
          },
          (error) => {
            console.error("Error getting location:", error);
            // If location is still not granted, inform the user.
            alert("Please grant your location for nearby NGO");
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const firebaseId = localStorage.getItem("firebaseId");
    console.log(firebaseId);
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
        // Send the image and location data to the /gemini endpoint
        const response = await axios.post<{ imageSummary?: string } & Record<string, any>[]>(
          "https://wildgaurd-backend-794553988056.asia-south1.run.app/gemini",
          { 
            image: base64Image,
            location: currentUserLocation // Send the stored location here
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-Firebase-Id": firebaseId, // Send Firebase ID if available
            },
          }
        );

        console.log(response);

        // Extract imageSummary safely
        const geminiResponse = response.data[0]?.imageSummary || "No response from Gemini";

        console.log(geminiResponse);
        setDisplayResponse(geminiResponse);
        setStatus("complete");

        // Save full response for navigation (exclude the first object which is the `imageSummary`)
        setNgos(response.data.slice(1));
      } catch (error) {
        console.error("Error processing image with Gemini:", error);
        setDisplayResponse("Failed to analyze image.");
        setStatus("complete");
      }
    };
  };

  // Redirect to the result view when complete
  useEffect(() => {
    if (status === "complete") {
      navigate("/result", {
        state: { uploadedImage, displayResponse, ngos },
      });
    }
  }, [status, navigate, uploadedImage, displayResponse, ngos]);

  // Auto-play: scroll the carousel content every 5 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      if (carouselContentRef.current) {
        const container = carouselContentRef.current;
        const slideWidth = container.clientWidth;
        
        // Update the active slide state
        setActiveSlide(prev => (prev + 1) % 3);
        
        const newScrollLeft = (activeSlide + 1) % 3 * slideWidth;
        // If reached the end, scroll back to start
        if (newScrollLeft >= container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  // Animation for the dots in the loading state
  const [dots, setDots] = useState(".");
  useEffect(() => {
    if (status === "generating") {
      const dotsInterval = setInterval(() => {
        setDots(prev => prev.length < 3 ? prev + "." : ".");
      }, 500);
      return () => clearInterval(dotsInterval);
    }
  }, [status]);

  return (
    <div
      className={`flex flex-col items-center w-full min-h-screen ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Wildlife Facts Banner */}
      <div className={`w-full py-2 px-4 text-center text-sm ${darkMode ? "bg-green-800" : "bg-green-600"} text-white`}>
        <div className="flex items-center justify-center gap-2">
          <Leaf size={16} className="animate-pulse" />
          <p className="font-medium">{wildlifeFact}</p>
        </div>
      </div>
      
      {/* Carousel */}
      <Carousel className="w-full">
        <CarouselContent ref={carouselContentRef}>
          {[
            "https://images.prismic.io/conservation/296c12ea-d827-4bda-bc0a-e82beb4576e2_Moholoholo+Rehab+Female+Student+feeding+antelope.jpeg?auto=compress,format&rect=0,237,1512,1008&w=1200&h=800",
            "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh75TMAAVGw33vRMnvIkTFZvMxrhLA2SBBuu3YSR_xLsg8WkO8kN0UYzbJ8rDUo5cuNFHmL8sTgofuzWagdMhjt9PpeBuJC0oQvNBzXT6XvIc_JG734bmY2Q217WqQh8NgZiduk-XD4oxA/s1600/2016_11_02+Emma+rabbit+massage-6.jpg",
            "https://cdn.sanity.io/images/fa9ovwqs/production/96c657abedc8ecc492614904206fe59d46e1b72f-2542x2487.jpg?w=800&h=783&fit=crop",
          ].map((image, index) => (
            <CarouselItem
              key={index}
              className="relative h-[40vh] sm:h-[50vh] md:h-[60vh]"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 flex flex-col items-center justify-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg text-center px-4 text-gray-300">
                    Join the WildGuard Mission
                  </h1>
                  <p className="mt-4 max-w-2xl text-center text-gray-200 drop-shadow-md px-6">
                    {index === 0 && "Every rescue begins with compassion. Be the difference in a wild life today."}
                    {index === 1 && "Specialized care for every species. From rehabilitation to release."}
                    {index === 2 && "Protecting biodiversity through rescue, rehabilitation and conservation."}
                  </p>
                  <Button 
                    onClick={handleCameraClick}
                    className="mt-6 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 flex items-center gap-2 transition-all transform hover:scale-105" 
                  >
                    <Camera size={18} />
                    Report Animal in Need
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Carousel Controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => {
                setActiveSlide(i);
                if (carouselContentRef.current) {
                  carouselContentRef.current.scrollTo({
                    left: i * carouselContentRef.current.clientWidth,
                    behavior: "smooth"
                  });
                }
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                activeSlide === i 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </Carousel>

      {/* Upload Section */}
      <section
        className={`w-full text-center py-12 -mt-5 rounded-t-3xl shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-block bg-green-600 text-white rounded-full px-4 py-1 text-sm font-medium mb-4">
            AI-Powered Rescue
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Help Wildlife in Distress</h2>
          <p className={`max-w-2xl mx-auto ${darkMode ? "text-gray-300 mb-6" : "text-gray-600 mb-6"}`}>
            {status === "idle"
              ? "Take a photo of an animal in need, and our AI will analyze the situation and connect you with specialized wildlife rescuers in your area."
              : "Processing your request..."}
          </p>
          
          <div
            className={`border-2 border-dashed p-6 rounded-xl max-w-md mx-auto transition-all transform hover:-translate-y-1 ${
              status === "idle"
                ? (darkMode
                    ? "border-green-500 hover:bg-gray-700/50 hover:border-green-400"
                    : "border-green-600 hover:bg-green-100") + " cursor-pointer"
                : "border-gray-400"
            }`}
            onClick={status === "idle" ? handleCameraClick : undefined}
          >
            {status === "idle" ? (
              <>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                    <UploadCloud
                      size={40}
                      className={`mx-auto ${
                        darkMode ? "text-green-600" : "text-green-600"
                      }`}
                    />
                  </div>
                  {showLocationTooltip && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white text-xs py-2 px-3 rounded shadow-lg fade-in">
                      <div className="flex items-center gap-1">
                        <AlertTriangle size={14} />
                        <span>Location access needed to find nearby rescuers</span>
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-yellow-600"></div>
                    </div>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-medium">Upload Animal Photo</h3>
                <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                  Take or select a clear photo of the animal in need
                </p>
                {location && (
                  <div className={`mt-3 flex items-center justify-center text-xs ${darkMode ? "text-green-400" : "text-green-600"}`}>
                    <MapPin size={12} className="mr-1" />
                    <span>Location enabled for nearby rescue</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6">
                <Loader2 className="h-10 w-10 animate-spin text-green-500" />
                <h3 className="font-medium">
                  {status === "uploading"
                    ? "Uploading image..."
                    : "Analyzing animal needs"}
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {status === "uploading"
                    ? "Securing image data..."
                    : `Identifying species and condition${dots}`}
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`w-full py-16 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-green-600 text-white rounded-full px-4 py-1 text-sm font-medium mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl font-bold">How WildGuard Works</h2>
            <p className={`mt-4 max-w-2xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Our platform uses advanced AI to connect distressed wildlife with specialized rescuers in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Progress line connecting the cards */}
            <div className="hidden md:block absolute top-1/3 left-0 right-0 h-0.5 bg-green-500 z-0"></div>
            
            {[
              {
                icon: <Camera size={32} className="text-white" />,
                title: "Upload Photo",
                description: "Capture and upload an image of the animal in need",
                color: "bg-green-600"
              },
              {
                icon: <Search size={32} className="text-white" />,
                title: "AI Analysis",
                description: "Our AI identifies the species, condition, and required assistance",
                color: "bg-green-500" 
              },
              {
                icon: <PawPrint size={32} className="text-white" />,
                title: "Connect & Rescue",
                description: "Get connected with specialized rescuers in your area",
                color: "bg-green-400"
              }
            ].map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center p-6 rounded-xl shadow-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                } relative z-10 transform transition-transform hover:-translate-y-2`}
              >
                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mb-4 shadow-md`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className={`text-center mt-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {step.description}
                </p>
                <div className={`mt-5 w-8 h-8 rounded-full ${step.color} flex items-center justify-center text-white font-bold`}>
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Help Section */}
      <section className={`w-full py-12 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-600 text-white rounded-xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/4 flex justify-center">
              <AlertTriangle size={80} className="text-white" />
            </div>
            <div className="md:w-3/4 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-3">Need Immediate Wildlife Help?</h3>
              <p className="mb-4">
                If you've found an animal in urgent distress that needs immediate professional attention:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button className="bg-white text-red-600 hover:bg-gray-100 rounded-full px-6 py-2">
                  Call Emergency: 1-800-WILD-HELP
                </Button>
                <Button className="bg-red-700 hover:bg-red-800 text-white rounded-full px-6 py-2">
                  Video Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className={`w-full py-16 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-green-600 text-white rounded-full px-4 py-1 text-sm font-medium mb-4">
              Our Impact
            </div>
            <h2 className="text-3xl font-bold">Making a Difference Together</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <PawPrint size={32} />, number: "5,280+", label: "Animals Rescued" },
              { icon: <Globe size={32} />, number: "320+", label: "Partner NGOs" },
              { icon: <MapPin size={32} />, number: "85+", label: "Locations Covered" },
              { icon: <Heart size={32} />, number: "12,500+", label: "Volunteers" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`text-center p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"} shadow-md`}
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-green-500">{stat.number}</div>
                <div className={darkMode ? "text-gray-300" : "text-gray-600"}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NGO Cards Section */}
      <section className={`w-full py-12 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-green-600 text-white rounded-full px-4 py-1 text-sm font-medium mb-4">
              Our Partners
            </div>
            <h2 className="text-3xl font-bold mb-4">Wildlife Rescue Partners</h2>
            <p className={`max-w-2xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Connect with wildlife rescue organizations in your area specializing in different species and situations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ngos.length > 0 ? (
              ngos.map((ngo, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border-t-4 border-green-500 ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <div>
                    <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {ngo.name}
                    </h3>
                    <p
                      className={`text-sm flex items-center gap-1 mt-2 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <MapPin size={16} /> {ngo.location}
                    </p>
                    <div className="my-3 flex flex-wrap gap-2">
                      {["Birds", "Mammals", "Rehabilitation"].map((tag, i) => (
                        <span key={i} className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className={`mt-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {ngo.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {ngo.contact}
                      </span>
                      <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4">
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Placeholder NGO cards when none are loaded
              Array(3).fill(0).map((_, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border-t-4 border-green-500 ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <div>
                    <h3 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {["Wildlife SOS", "Animal Rescue Network", "Wild Care Foundation"][index]}
                    </h3>
                    <p
                      className={`text-sm flex items-center gap-1 mt-2 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <MapPin size={16} /> {["New Delhi, India", "San Francisco, USA", "Sydney, Australia"][index]}
                    </p>
                    <div className="my-3 flex flex-wrap gap-2">
                      {[
                        ["Birds", "Reptiles", "First Aid"],
                        ["Mammals", "Marine", "Rehabilitation"],
                        ["Exotic Species", "Education", "Conservation"]
                      ][index].map((tag, i) => (
                        <span key={i} className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className={`mt-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {["Specializing in reptile and bird rescue with emergency response teams available 24/7.", 
                        "Expert rehabilitation for mammals with state-of-the-art facilities.",
                        "Focusing on education, conservation, and rehabilitation of all wildlife species."][index]}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {["+91 1234567890", "+1 (555) 123-4567", "+61 2 1234 5678"][index]}
                      </span>
                      <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4">
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-8">
            <Button className="bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 border border-green-500 text-green-500 rounded-full px-6 py-2 flex items-center gap-2 mx-auto">
              <PlusCircle size={18} />
              View All Wildlife Partners
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Be a Guardian of Wildlife</h2>
          <p className="mb-8 text-lg">
            Join our mission to protect and rehabilitate wildlife in need. Every action counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-green-700 hover:bg-gray-100 rounded-full px-6 py-6 flex-1 max-w-xs mx-auto">
              Become a Volunteer
            </Button>
            <Button className="bg-transparent hover:bg-green-800 border-2 border-white rounded-full px-6 py-6 flex-1 max-w-xs mx-auto">
              Donate to Rescue Efforts
            </Button>
          </div>
        </div>
      </section>

      {/* Custom styles for animations are moved to global CSS file */}
    </div>
  );
}