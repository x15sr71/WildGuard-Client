// import { useLocation, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { MapPin } from "lucide-react";

// export function RescueViaImage() {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { uploadedImage, responseText } = state || {};

//   // Dummy NGOs data
//   const ngos = [
//     {
//       name: "Wildlife Rescue Foundation",
//       location: "Portland, OR",
//       description: "Specializing in forest wildlife rehabilitation",
//       contact: "+1 (503) 555-0192",
//     },
//     {
//       name: "Animal Hope Alliance",
//       location: "New York, NY",
//       description: "Urban animal rescue and rehabilitation",
//       contact: "+1 (212) 555-0156",
//     },
//     {
//       name: "Marine Life Protect",
//       location: "Miami, FL",
//       description: "Marine animal conservation and rescue",
//       contact: "+1 (305) 555-0134",
//     },
//   ];

//   // If no state is available, redirect to the homepage
//   if (!uploadedImage || !responseText) {
//     navigate("/");
//     return null;
//   }

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen p-6 bg-gray-50">
//       {/* Left Column: Image preview and AI response */}
//       <div className="flex-1 flex flex-col gap-6">
//         <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
//           <img src={uploadedImage} alt="Uploaded animal" className="w-full h-64 object-cover" />
//         </div>
//         <div className="flex-1 rounded-lg p-6 shadow-lg bg-white border border-gray-200">
//           <div className="whitespace-pre-wrap leading-relaxed text-gray-800">{responseText}</div>
//         </div>
//       </div>

//       {/* Right Column: List of nearby NGOs */}
//       <div className="md:w-96 flex flex-col gap-4">
//         <h3 className="text-xl font-bold">Nearby Organizations</h3>
//         {ngos.map((ngo, index) => (
//           <div
//             key={index}
//             className="p-6 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors"
//           >
//             <h4 className="font-semibold text-gray-900">{ngo.name}</h4>
//             <p className="text-sm flex items-center gap-1 mt-2 text-gray-600">
//               <MapPin size={14} /> {ngo.location}
//             </p>
//             <p className="mt-3 text-gray-700">{ngo.description}</p>
//             <div className="mt-4 flex items-center justify-between">
//               <span className="text-sm text-gray-600">{ngo.contact}</span>
//               <Button className="text-sm" size="sm">
//                 Contact
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
