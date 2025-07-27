import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { config } from "@/lib/config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: config.server.authGoogleId,
      clientSecret: config.server.authGoogleSecret,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth", // your custom sign-in page
  },
})
