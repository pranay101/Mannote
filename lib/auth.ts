import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { cache } from "react";

// Use React's cache to prevent multiple identical requests
export const getSession = cache(async () => {
  return await getServerSession(authOptions);
});

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return {
    ...session.user,
    id: session.user.id || "",
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    // Redirect directly to login page
    redirect("/login");
  }

  return user;
}

// Function to check if user is authenticated (for client components)
export function useRequireAuth() {
  return { requireAuth };
}
