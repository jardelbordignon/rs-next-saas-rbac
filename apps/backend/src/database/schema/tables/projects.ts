import { relations } from 'drizzle-orm'
import { boolean, pgTable, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { baseFields } from '../helpers/base-fields'
import { organizations } from './organizations'
import { users } from './users'
import type { z } from 'zod'

export const projects = pgTable('projects', {
  ...baseFields(),
  name: varchar({ length: 100 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 100 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  isPrivate: boolean('is_private').default(false).notNull(),
  organizationId: varchar('organization_id', { length: 30 })
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  ownerId: varchar('owner_id', { length: 30 }).references(() => users.id, {
    onDelete: 'set null',
  }),
})

export const projectsRelations = relations(projects, ({ one }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
}))

export type InsertProject = z.infer<typeof insertProjectSchema>
export const insertProjectSchema = createInsertSchema(projects)
export const selectProjectSchema = createSelectSchema(projects)
