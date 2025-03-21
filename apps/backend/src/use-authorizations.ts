import { defineAbilityFor, projectSchema } from '@repo/authorizations'

export function useAuthorizations() {
  const ability = defineAbilityFor({ id: 'user-1', role: 'MEMBER' })

  const project = projectSchema.parse({ id: 'project-1', ownerId: 'user-2' })

  console.log(ability.can('get', project))
  console.log(ability.can('update', project))
  console.log(ability.can('delete', project))
  console.log(ability.can('delete', 'Project'))
}
