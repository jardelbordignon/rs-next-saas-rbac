'use client'

//import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { SubmitButton, TextArea, TextInput } from '@/components/form'
import { useFormState } from '@/hooks'
import { createProject } from './actions'

export function ProjectForm() {
  const [state, handleSubmit, isPending] = useFormState(createProject, {
    onError: ({ message }) => toast.error(message),
    onSuccess: ({ message }) => {
      toast.success(message)
      //redirect('/auth/sign-in')
    },
  })

  const { errors } = state

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <TextInput id='name' label='Project name' error={errors?.name?.[0]} />
      <TextArea id='description' error={errors?.description?.[0]} />

      <SubmitButton isSubmitting={isPending}>Save project</SubmitButton>
    </form>
  )
}
