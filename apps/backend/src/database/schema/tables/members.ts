import { relations } from 'drizzle-orm'
import { pgTable, unique, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { baseFields } from '../helpers/base-fields'
import { roleEnum } from '../helpers/enums'
import { organizations } from './organizations'
import { users } from './users'
import type { z } from 'zod'

export const members = pgTable(
  'members',
  {
    ...baseFields(),
    role: roleEnum('role').default('MEMBER').notNull(),
    organizationId: varchar('organization_id', { length: 30 })
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 30 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  table => [
    unique('member_unique_organization_and_user').on(
      table.organizationId,
      table.userId,
    ),
  ],
)

export const membersRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}))

export const insertMemberSchema = createInsertSchema(members)
export const updateMemberSchema = insertMemberSchema
  .pick({
    deletedAt: true,
    organizationId: true,
    role: true,
  })
  .partial()
export const selectMemberSchema = createSelectSchema(members)

export type InsertMember = z.infer<typeof insertMemberSchema>
export type UpdateMember = z.infer<typeof updateMemberSchema>
export type SelectMember = z.infer<typeof selectMemberSchema>
