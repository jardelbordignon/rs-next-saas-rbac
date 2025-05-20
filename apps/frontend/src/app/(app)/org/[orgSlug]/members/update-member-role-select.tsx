import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { updateMemberAction } from './actions'
import type { Role } from '@repo/authorizations'
import type { ComponentProps } from 'react'

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
  memberId: string
}

export async function UpdateMemberRoleSelect({
  memberId,
  ...props
}: UpdateMemberRoleSelectProps) {
  async function handleUpdateMemberRole(role: Role) {
    'use server'

    await updateMemberAction(memberId, role)
  }

  return (
    <Select {...props} onValueChange={handleUpdateMemberRole}>
      <SelectTrigger className='w-32'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='ADMIN'>Admin</SelectItem>
        <SelectItem value='MEMBER'>Member</SelectItem>
        <SelectItem value='BILLING'>Billing</SelectItem>
      </SelectContent>
    </Select>
  )
}
