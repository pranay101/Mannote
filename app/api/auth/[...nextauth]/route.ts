import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

// Create the handler using the authOptions
const handler = NextAuth(authOptions);

// Only export route handlers from route files
export { handler as GET, handler as POST };
