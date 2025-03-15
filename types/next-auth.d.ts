import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      /** The user's unique identifier */
      id: string;
      /** The user's access token */
      accessToken?: string;
    } & DefaultSession["user"];
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    /** The user's unique identifier */
    id: string;
  }
}

declare module "next-auth/jwt" {
  /** Extend the built-in JWT types */
  interface JWT {
    /** The user's unique identifier */
    userId?: string;
    /** The user's access token */
    accessToken?: string;
  }
}
