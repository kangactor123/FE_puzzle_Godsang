import NextAuth, { Awaitable, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID as string,
      clientSecret: process.env.NAVER_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      return {
        user: {
          accessToken: token?.accessToken,
          nickname: session?.user?.name,
        },
      } as unknown as Awaitable<Session>;
    },
    async jwt({ token, user, account }) {
      const res = await fetch(`https://dearmy2023.click/api/user/login`, {
        method: 'post',
        body: JSON.stringify({
          id: account?.provider,
          providerId: account?.providerAccountId,
          nickname: user?.name?.slice(0, 7),
          email: user?.email,
        }),
      })
        .then((response) => response.json())
        .catch((err) => console.log('err', err));
      return { ...token, accessToken: res };
    },
  },
});