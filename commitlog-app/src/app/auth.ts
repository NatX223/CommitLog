import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET!,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: { scope: 'repo read:user user:email' }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "github") {
                try {
                    const backendURL = process.env.BACKEND_URL!;
                    const response = await fetch(`${backendURL}/api/auth/signin`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            accessToken: account.access_token,
                            avatarUrl: user.image
                        })
                    });
                    
                    if (!response.ok) {
                        console.error('Failed to call signin endpoint');
                    }
                } catch (error) {
                    console.error('Error calling signin endpoint:', error);
                }
            }
            
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Passes the internal user ID to the frontend session
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
}