import { router } from "../trpc";
import { likeRouter } from "./like";
import { postRouter } from "./post";

export const appRouter = router({
    posts: postRouter,
    likes: likeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
