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
      if (user) {
        token.id = user.id
        token.username = user.login
      }
      token.rawJwt = token.accessToken

      return token
    },
    async session({ session, token }) {

      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          id: token.id,
          name: (token.name || token.username) as string,
          username: token.username,
          email: token.email,
          profilePictureURL: token.picture,
        },
      }
    },
    async signIn({ user }) {
      await fetch(process.env.SERVER_API_URL + '/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          fullName: user.name || user.login,
          username: user.login,
          email: user.email,
          profilePictureURL: user.image,
        }),
      })
      return true
    },
  },
}
