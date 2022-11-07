import { commentRouter } from "./comment";
import { router } from "../trpc";
import { likeRouter } from "./like";
import { postRouter } from "./post";

export const appRouter = router({
    posts: postRouter,
    likes: likeRouter,
    comments: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
