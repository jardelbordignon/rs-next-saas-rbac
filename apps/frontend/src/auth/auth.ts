import { defineAbilityFor } from '@repo/authorizations'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'

export async function isAuthenticated() {
  const { get } = await cookies()

  return !!get('accessToken')?.value
}

export async function authProfile() {
  const { delete: del, get } = await cookies()

  const accessToken = get('accessToken')?.value

  if (!accessToken) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()
    return { user }
  } catch {
    del('accessToken')
  }

  redirect('/auth/sign-in')
}

export async function getCurrentOrgCookie() {
  const { get } = await cookies()
  return get('org')?.value ?? null
}

export async function getCurrentMembership() {
  const orgCookie = await getCurrentOrgCookie()
  if (!orgCookie) return null
  const { membership } = await getMembership(orgCookie)
  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()
  if (!membership) return null
  return defineAbilityFor({ id: membership.userId, role: membership.role })
}
