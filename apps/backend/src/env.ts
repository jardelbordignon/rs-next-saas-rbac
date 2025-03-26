import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('7d'),
})

export const env = envSchema.parse(process.env)
