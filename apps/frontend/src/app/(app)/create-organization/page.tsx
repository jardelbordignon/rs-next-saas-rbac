import { SubmitButton, TextInput } from '@/components/form'
import { Checkbox } from '@/components/ui'

export default function CreateOrganization() {
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Create organization</h1>

      <form className='space-y-4'>
        <TextInput
          id='name'
          label='Organization name'
          //error={errors?.name?.[0]}
        />
        <TextInput
          id='domain'
          label='E-mail domain'
          inputMode='url'
          placeholder='example.com'
          //    error={errors?.domain?.[0]}
        />

        <div className='space-y-1'>
          <div className='flex items-baseline space-x-2'>
            <Checkbox
              id='shouldAttachUsersByDomain'
              name='shouldAttachUsersByDomain'
              className='translate-y-0.5'
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

        <SubmitButton isSubmitting={false}>Save organization</SubmitButton>
      </form>
    </div>
  )
}
