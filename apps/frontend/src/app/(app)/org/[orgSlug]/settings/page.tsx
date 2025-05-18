import { ability, getCurrentOrgCookie } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { getOrganization } from '@/http/get-organization'
import { OrganizationForm } from '../../form'
import { DeleteOrganizationButton } from './delete-organization-button'

export default async function Settings() {
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')
  const canDeleteOrganization = permissions?.can('delete', 'Organization')

  let initialData

  const orgCookie = await getCurrentOrgCookie()
  if (orgCookie) {
    const { organization } = await getOrganization(orgCookie)
    initialData = {
      domain: organization.domain ?? '',
      name: organization.name,
      shouldAttachUsersByDomain: organization.shouldAttachUsersByDomain,
    }
  }

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Settings</h1>

      <div className='space-y-4'>
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization settings</CardTitle>
              <CardDescription>Update your organization details</CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationForm initialData={initialData} />
            </CardContent>
          </Card>
        )}

        {canGetBilling && <div>Billing</div>}

        {canDeleteOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Shutdown organization</CardTitle>
              <CardDescription>
                This will delete all organization data including all projects. You
                cannot undo this action.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteOrganizationButton />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
