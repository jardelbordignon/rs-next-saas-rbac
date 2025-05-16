import { Header } from '@/components/layout'
import { OrganizationForm } from './form'

export default function CreateOrganization() {
  return (
    <div className='space-y-4'>
      <Header />

      <h1 className='text-2xl font-bold'>Create organization</h1>
      <OrganizationForm />
    </div>
  )
}
