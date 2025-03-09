"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

export default function ClearSessionPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Clearing session data...");
  const [isClearing, setIsClearing] = useState(true);

  useEffect(() => {
    const clearAllData = async () => {
      try {
        // Clear localStorage and sessionStorage
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();

          // Clear all cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
          });

          // Try to clear next-auth session cookie specifically
          document.cookie = `next-auth.session-token=;expires=${new Date().toUTCString()};path=/`;
          document.cookie = `__Secure-next-auth.session-token=;expires=${new Date().toUTCString()};path=/`;
          document.cookie = `__Host-next-auth.csrf-token=;expires=${new Date().toUTCString()};path=/`;

          // Make a request to the signout endpoint
          await fetch("/api/auth/signout", { method: "GET" });

          setMessage("Session data cleared successfully!");
        }
      } catch (error) {
        console.error("Error clearing session:", error);
        setMessage("Error clearing session data. Please try again.");
      } finally {
        setIsClearing(false);
      }
    };

    clearAllData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        {isClearing ? (
          <>
            <Loader2Icon className="h-10 w-10 text-indigo-600 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {message}
            </h2>
            <p className="text-gray-600">
              Please wait while we clear your session data...
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {message}
            </h2>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Login
              </button>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Homepage
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
