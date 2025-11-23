import { cors } from "@elysiajs/cors";

const getCorsOrigins = () => {
  const envOrigins = process.env.CORS_ORIGIN;
  return envOrigins ? envOrigins.split(',').map(origin => origin.trim()) : '*';
};

export const corsConfig = cors({
  origin: getCorsOrigins(),
  credentials: true
});