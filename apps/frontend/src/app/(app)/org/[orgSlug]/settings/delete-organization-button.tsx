import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getCurrentOrgCookie } from '@/auth/auth'
import { Button } from '@/components/ui'
import { deleteOrganizations } from '@/http/delete-organizations'

export function DeleteOrganizationButton() {
  async function handleDelete() {
    'use server'

    const orgCookie = await getCurrentOrgCookie()

    if (orgCookie) {
      await deleteOrganizations(orgCookie)
      redirect('/')
    }
  }

  return (
    <form action={handleDelete}>
      <Button variant='destructive' className='w-56' type='submit'>
        <XCircle className='mr-2 size-4' />
        Shutdown organization
      </Button>
    </form>
  )
}
