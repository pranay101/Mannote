import { ReactNode } from "react";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // This will redirect to /login if the user is not authenticated
  await requireAuth();

  // If we get here, the user is authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add a hidden meta tag with a timestamp to prevent caching issues */}
      <meta name="auth-check" content={`${Date.now()}`} hidden />
      {children}
    </div>
  );
}
