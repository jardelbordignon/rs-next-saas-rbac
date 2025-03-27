import { relations } from 'drizzle-orm'
import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { baseFields } from '../helpers/base-fields'
import { tokenTypeEnum } from '../helpers/enums'
import { users } from './users'
import type { z } from 'zod'

export const tokens = pgTable('tokens', {
  ...baseFields(),
  type: tokenTypeEnum('type').notNull(),
  userId: varchar('user_id', { length: 30 })
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
})

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}))

export type InsertToken = z.infer<typeof insertTokenSchema>
export type SelectToken = z.infer<typeof selectTokenSchema>
export const insertTokenSchema = createInsertSchema(tokens)
export const selectTokenSchema = createSelectSchema(tokens)
