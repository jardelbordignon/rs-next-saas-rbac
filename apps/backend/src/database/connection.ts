import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env'

const connection = postgres(env.DATABASE_URL)

export const database = drizzle(connection)
