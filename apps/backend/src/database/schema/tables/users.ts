import { relations } from 'drizzle-orm'
import { pgTable, unique, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { baseFields } from '../helpers/base-fields'
import { accounts } from './accounts'
import { invites } from './invites'
import { members } from './members'
import { organizations } from './organizations'
import { projects } from './projects'
import { tokens } from './tokens'
import type { z } from 'zod'

export const users = pgTable(
  'users',
  {
    ...baseFields(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }),
    avatarUrl: varchar('avatar_url', { length: 255 }),
  },
  table => [unique('users_email_unique').on(table.email)],
)

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  tokens: many(tokens),
  invites: many(invites),
  member_on: many(members),
  owns_organizations: many(organizations),
  owns_projects: many(projects),
}))

export type InsertUser = z.infer<typeof insertUserSchema>
export type SelectUser = z.infer<typeof selectUserSchema>
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

// (Example Next.js API Route using insertUserSchema) pages/api/users/create.ts

// import { NextApiRequest, NextApiResponse } from 'next'
// import { db } from '../../../src/database' // Your Drizzle database instance
// import { users, insertUserSchema } from 'src/database/schema/tables/users' // Import the schema and table

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const userData = req.body

//   const validationResult = insertUserSchema.safeParse(userData)

//   if (!validationResult.success) {
//     return res.status(400).json({ error: validationResult.error.format() })
//   }

//   const validatedData = validationResult.data

//   try {
//     const newUser = await db
//       .insert(users)
//       .values(validatedData)
//       .returning()

//     return res.status(201).json(newUser[0])
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: 'Internal Server Error' })
//   }
// }
