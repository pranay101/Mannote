import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-16 w-16 text-indigo-500 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  );
}
