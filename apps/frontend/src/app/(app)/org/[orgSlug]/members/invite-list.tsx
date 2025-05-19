import { getCurrentOrgCookie } from "@/auth/auth"
import { getOrganizationMembers } from "@/http/get-organization-members"

export async function InviteList() {
  const orgCookie = await getCurrentOrgCookie()
  if (!orgCookie) return null
  const members = await getOrganizationMembers(orgCookie)

  return (
    <div className='space-y-2'>
      <h1 className='text-2xl font-bold'>Invites</h1>

      <div className='space-y-4'></div>
    </div>
  )
}
