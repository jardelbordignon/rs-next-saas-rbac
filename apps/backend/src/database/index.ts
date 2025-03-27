import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '@/env'
export * from 'drizzle-orm'

const client = new Pool({
  connectionString: env.DATABASE_URL,
  max: 1,
})

export const database = drizzle({ client, logger: env.NODE_ENV === 'development' })
