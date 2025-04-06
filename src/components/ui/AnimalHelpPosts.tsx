import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Leaf,
  ChevronRight,
} from "lucide-react";

// Lightbox Component
function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="relative">
        <img
          src={images[currentIndex]}
          alt={`Lightbox image ${currentIndex + 1}`}
          className={`max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg transition-transform duration-300 ease-out ${
            animate ? "scale-100" : "scale-90"
          }`}
        />
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-2 right-2 text-white"
        >
          <X className="w-6 h-6" />
        </Button>
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              onClick={onPrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              onClick={onNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-white"
            >
              <ArrowRight className="w-6 h-6" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// Urgency badge color
const getUrgencyColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "critical":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  }
};

// Animal emoji
const getAnimalEmoji = (type: string) => {
  const animalType = type?.toLowerCase() || "";
  if (animalType.includes("bird")) return "🦜";
  if (animalType.includes("dog")) return "🐕";
  if (animalType.includes("cat")) return "🐈";
  if (animalType.includes("reptile")) return "🦎";
  if (animalType.includes("fish")) return "🐠";
  if (animalType.includes("amphibian")) return "🐸";
  if (animalType.includes("mammal")) return "🦊";
  return "🐾";
};

// Main feed component
export function PostsFeed({ darkMode }: { darkMode: boolean }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          "https://wildgaurd-backend-642935703539.asia-south1.run.app/api/posts"
        );
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? lightboxImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === lightboxImages.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse flex justify-center">
          <Leaf className="h-8 w-8 text-green-500 mr-2" />
          <span className="text-lg">Loading wildlife reports...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
      <div
        className={`w-full p-4 h-[calc(100vh-80px)] overflow-y-auto bg-gradient-to-b from-green-50 to-blue-50 ${
          darkMode ? "dark:from-gray-900 dark:to-gray-950" : ""
        }`}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={`shadow-md rounded-xl overflow-hidden border-l-4 ${
                darkMode
                  ? "bg-gray-800 text-white border-green-600"
                  : "bg-white text-gray-900 border-green-500"
              } hover:shadow-lg transition-shadow duration-200`}
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Avatar className="h-12 w-12 border-2 border-green-400">
                  <AvatarImage
                    src={
                      post.volunteer?.user?.imageUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        post.volunteer?.user?.name || "User"
                      )}&background=4ade80&color=ffffff`
                    }
                    alt={post.volunteer?.user?.name || "User"}
                  />
                  <AvatarFallback className="bg-green-500 text-white">
                    {(post.volunteer?.user?.name || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {post.volunteer?.user?.name}
                    </h3>
                    <Badge
                      className={`${getUrgencyColor(post.urgencyLevel)} ml-2 rounded-half`}
                      variant="outline"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {post.urgencyLevel || "Unknown"} Urgency
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Title and Description */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">
                      {getAnimalEmoji(post.animalType)}
                    </span>
                    <h4 className="text-lg font-medium">
                      {post.animalType || "Wildlife"}{" "}
                      {post.incidentLocation
                        ? `at ${post.incidentLocation}`
                        : ""}
                    </h4>
                  </div>
                  <p className="mb-3 text-gray-500 dark:text-gray-300">
                    {post.description}
                  </p>
                </div>

                {/* Incident Details */}
                <div
                  className={`mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm rounded-lg p-3 mb-4 ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                  }`}
                >
                  <div className="col-span-2 font-medium text-green-700 dark:text-green-400 mb-1 flex items-center">
                    <Leaf className="w-4 h-4 mr-1" />
                    Incident Details
                  </div>

                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Location:
                    </span>{" "}
                    {post.incidentLocation}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Coordinates:
                    </span>{" "}
                    {post.geoLocation}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Noticed:
                    </span>{" "}
                    {new Date(post.noticedAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Current Actions:
                    </span>{" "}
                    {post.currentActions || "None taken yet"}
                  </div>
                </div>

                {/* Volunteer Info */}
                {post.volunteer && (
                  <details className="group mt-2 mb-4 rounded-xl border border-green-300/50 dark:border-green-600/40 overflow-hidden">
                    <summary className="flex items-center justify-between px-4 py-2 cursor-pointer font-semibold text-green-800 dark:text-green-300 bg-green-100/60 dark:bg-green-800/30 hover:bg-green-200/70 dark:hover:bg-green-700/40">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                        Volunteer Contact Information
                      </div>
                    </summary>
                    <div
                      className={`p-4 text-sm grid grid-cols-2 gap-x-4 gap-y-2 rounded-b-xl transition-colors duration-200 ${
                        darkMode
                          ? "text-gray-300 bg-green-900/10"
                          : "text-gray-700 bg-green-100/30"
                      }`}
                    >
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {post.volunteer.user?.name}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {post.volunteer.phone || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {post.volunteer.user?.email || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Experience:</span>{" "}
                        {post.volunteer.experience || "Not provided"}
                      </div>
                    </div>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
