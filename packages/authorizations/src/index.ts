import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { z } from 'zod'
import { permissions } from './permissions'
import { billingSubject } from './subjects/billing'
import { inviteSubject } from './subjects/invite'
import { organizationSubject } from './subjects/organization'
import { projectSubject } from './subjects/project'
import { userSubject } from './subjects/user'
import type { User } from './models/user'
import type { CreateAbility, MongoAbility } from '@casl/ability'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appAbilitiesSchema = z.union([
  billingSubject,
  inviteSubject,
  organizationSubject,
  projectSubject,
  userSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

export * from './models/organization'
export * from './models/project'
export * from './models/user'
export * from './roles'

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder<AppAbility>(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({ detectSubjectType: subject => subject.__typename })

  // Resolve -> TypeError: undefined is not an object (evaluating 'this.can')
  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
