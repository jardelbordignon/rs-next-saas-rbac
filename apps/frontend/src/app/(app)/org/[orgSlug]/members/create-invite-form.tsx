'use client'

import { UserPlus } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { SubmitButton, TextInput } from '@/components/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { useFormState } from '@/hooks'
import { queryClient } from '@/lib/react-query'
import { createInviteAction } from './actions'

export function CreateInviteForm() {
  const { orgSlug } = useParams<{ orgSlug: string }>()

  const [state, handleSubmit, isPending] = useFormState(createInviteAction, {
    onError: ({ message }) => toast.error(message),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({
        queryKey: [orgSlug, 'projects'],
      })
      toast.success(message)
      //redirect('/auth/sign-in')
    },
  })

  const { errors } = state

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='flex gap-2'>
        <div className='flex flex-1'>
          <TextInput
            id='email'
            type='email'
            label={false}
            placeholder='guest@email.com'
            error={errors?.email?.toString()}
          />
        </div>

        <Select name='role' defaultValue='MEMBER'>
          <SelectTrigger className='w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ADMIN'>Admin</SelectItem>
            <SelectItem value='MEMBER'>Member</SelectItem>
            <SelectItem value='BILLING'>Billing</SelectItem>
          </SelectContent>
        </Select>

        <SubmitButton className='' isSubmitting={isPending}>
          <UserPlus />
          Invite user
        </SubmitButton>
      </div>
    </form>
  )
}
