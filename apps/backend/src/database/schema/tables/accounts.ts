import { relations } from 'drizzle-orm'
import { pgTable, unique, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { baseFields } from '../helpers/base-fields'
import { accountProviderEnum } from '../helpers/enums'
import { users } from './users'
import type { z } from 'zod'

export const accounts = pgTable(
  'accounts',
  {
    ...baseFields(),
    provider: accountProviderEnum('provider').notNull(),
    providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
    userId: varchar('user_id', { length: 30 }).references(() => users.id, {
      onDelete: 'cascade',
    }),
  },
  table => [unique('account_unique_provider_account_id').on(table.providerAccountId)],
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export type InsertAccount = z.infer<typeof insertAccountSchema>
export const insertAccountSchema = createInsertSchema(accounts)
export const selectAccountSchema = createSelectSchema(accounts)
