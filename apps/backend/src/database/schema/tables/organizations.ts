import { relations } from 'drizzle-orm'
import { boolean, pgTable, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { baseFields } from '../helpers/base-fields'
import { invites } from './invites'
import { members } from './members'
import { projects } from './projects'
import { users } from './users'
import type { z } from 'zod'

export const organizations = pgTable('organizations', {
  ...baseFields(),
  name: varchar({ length: 100 }).notNull(),
  slug: varchar({ length: 100 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  domain: varchar({ length: 100 }),
  shouldAttachUsersByDomain: boolean('should_attach_users_by_domain')
    .default(false)
    .notNull(),
  ownerId: varchar('owner_id', { length: 30 }).references(() => users.id, {
    onDelete: 'set null',
  }),
})

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, {
    fields: [organizations.ownerId],
    references: [users.id],
  }),
  invites: many(invites),
  members: many(members),
  projects: many(projects),
}))

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>
export type SelectOrganization = z.infer<typeof selectOrganizationSchema>
export const insertOrganizationSchema = createInsertSchema(organizations)
export const selectOrganizationSchema = createSelectSchema(organizations)
