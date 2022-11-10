import {appRouter} from "~/server/trpc/router/_app";
import {createContextInner} from "./../../../server/trpc/context";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import NextAuth, {type NextAuthOptions} from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import {PrismaAdapter} from "@next-auth/prisma-adapter";

import {prisma} from "../../../server/db/client";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },

    // Include user.id on session
    callbacks: {
        async jwt({token}) {
            if (!token.email) return token;

            const user = await prisma.user.findUnique({
                where: {email: token.email},
            });

            if (user) {
                // console.log({
                //     status: "trying to add user.id to token",
                //     token,
                //     user,
                // });
                token.id = user.id;
            }

            // console.log({
            //     status: "returning token",
            //     token,
            //     user,
            // });

            return token;
        },
        async session({session}) {
            if (!session.user?.email) return session;

            const user = await prisma.user.findUnique({
                where: {
                    email: session.user.email,
                },
            });

            if (session.user && user) {
                // console.log({
                //     status: "trying to add user.id to session.user",
                //     session,
                //     user,
                // });
                session.user.id = user.id;
                session.user.name = user.username;
            }

            // console.log({
            //     status: "returning session",
            //     session,
            //     user,
            // });

            return session;
        },

        redirect({baseUrl}) {
            return baseUrl;
        },
    },
    // Configure one or more authentication providers
    adapter: PrismaAdapter(prisma),

    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {
                    label: "email",
                    type: "email",
                    placeholder: "Email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const ssg = await createProxySSGHelpers({
                    ctx: await createContextInner({session: null}),
                    router: appRouter,
                });

                const user = await ssg.auth.checkCredentials.fetch({
                    email: credentials.email,
                    password: credentials.password,
                });

                return user;
            },
        }),
    ],
};

export default NextAuth(authOptions);
