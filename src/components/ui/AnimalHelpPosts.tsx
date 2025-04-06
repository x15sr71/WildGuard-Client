import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Share2,
  AlertTriangle,
  Leaf,
  ChevronRight,
  Copy,
  Mail,
  Facebook,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

// Improved Lightbox Component
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
    // Add body overflow hidden when lightbox opens
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex items-center justify-center w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Lightbox image ${currentIndex + 1}`}
          className={`max-h-[85vh] max-w-[85vw] rounded-lg shadow-2xl transition-all duration-300 ease-out ${
            animate ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        />

        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2"
        >
          <X className="w-6 h-6" />
        </Button>

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full h-12 w-12 flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full h-12 w-12 flex items-center justify-center"
            >
              <ArrowRight className="w-6 h-6" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-full text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Comment component
function Comment({ 
  comment, 
  darkMode,
  onDelete,
  onReply,
  replies = [],
  depth = 0
}: { 
  comment: { 
    id: string; 
    userName: string; 
    userImage: string; 
    text: string; 
    timestamp: Date; 
  }; 
  darkMode: boolean;
  onDelete: (commentId: string) => void;
  onReply: (commentId: string) => void;
  replies?: any[];
  depth?: number;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`flex gap-3 py-2 px-1 ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={comment.userImage} alt={comment.userName} />
        <AvatarFallback className="bg-green-500 text-white">
          {comment.userName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-start">
          <div className={`p-3 rounded-xl flex-grow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <p className="font-medium text-sm">{comment.userName}</p>
            <p className="text-sm">{comment.text}</p>
          </div>
          <div className="relative ml-2 mt-1" ref={optionsRef}>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full p-1 h-6 w-6 ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
              onClick={() => setShowOptions(!showOptions)}
            >
              <svg 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className="w-4 h-4"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Button>
            
            {showOptions && (
              <div 
                className={`absolute right-0 mt-1 w-32 z-10 rounded-md shadow-lg ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                }`}
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      onReply(comment.id);
                      setShowOptions(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                      darkMode 
                        ? "hover:bg-gray-700 text-gray-300" 
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <MessageSquare className="w-3 h-3 mr-2" />
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      onDelete(comment.id);
                      setShowOptions(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                      darkMode 
                        ? "hover:bg-gray-700 text-red-400" 
                        : "hover:bg-gray-100 text-red-600"
                    }`}
                  >
                    <X className="w-3 h-3 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-1">
          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <button 
            onClick={() => onReply(comment.id)}
            className={`text-xs font-medium ${
              darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Reply
          </button>
        </div>
        
        {/* Render replies */}
        {replies.length > 0 && (
          <div className={`ml-2 mt-2 pl-4 border-l-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            {replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                darkMode={darkMode}
                onDelete={onDelete}
                onReply={onReply}
                replies={reply.replies || []}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ShareMenu component
function ShareMenu({ url, darkMode }: { url: string; darkMode: boolean }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const shareOptions = [
    { 
      icon: <Copy className="w-4 h-4 mr-2" />, 
      label: "Copy Link", 
      action: copyToClipboard,
      color: darkMode ? "text-blue-300" : "text-blue-700"
    },
    { 
      icon: <Mail className="w-4 h-4 mr-2" />, 
      label: "Email", 
      action: () => window.open(`mailto:?subject=Wildlife Alert&body=${encodeURIComponent(url)}`),
      color: darkMode ? "text-orange-300" : "text-orange-700"
    },
    { 
      icon: <Facebook className="w-4 h-4 mr-2" />, 
      label: "Facebook", 
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`),
      color: darkMode ? "text-blue-400" : "text-blue-800"
    },
    { 
      icon: <Send className="w-4 h-4 mr-2" />, 
      label: "WhatsApp", 
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(url)}`),
      color: darkMode ? "text-green-400" : "text-green-700"
    },
  ];

  return (
    <PopoverContent className={`w-56 p-0 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
      <div className="px-1 py-2">
        {shareOptions.map((option, index) => (
          <button
            key={index}
            onClick={option.action}
            className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } ${option.color}`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </PopoverContent>
  );
}

// Helper function to determine urgency color
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

// Helper function to get animal icon
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

// PostsFeed with backend fetch
export function PostsFeed({ darkMode }: { darkMode: boolean }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comments, setComments] = useState<{[postId: string]: any[]}>({});
  const [commentInputs, setCommentInputs] = useState<{[postId: string]: string}>({});
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          "https://wildgaurd-backend-642935703539.asia-south1.run.app/api/posts"
        );
        const data = await res.json();
        setPosts(data);
        
        // Initialize empty comments for each post
        const initialComments: {[postId: string]: any[]} = {};
        data.forEach((post: any) => {
          initialComments[post.id] = [];
        });
        setComments(initialComments);
        
        // Initialize empty comment inputs
        const initialInputs: {[postId: string]: string} = {};
        data.forEach((post: any) => {
          initialInputs[post.id] = "";
        });
        setCommentInputs(initialInputs);
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
  
  const handleCommentChange = (postId: string, value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };
  
  const handleCommentSubmit = (postId: string, userName: string, userImage: string) => {
    if (!commentInputs[postId]?.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      userName: userName || "Anonymous User",
      userImage: userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent("AU")}&background=4ade80&color=ffffff`,
      text: commentInputs[postId],
      timestamp: new Date()
    };
    
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));
    
    setCommentInputs(prev => ({
      ...prev,
      [postId]: ""
    }));
    
    // Scroll to the latest comment
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
                  <div className="flex items-cen  ter justify-between">
                    <h3 className="text-lg font-semibold">
                      {post.volunteer?.user?.name}
                    </h3>
                    <Badge
                      className={`${getUrgencyColor(
                        post.urgencyLevel
                      )} ml-2 rounded-half`}
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
                  <p
                    className={`mb-3 text-lg leading-relaxed font-roboto ${
                      darkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {post.description}
                  </p>
                </div>

                {/* Incident Details */}
                <div
                  className={`mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm rounded-lg p-3 mb-4 ${
                    darkMode ? "bg-gray-700/50" : "bg-gray-100/50"
                  }`}
                >
                  <div
                    className={`col-span-2 font-medium mb-1 flex items-center ${
                      darkMode ? "text-green-400" : "text-green-500"
                    }`}
                  >
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

                {/* Volunteer Info - Collapsible */}
                {post.volunteer && (
                  <details className="group mt-2 mb-4 rounded-xl border border-green-300/50 dark:border-green-600/40 bg-green-50/30 dark:bg-green-900/10 backdrop-blur-sm transition-colors overflow-hidden">
                    <summary
                      className={`flex items-center justify-between px-4 py-2 cursor-pointer font-semibold transition-colors ${
                        darkMode
                          ? "text-green-300 bg-green-800/30 hover:bg-green-700/40"
                          : "text-black bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight
                          className={`h-4 w-4 transition-transform group-open:rotate-90 ${
                            darkMode ? "text-green-300" : "text-black"
                          }`}
                        />
                        Volunteer Contact Information
                      </div>
                    </summary>

                    <div
                      className={`p-4 text-sm grid grid-cols-2 gap-x-4 gap-y-2 rounded-b-xl ${
                        darkMode
                          ? "text-gray-300 bg-black/20"
                          : "text-gray-700 bg-white/40"
                      }`}
                    >
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {post.volunteer.user?.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {post.volunteer.user?.email || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {post.volunteer.phone || "N/A"}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Location:</span>{" "}
                        {post.volunteer.location?.value}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Skills:</span>{" "}
                        {post.volunteer.skills?.join(", ") || "None listed"}
                      </div>
                    </div>
                  </details>
                )}

                {/* Images with enhanced hover effects */}
                {post.images?.length > 0 && (
                  <div
                    className={`mt-4 grid gap-2 ${
                      post.images.length === 1
                        ? "grid-cols-1"
                        : post.images.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                    }`}
                  >
                    {post.images.map((imgUrl: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative group overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => openLightbox(post.images, idx)}
                      >
                        <img
                          src={imgUrl}
                          alt={`Post image ${idx + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-black bg-opacity-60 text-white font-medium px-4 py-2 rounded-full flex items-center">
                            <div className="flex items-center">
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              <span>View</span>
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Comments Section */}
                {comments[post.id]?.length > 0 && (
                  <div className={`mt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <h4 className={`font-medium mt-3 mb-2 flex items-center ${
                      darkMode ? "text-gray-300" : "text-gray-800"
                    }`}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Comments ({comments[post.id].length})
                    </h4>
                    <div className="max-h-60 overflow-y-auto pr-2">
                      {comments[post.id].map((comment) => (
                        <Comment key={comment.id} comment={comment} darkMode={darkMode} />
                      ))}
                      <div ref={commentsEndRef} />
                    </div>
                  </div>
                )}
              </CardContent>

                <CardFooter className="flex flex-col gap-3 pt-0">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 w-full">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Leaf className="w-4 h-4 mr-1" /> I Can Help
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`border-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-950 ${
                        darkMode ? "text-blue-300" : "text-blue-700"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" /> Need Info
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <Share2 className="w-4 h-4 mr-1" /> Share
                        </Button>
                      </PopoverTrigger>
                      <ShareMenu 
                        url={`https://wildguard.org/post/${post.id}`} 
                        darkMode={darkMode} 
                      />
                    </Popover>
                  </div>

                  {/* Comment Input */}
                  <div className="mt-1 flex items-center gap-2 w-full">
                    <Input
                      placeholder="Leave a message or volunteer note..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleCommentSubmit(
                            post.id, 
                            `${post.volunteer?.user?.name }`, 
                            `https://ui-avatars.com/api/?name=${encodeURIComponent("CU")}&background=4ade80&color=ffffff`
                          );
                        }
                      }}
                      className={`w-full rounded-full border px-4 py-2 text-sm placeholder-gray-500 focus:border-green-500 focus:ring-green-500 ${
                        darkMode
                          ? "border-gray-600 bg-gray-700 text-white placeholder-gray-300"
                          : ""
                      }`}
                    />

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleCommentSubmit(
                        post.id, 
                        `${post.volunteer?.user?.name }`, 
                        `https://ui-avatars.com/api/?name=${encodeURIComponent("CU")}&background=4ade80&color=ffffff`
                      )}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4"
                    >
                      Send
                    </Button>
                  </div>
                </CardFooter>
            </Card>
          ))}
        </div>
      </div>
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