import { relations } from 'drizzle-orm'
import { index } from 'drizzle-orm/pg-core'
import { pgTable, unique, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { baseFields } from '../helpers/base-fields'
import { roleEnum } from '../helpers/enums'
import { organizations } from './organizations'
import { users } from './users'
import type { z } from 'zod'

export const invites = pgTable(
  'invites',
  {
    ...baseFields(),
    email: varchar('email', { length: 255 }).notNull(),
    role: roleEnum('role').default('MEMBER').notNull(),
    authorId: varchar('author_id', { length: 30 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    organizationId: varchar('organization_id', { length: 30 }).references(
      () => organizations.id,
      {
        onDelete: 'cascade',
      },
    ),
  },
  table => [
    unique('invite_unique_email_and_organization_id').on(
      table.email,
      table.organizationId,
    ),
    index('invite_index_email').on(table.email),
  ],
)

export const invitesRelations = relations(invites, ({ one }) => ({
  author: one(users, {
    fields: [invites.authorId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [invites.organizationId],
    references: [organizations.id],
  }),
}))

export type InsertInvite = z.infer<typeof insertInviteSchema>
export const insertInviteSchema = createInsertSchema(invites)
export const selectInviteSchema = createSelectSchema(invites)
