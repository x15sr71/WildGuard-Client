import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

// Lightbox Component with ESC and outside click to close
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

  // Trigger the scale-up animation when the lightbox mounts
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Handle keydown for Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image container
      >
        <img
          src={images[currentIndex]}
          alt={`Lightbox image ${currentIndex + 1}`}
          className={`max-h-[80vh] max-w-[90vw] rounded transition-transform duration-300 ease-out ${
            animate ? "scale-100" : "scale-90"
          }`}
        />
        {/* Close Button */}
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-2 right-2 text-white"
        >
          <X className="w-6 h-6" />
        </Button>
        {/* Left Arrow */}
        {images.length > 1 && (
          <Button
            variant="ghost"
            onClick={onPrev}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        )}
        {/* Right Arrow */}
        {images.length > 1 && (
          <Button
            variant="ghost"
            onClick={onNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}

// PostsFeed Component with volunteer community actions and improved input field styling
export function PostsFeed({ darkMode }: { darkMode: boolean }) {
  // Dummy posts data with images option
  const posts = [
    {
      id: 1,
      user: "Alice Johnson",
      time: "1h",
      content:
        "Just went to the park and it was amazing! Need extra hands to clean up the area.",
      images: ["https://picsum.photos/seed/1/500/300"],
    },
    {
      id: 2,
      user: "Bob Smith",
      time: "2h",
      content:
        "Community garden is in full bloom. Looking for volunteers to help maintain the space.",
      images: [
        "https://picsum.photos/seed/2/500/300",
        "https://picsum.photos/seed/3/500/300",
      ],
    },
    {
      id: 3,
      user: "Charlie Davis",
      time: "3h",
      content:
        "Anyone up for a group volunteer event this weekend? We need to set up for a local charity event.",
    },
    {
      id: 4,
      user: "Diana Prince",
      time: "4h",
      content:
        "Had an awesome morning volunteering at the local shelter. We could use more help with daily tasks.",
      images: [
        "https://picsum.photos/seed/4/500/300",
        "https://picsum.photos/seed/5/500/300",
        "https://picsum.photos/seed/6/500/300",
      ],
    },
    {
      id: 5,
      user: "Edward Norton",
      time: "5h",
      content:
        "Great discussion with inspiring people today! Volunteers needed for an upcoming project.",
      images: ["https://picsum.photos/seed/7/500/300"],
    },
    {
      id: 6,
      user: "Fiona Gallagher",
      time: "6h",
      content:
        "Excited for the community picnic. Volunteers and resources are welcome!",
      images: [
        "https://picsum.photos/seed/8/500/300",
        "https://picsum.photos/seed/9/500/300",
        "https://picsum.photos/seed/10/500/300",
        "https://picsum.photos/seed/11/500/300",
      ],
    },
    {
      id: 7,
      user: "George Martin",
      time: "7h",
      content:
        "Learning so much about sustainability at today’s workshop. Let's put our ideas into action together.",
    },
    {
      id: 8,
      user: "Hannah Lee",
      time: "8h",
      content:
        "Just discovered a hidden gem of a cafe that supports local charities! Looking for volunteers for their upcoming fundraiser.",
      images: [
        "https://picsum.photos/seed/12/500/300",
        "https://picsum.photos/seed/13/500/300",
      ],
    },
  ];

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handler to open lightbox with images and starting index
  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  // Handler to go to previous image
  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? lightboxImages.length - 1 : prev - 1
    );
  };

  // Handler to go to next image
  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === lightboxImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* Full-width scroll area */}
      <div className="w-full p-4 h-[calc(100vh-80px)] overflow-y-auto">
        {/* Center posts cards in a max-width container */}
        <div className="max-w-2xl mx-auto space-y-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={`shadow w-full ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <CardHeader className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      post.user
                    )}`}
                    alt={post.user}
                  />
                  <AvatarFallback>{post.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{post.user}</h3>
                  <p className="text-sm text-gray-400">{post.time}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
                {post.images && (
                  <div
                    className={`mt-2 grid gap-2 ${
                      post.images.length === 1
                        ? "grid-cols-1"
                        : post.images.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                    }`}
                  >
                    {post.images.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt={`Post image ${idx + 1}`}
                        className="w-full h-auto rounded cursor-pointer"
                        onClick={() => openLightbox(post.images!, idx)}
                      />
                    ))}
                  </div>
                )}
                {/* Custom Volunteer Community Actions */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    I Can Help
                  </Button>
                  <Button variant="outline" size="sm">
                    Need More Info?
                  </Button>
                  <Button variant="outline" size="sm">
                    Share Opportunity
                  </Button>
                </div>
                {/* Input Field for additional messages */}
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    placeholder="Leave a message or volunteer note..."
                    className="w-full rounded border px-3 py-2 text-sm placeholder-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300"
                  />
                  <Button variant="default" size="sm">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Render Lightbox if open */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  );
}
