import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session }: { session: any }) {
      return session;
    },
    async signIn(params: any) {
      // const { user, account } = params;
      return true;
      try {
        const res = await fetch(process.env.RAILS_API_URL + "/api/v1/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            provider: account?.provider,
            uid: account?.providerAccountId,
          }),
        });
        if (!res.ok) {
          console.error("Rails API user保存失敗", await res.text());
          return false;
        }
        return true;
      } catch (e) {
        console.error("Rails API連携エラー", e);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
