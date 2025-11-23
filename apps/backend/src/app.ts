import { Elysia } from "elysia";
import { apiRoutes } from "@/infrastructure/http/routes";
import { swaggerConfig } from "@/infrastructure/http/config/swagger.config";
import { corsConfig } from "@/infrastructure/http/config/cors.config";
import { globalErrorHandler } from "@/infrastructure/http/handlers/global-error.handler";

export const app = new Elysia()
  .use(corsConfig)
  .use(swaggerConfig)
  .use(apiRoutes)
  .onError(globalErrorHandler);