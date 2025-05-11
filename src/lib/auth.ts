import { PrismaClient } from "@/generated/prisma";
import { Keypair } from "@solana/web3.js";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import bs58 from 'bs58'
const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_ID_SECRET || "",
    }),
  ],


  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user,account }) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            userId: account?.providerAccountId || "",
          },
        });

        if (!existingUser) {
          const keypair = Keypair.generate();
          const createdUser = await prisma.user.create({
            data: {
              name: user.name || "",
              email: user.email || "",
              userId: account?.providerAccountId || "",
              image: user.image,
              keypair: JSON.stringify(bs58.encode(keypair.secretKey)),
            },
          });
          (user as any).keypair = createdUser.keypair;
        } else {
          (user as any).keypair = existingUser.keypair;
        }

        return true;
      } catch (error) {
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.keypair = (user as any).keypair;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.userId = token.userId as string;
      session.user.keypair = token.keypair as string;
      return session;
    },
  },
});
