import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { UploadCloud, Search, MapPin, PawPrint, Sun, Moon } from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [animalImages] = useState([
    'https://images.prismic.io/conservation/296c12ea-d827-4bda-bc0a-e82beb4576e2_Moholoholo+Rehab+Female+Student+feeding+antelope.jpeg?auto=compress,format&rect=0,237,1512,1008&w=1200&h=800',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh75TMAAVGw33vRMnvIkTFZvMxrhLA2SBBuu3YSR_xLsg8WkO8kN0UYzbJ8rDUo5cuNFHmL8sTgofuzWagdMhjt9PpeBuJC0oQvNBzXT6XvIc_JG734bmY2Q217WqQh8NgZiduk-XD4oxA/s1600/2016_11_02+Emma+rabbit+massage-6.jpg',
    'https://cdn.sanity.io/images/fa9ovwqs/production/96c657abedc8ecc492614904206fe59d46e1b72f-2542x2487.jpg?w=800&h=783&fit=crop',
    'https://dialogue.earth/content/uploads/2020/05/little_elephant.jpg',
    'https://i.ytimg.com/vi/K5oVaGJ6DT0/maxresdefault.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Feeding_a_baby_squirrel.jpg/640px-Feeding_a_baby_squirrel.jpg'
  ]);

  const handleCameraClick = () => fileInputRef.current?.click();
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    console.log("Selected file:", e.target.files?.[0]);

  const carouselApiRef = useRef<CarouselApi | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselApiRef.current) {
        const nextIndex = (carouselApiRef.current.selectedScrollSnap() + 1) % animalImages.length;
        carouselApiRef.current.scrollTo(nextIndex);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [animalImages.length]);

  return (
    <div className={`flex flex-col items-center w-full min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header className={`fixed top-0 w-full ${darkMode ? "bg-gray-900 bg-opacity-80 backdrop-blur-md" : "bg-white shadow-md"} p-4 flex flex-wrap md:flex-nowrap justify-between items-center z-50`}>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#3D8361] flex items-center justify-center">
            <PawPrint className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">
            Wild<span className="text-[#3D8361]">Guard</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 w-full md:max-w-lg mt-2 md:mt-0">
          <Input
            placeholder="Search NGOs or locations..."
            className={darkMode 
              ? "w-full bg-gray-700 border-2 border-green-500 text-white placeholder-gray-400 rounded-full px-4 py-2" 
              : "w-full border-2 border-green-500 rounded-full px-4 py-2"}
          />
          <Search className="text-green-500" />
        </div>
        <div className="flex gap-2 items-center mt-2 md:mt-0">
          <Button 
            className="bg-green-600 text-white rounded-full px-4 hover:scale-105 active:scale-95 transition" 
            onClick={() => navigate("/volunteer-login")}
          >
            Volunteer Login
          </Button>
          <Button className="bg-green-600 text-white rounded-full px-4 hover:scale-105 active:scale-95 transition">
            NGO Login
          </Button>
          <Button 
            onClick={() => setDarkMode(!darkMode)} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-800" />}
          </Button>
        </div>
      </header>

      {/* Carousel */}
      <Carousel className="w-full mt-20" setApi={(api) => (carouselApiRef.current = api)}>
        <CarouselContent>
          {animalImages.map((image, index) => (
            <CarouselItem key={index} className="relative h-[40vh] sm:h-[50vh] md:h-[60vh]">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
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

      {/* AI-Powered Rescue Section */}
      <section className={`w-full text-center py-12 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <h2 className="text-3xl font-bold mb-2">AI-Powered Animal Rescue</h2>
        <p className={darkMode ? "text-gray-300 mb-6" : "text-gray-600 mb-6"}>
          Upload an animal photo for specialized help
        </p>
        <div
          className={`border-2 border-dashed border-green-600 p-6 rounded-md max-w-md mx-auto cursor-pointer transition-colors active:scale-95 ${darkMode
              ? "hover:bg-gray-700 hover:border-green-500"
              : "hover:bg-green-100 hover:border-green-700 hover:text-green-700"
            }`}
          onClick={handleCameraClick}
        >
          <UploadCloud size={40} className={`mx-auto ${darkMode ? "text-green-400" : "text-green-600"} transition-colors`} />
          <p className={`mt-2 ${darkMode ? "text-gray-200" : "text-gray-700"} transition-colors ${!darkMode && "hover:text-green-700"}`}>
            Click to upload animal photo
          </p>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`w-full py-12 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className={`flex flex-col items-center p-6 rounded-lg shadow-lg transition active:scale-95 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <UploadCloud size={32} className="text-green-500" />
            <h3 className="text-xl font-semibold mt-4">Upload Photo</h3>
            <p className="text-center mt-2">Capture and upload an image of the animal in need.</p>
          </div>
          <div className={`flex flex-col items-center p-6 rounded-lg shadow-lg transition active:scale-95 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <Search size={32} className="text-green-500" />
            <h3 className="text-xl font-semibold mt-4">Analyze</h3>
            <p className="text-center mt-2">Our AI analyzes the image to identify issues and needs.</p>
          </div>
          <div className={`flex flex-col items-center p-6 rounded-lg shadow-lg transition active:scale-95 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <PawPrint size={32} className="text-green-500" />
            <h3 className="text-xl font-semibold mt-4">Rescue</h3>
            <p className="text-center mt-2">Connect with rescue teams and receive specialized help.</p>
          </div>
        </div>
      </section>

      {/* NGO Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 w-full max-w-6xl">
        {[1, 2, 3].map((item) => (
          <Card key={item} className={`p-6 shadow-md hover:shadow-lg transition active:scale-95 ${darkMode ? "bg-gray-700 border border-gray-600" : "bg-white"}`}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : ""}>Wildlife Rescue Foundation</CardTitle>
              <CardDescription className={`flex items-center gap-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                <MapPin size={16} /> Portland, OR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                Specializing in forest wildlife rehabilitation
              </p>
              <div className={`h-32 ${darkMode ? "bg-gray-600" : "bg-gray-200"} rounded-md my-3`}></div>
              <div className="flex gap-2">
                <Button className="bg-green-600 text-white px-4 hover:scale-105 active:scale-95 transition">
                  Contact
                </Button>
                <Button variant="outline" className="text-green-600 border-green-600 px-4 hover:scale-105 active:scale-95 transition">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Footer */}
      <footer className={`text-center p-6 w-full mt-8 ${darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-800 text-white"}`}>
        <p>&copy; 2025 WildGuard. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
