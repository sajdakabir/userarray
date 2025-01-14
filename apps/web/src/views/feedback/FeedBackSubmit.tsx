import React from "react";

const FeedBackSubmit: React.FC = () => {
  return (
    <div className="bg-zinc-700 text-white p-4 rounded-lg w-full shadow-lg">
      <div className="flex items-center mb-4">
        <span className="text-yellow-400 mr-2">
          {/* Lightbulb icon (Tabler Icons or similar) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M6.8 11.1a6 6 0 0 1 10.4 0" />
            <path d="M12 2a7 7 0 0 1 7 7c0 3.9-4 6.9-5 8" />
          </svg>
        </span>
        <span className="text-lg font-medium">Got an idea?</span>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full font-semibold">
        Submit a Post
      </button>
    </div>
  );
};

export default FeedBackSubmit;
