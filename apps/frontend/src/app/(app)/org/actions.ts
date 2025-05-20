'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'
import { getCurrentOrgCookie } from '@/auth/auth'
import { postOrganizations } from '@/http/post-organizations'
import { updateOrganizations } from '@/http/update-organizations'

const organizationSchema = z
  .object({
    name: z.string().min(4, { message: 'Please, include at least 4 characters' }),
    domain: z.string().refine(
      value => {
        if (value) {
          const domainRegex =
            /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
          return domainRegex.test(value)
        }
        return true
      },
      { message: 'Please, provide a valid domain' },
    ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform(v => v === 'on' || v === true)
      .default(false),
  })
  .refine(data => !(data.shouldAttachUsersByDomain && !data.domain), {
    message: 'Domain is required when auto-join is enabled',
    path: ['domain'],
  })

export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function saveOrganization(formData: FormData) {
  const organizationData = Object.fromEntries(formData)

  const { success, error, data } = organizationSchema.safeParse(organizationData)

  if (!success) {
    const errors = error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const orgCookie = await getCurrentOrgCookie()

  try {
    if (orgCookie) {
      await updateOrganizations({ ...data, orgSlug: orgCookie })
    } else {
      await postOrganizations(data)
    }
    return {
      success: true,
      message: `Organization ${orgCookie ? 'updated' : 'created'} successfully`,
      errors: null,
    }
  } catch (error) {
    let message = `Something went wrong in ${orgCookie ? 'update' : 'post'}Organizations\n`
    if (error instanceof HTTPError) {
      message += (await error.response.json()).message
    }
    return { success: false, message, errors: null }
  }
}
