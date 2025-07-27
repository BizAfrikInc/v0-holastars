import { defineConfig } from 'drizzle-kit';
import { config } from "@/lib/config"

export default defineConfig({
  schema: './lib/db/schema',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.server.postgresUrl ,
  },
});
