// import { useRef, useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useNavigate } from "react-router-dom";
// import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
// import { UploadCloud, Search, MapPin, PawPrint, Sun, Moon, Loader2 } from "lucide-react";

// export function UploadImage() {
//   const navigate = useNavigate();
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const [status, setStatus] = useState<"idle" | "uploading" | "generating" | "complete">("idle");
//   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//   const [displayResponse, setDisplayResponse] = useState("");
//   const [dots, setDots] = useState("");

//   // Dummy AI response
//   const dummyResponse = `Our AI analysis indicates this animal appears to be a young deer with minor superficial injuries. 

// Recommended immediate actions:
// 1. Keep a safe distance
// 2. Provide fresh water
// 3. Contact local wildlife rescue

// Do not attempt to handle the animal directly. Our nearest partner organization has been notified.`;

//   const handleCameraClick = () => {
//     fileInputRef.current?.click();
//   };

//   // Handle file upload and simulate the upload + analysis process
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setStatus("uploading");
//     setUploadedImage(URL.createObjectURL(file));

//     // Simulate upload delay (1.5 seconds)
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     setStatus("generating");

//     // Simulate a typing effect for the dummy response
//     let currentIndex = 0;
//     const interval = setInterval(() => {
//       setDisplayResponse(dummyResponse.slice(0, currentIndex));
//       currentIndex++;
//       if (currentIndex > dummyResponse.length) {
//         clearInterval(interval);
//         setStatus("complete");
//       }
//     }, 20);
//   };

//   // Animated dots effect during generating state
//   useEffect(() => {
//     if (status === "generating") {
//       const interval = setInterval(() => {
//         setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
//       }, 500);
//       return () => clearInterval(interval);
//     }
//   }, [status]);

//   // Navigate to /rescureviaimage once the status is complete
//   useEffect(() => {
//     if (status === "complete") {
//       navigate("/rescureviaimage", {
//         state: {
//           uploadedImage,
//           responseText: displayResponse,
//         },
//       });
//     }
//   }, [status, navigate, uploadedImage, displayResponse]);

//   return (
// <div
//   className={`flex flex-col items-center w-full ${
//     darkMode ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white" : "bg-gray-50 text-gray-900"
//   }`}
// >  
//   {/* Upload Section */}
//   <section className={`w-full text-center py-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
//     <h2 className="text-3xl font-bold mb-2">AI-Powered Animal Rescue</h2>
//     <p className={darkMode ? "text-gray-300 mb-4" : "text-gray-600 mb-4"}>
//       Upload an animal photo for specialized help
//     </p>
//     <div
//       className={`border-2 border-dashed border-green-600 p-6 rounded-md max-w-md mx-auto cursor-pointer transition-colors active:scale-95 ${
//         darkMode ? "hover:bg-gray-700 hover:border-green-500" : "hover:bg-green-100 hover:border-green-700 hover:text-green-700"
//       }`}
//       onClick={handleCameraClick}
//     >
//       <UploadCloud
//         size={40}
//         className={`mx-auto ${darkMode ? "text-green-400" : "text-green-600"} transition-colors`}
//       />
//       <p
//         className={`mt-2 ${darkMode ? "text-gray-200" : "text-gray-700"} transition-colors ${
//           !darkMode && "hover:text-green-700"
//         }`}
//       >
//         Click to upload animal photo
//       </p>
//       <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
//     </div>
//   </section>
// </div>

//   );
// }
