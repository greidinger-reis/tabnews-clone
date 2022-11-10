import {NextApiRequest, NextApiResponse} from "next";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";
import {createContextInner} from "~/server/trpc/context";
import {appRouter} from "~/server/trpc/router/_app";

export default async function handleEmailConfirmation(req:NextApiRequest,res:NextApiResponse){
    const {userid} = req.query;
    const ssg = await createProxySSGHelpers({
        ctx: await createContextInner({session: null}),
        router: appRouter,
    })

    const post =  await ssg.posts.find.fetch({username: "admin", slug:"post-test"})

    return res.status(200).json({post, userid});

}