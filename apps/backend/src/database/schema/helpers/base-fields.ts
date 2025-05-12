import { createId } from '@paralleldrive/cuid2'
import { timestamp, varchar } from 'drizzle-orm/pg-core'

type Props = {
  id?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  deleteAt?: boolean
}

const fields = {
  id: varchar({ length: 30 }).$defaultFn(createId).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}

/**
 * Returns an object with base fields for a model.
 *
 * @param id - If set to true, id field is returned (default true).
 * @param createdAt - If set to true, createdAt field is returned (default true).
 * @param updatedAt - If set to true, updatedAt field is returned (default true).
 * @param deletedAt - If set to true, deletedAt field is returned (default false).
 *
 * @returns - An object with base fields.
 */
export const baseFields = ({
  id = true,
  createdAt = true,
  updatedAt = true,
  deleteAt = false,
}: Props = {}) => {
  const baseFields = {}

  Object.assign(baseFields, {
    ...(id ? { id: fields.id } : {}),
    ...(createdAt ? { createdAt: fields.createdAt } : {}),
    ...(updatedAt ? { updatedAt: fields.updatedAt } : {}),
    ...(deleteAt ? { deletedAt: fields.deletedAt } : {}),
  })

  return baseFields as typeof fields
}
