import { createId } from '@paralleldrive/cuid2'
import { timestamp, varchar } from 'drizzle-orm/pg-core'

type Props = {
  onlyId?: boolean
  updatedAt?: boolean
  deleteAt?: boolean
}

type BaseFields = typeof fields & typeof optionals

const fields = {
  id: varchar({ length: 30 }).$defaultFn(createId).primaryKey(),
}

const optionals = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
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
  if (!onlyId) {
    Object.assign(fields, {
      createdAt: optionals.createdAt,
      ...(updatedAt && {
        updatedAt: optionals.updatedAt,
      }),
      ...(deleteAt && {
        deletedAt: optionals.deletedAt,
      }),
    })
  }

  return fields as BaseFields
}
