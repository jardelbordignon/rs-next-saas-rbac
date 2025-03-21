import { defineAbilityFor, projectSchema } from '@repo/authorizations'

export function useAuthorizations() {
  const { can } = defineAbilityFor({ id: 'user-1', role: 'MEMBER' })

  const project = projectSchema.parse({ id: 'project-1', ownerId: 'user-2' })

  console.log(can('get', project))
  console.log(can('update', project))
  console.log(can('delete', project))
  console.log(can('delete', 'Project'))
}
