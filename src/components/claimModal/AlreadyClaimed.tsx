import React from "react";
import { Mail, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AlreadyClaimed() {
    const router=useRouter()
  const handleGoHome = () => {
   router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="bg-blue-50 p-6 rounded-full inline-flex items-center justify-center mb-6 mx-auto">
          <Mail className="h-10 w-10 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          SolLink Already Claimed
        </h1>
        <p className="text-gray-600 mb-8">
          This link has already been claimed and is no longer available.
        </p>

        <button
          onClick={handleGoHome}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 w-full"
        >
          <Home className="h-5 w-5" />
          <span>Go Home</span>
        </button>
      </div>
    </div>
  );
}
