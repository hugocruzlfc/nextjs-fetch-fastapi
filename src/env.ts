import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    //BACKEND_URL: z.string().url(),
  },
  client: {
    //NEXT_PUBLIC_URL: z.string().min(1),
    NEXT_PUBLIC_BACKEND_URL: z.string().min(1),
  },

  runtimeEnv: {
    // BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    // NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
});
