// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userId?: string;
      keypair: string;
    };
  }

  interface User {
    userId?: string; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string; 
  }
}
