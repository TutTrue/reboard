import type { NextAuthOptions, User } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      profile(profile) {
        return {
          ...profile,
          id: profile.node_id,
          image: profile.avatar_url,
        }
      },
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      token.rawJwt = token.accessToken

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        user: { ...session.user, id: token.id },
      }
    },
    async signIn({ user }) {
      const newUser = user as User & { login: string }
      const response = await fetch(process.env.SERVER_API_URL + '/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newUser.id,
          fullName: newUser.name,
          username: newUser.login,
          email: newUser.email,
          profilePictureURL: newUser.image,
        }),
      })
      return true
    },
  },
}
