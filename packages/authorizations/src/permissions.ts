import type { AppAbility } from '.'
import type { User } from './models/user'
import type { Role } from './roles'
import type { AbilityBuilder } from '@casl/ability'

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user: User, { can, cannot }: AbilityBuilder<AppAbility>) {
    can('manage', 'all')

    // negação de permissões não podem ter condicionais
    //cannot('transfer_ownership', 'Organization', { ownerId: { $ne: user.id } })
    cannot(['transfer_ownership', 'update'], 'Organization')
    can(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    })
  },

  BILLING(_, { can }: AbilityBuilder<AppAbility>) {
    can('manage', 'Billing')
  },

  MEMBER(user: User, { can }: AbilityBuilder<AppAbility>) {
    can('get', 'User')
    can(['create', 'get'], 'Project')
    can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } })
  },
}
