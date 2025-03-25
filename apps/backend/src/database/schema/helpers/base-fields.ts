import { createId } from '@paralleldrive/cuid2'
import { timestamp, varchar } from 'drizzle-orm/pg-core'

type Props = {
  onlyId?: boolean
  updatedAt?: boolean
  deleteAt?: boolean
}

/**
 * Returns an object with base fields for a model.
 *
 * @param {boolean} [onlyId=false] - If set to true, only the id field is returned.
 * @param {boolean} [updatedAt=true] - If set to false, updatedAt field is not returned.
 * @param {boolean} [deletedAt=false] - If set to true, deletedAt field is returned.
 *
 * @returns {Record<string, import('drizzle-orm').PgColumn>} - An object with base fields.
 */
export const baseFields = ({
  onlyId = false,
  updatedAt = true,
  deleteAt = false,
}: Props = {}) => {
  const fields = {
    id: varchar({ length: 30 }).$defaultFn(createId).primaryKey(),
  }

  if (!onlyId) {
    Object.assign(fields, {
      createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
      ...(updatedAt && {
        updatedAt: timestamp('updated_at', { withTimezone: true }),
      }),
      ...(deleteAt && {
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
      }),
    })
  }

  return fields
}
