import type {inferRouterInputs, inferRouterOutputs} from "@trpc/server";
import type {AppRouter} from "~/server/trpc/router/_app";

export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;
