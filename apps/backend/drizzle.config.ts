import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

export default defineConfig({
  out: './src/database/migrations',
  schema: './src/database/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
