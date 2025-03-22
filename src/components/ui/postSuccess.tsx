import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface PostSuccessProps {
  show: boolean;
  onClose: () => void;
}

const PostSuccess: React.FC<PostSuccessProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center max-w-sm">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h2 className="text-xl font-bold mt-4">Post Successful!</h2>
        <p className="text-gray-600 mt-2 text-center">
          Your request has been submitted successfully. We will take action soon.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          onClick={onClose}
        >
          Okay
        </button>
      </div>
    </motion.div>
  );
};

export default PostSuccess;
