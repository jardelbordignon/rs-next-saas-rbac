'use client'

//import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { SubmitButton, TextInput } from '@/components/form'
import { Checkbox } from '@/components/ui'
import { useFormState } from '@/hooks'
import { saveOrganization } from './actions'
import type { OrganizationSchema } from './actions'

interface OrganizationFormProps {
  initialData?: OrganizationSchema
}

export function OrganizationForm({ initialData }: OrganizationFormProps) {
  const [state, handleSubmit, isPending] = useFormState(saveOrganization, {
    onError: ({ message }) => toast.error(message),
    onSuccess: ({ message }) => {
      toast.success(message)
      //redirect('/auth/sign-in')
    },
  })

  const { errors } = state

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <TextInput
        id='name'
        label='Organization name'
        defaultValue={initialData?.name}
        error={errors?.name?.[0]}
      />
      <TextInput
        id='domain'
        label='E-mail domain'
        inputMode='url'
        placeholder='example.com'
        defaultValue={initialData?.domain}
        error={errors?.domain?.[0]}
      />

      <div className='space-y-1'>
        <div className='flex items-baseline space-x-2'>
          <Checkbox
            id='shouldAttachUsersByDomain'
            name='shouldAttachUsersByDomain'
            className='translate-y-0.5'
            defaultChecked={initialData?.shouldAttachUsersByDomain}
          />
          <label htmlFor='shouldAttachUsersByDomain' className='space-y-1'>
            <span className='text-sm font-medium leading-none'>
              Auto-join new members
            </span>
            <p>
              This will automatically invite all members with same e-mail domain to
              this organization
            </p>
          </label>
        </div>
      </div>

      <SubmitButton isSubmitting={isPending}>Save organization</SubmitButton>
    </form>
  )
}
