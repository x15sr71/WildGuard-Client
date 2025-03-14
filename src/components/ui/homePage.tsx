import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { UploadCloud, Search, MapPin, PawPrint } from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [animalImages] = useState([
    // Baby elephant being rescued
    'https://images.prismic.io/conservation/296c12ea-d827-4bda-bc0a-e82beb4576e2_Moholoholo+Rehab+Female+Student+feeding+antelope.jpeg?auto=compress,format&rect=0,237,1512,1008&w=1200&h=800',
    // Star tortoise close-up
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh75TMAAVGw33vRMnvIkTFZvMxrhLA2SBBuu3YSR_xLsg8WkO8kN0UYzbJ8rDUo5cuNFHmL8sTgofuzWagdMhjt9PpeBuJC0oQvNBzXT6XvIc_JG734bmY2Q217WqQh8NgZiduk-XD4oxA/s1600/2016_11_02+Emma+rabbit+massage-6.jpg',
    
    // Koala in care
    'https://cdn.sanity.io/images/fa9ovwqs/production/96c657abedc8ecc492614904206fe59d46e1b72f-2542x2487.jpg?w=800&h=783&fit=crop',
    'https://dialogue.earth/content/uploads/2020/05/little_elephant.jpg', 
    
    // Red panda needing help
    'https://i.ytimg.com/vi/K5oVaGJ6DT0/maxresdefault.jpg',
    
    // Squirrel being rehabilitated
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Feeding_a_baby_squirrel.jpg/640px-Feeding_a_baby_squirrel.jpg'
    
    // deer 
    
  ]);

  const handleCameraClick = () => fileInputRef.current?.click();
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => console.log("Selected file:", e.target.files?.[0]);

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
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
      <header className="fixed top-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#3D8361] flex items-center justify-center">
            <PawPrint className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">Wild<span className="text-[#3D8361]">Guard</span></h1>
        </div>
        <div className="flex items-center gap-2 w-full max-w-lg">
          <Input placeholder="Search NGOs or locations..." className="border-2 border-green-500 rounded-full px-4" />
          <Search className="text-green-500" />
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-600 text-white rounded-full px-4" onClick={() => navigate("/volunteer-login")}>Volunteer Login</Button>
          <Button className="bg-green-600 text-white rounded-full px-4">NGO Login</Button>
        </div>
      </header>

      <Carousel className="w-full mt-20" setApi={(api) => (carouselApiRef.current = api)}>
        <CarouselContent>
          {animalImages.map((image, index) => (
            <CarouselItem key={index} className="relative h-[60vh]">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h1 className="text-4xl font-bold text-white">Animal Rescue Initiative</h1>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <section className="w-full text-center py-12 bg-gray-100">
        <h2 className="text-2xl font-bold">AI-Powered Animal Rescue</h2>
        <p className="text-gray-600">Upload an animal photo for specialized help</p>
        <div className="border-2 border-dashed border-green-600 p-6 rounded-md mt-4 max-w-md mx-auto cursor-pointer hover:bg-gray-200"
          onClick={handleCameraClick}>
          <UploadCloud size={40} className="text-green-600" />
          <p className="mt-2 text-gray-700">Click to upload animal photo</p>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 w-full max-w-6xl">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="p-6 shadow-md hover:shadow-lg">
            <CardHeader>
              <CardTitle>Wildlife Rescue Foundation</CardTitle>
              <CardDescription className="flex items-center gap-1 text-gray-600">
                <MapPin size={16} /> Portland, OR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Specializing in forest wildlife rehabilitation</p>
              <div className="h-32 bg-gray-200 rounded-md my-3"></div>
              <div className="flex gap-2">
                <Button className="bg-green-600 text-white px-4">Contact</Button>
                <Button variant="outline" className="text-green-600 px-4">Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <footer className="bg-gray-800 text-white text-center p-4 w-full mt-8">
        <p>&copy; 2025 WildGuard. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

