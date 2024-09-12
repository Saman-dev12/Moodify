import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";

import { env } from "~/env";
import prisma from "~/utils/Prisma";


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name : string;
      email : string;
      image : string;
    } & DefaultSession["user"];
  }
}


export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn(params) {
      if (!params.user.email) {
          return false;
      }

      try {
          const existingUser = await prisma.user.findUnique({
              where: {
                  email: params.user.email
              }
          })
          if (existingUser) {
              return true
          }
          const data = await prisma.user.create({
              data: {
                name : params.user.name,
                image:params.user.image,
                oauth_id : params.account?.providerAccountId!,
                  email: params.user.email,
                  provider: params.account?.provider!,
              } 
          })
          params.user.id = data?.id.toString();
          return true;
       } catch(e) {
          console.log(e);
          return false;
       }
  },
  jwt: async ({ token, user }) => {
    if (user) {
      token.user = user;
    }
    return token;
  },
     async session({ session, token, user }){
      const dbUser = await prisma.user.findUnique({
        where: {
          email: session.user.email as string
        }
      });
      if (!dbUser) {
        return session;
      }
      return {
        ...session, 
        user: {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          image : dbUser.image
        }
      };
    }
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET
    })
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
};


export const getServerAuthSession = () => getServerSession(authOptions);
