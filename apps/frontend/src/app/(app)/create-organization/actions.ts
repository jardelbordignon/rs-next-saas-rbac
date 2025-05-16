'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'
import { postOrganizations } from '@/http/post-organizations'

const organizationSchema = z
  .object({
    name: z.string().min(4, { message: 'Please, include at least 4 characters' }),
    domain: z.string().refine(
      value => {
        if (value) {
          const domainRegex =
            /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
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

export async function createOrganization(_: unknown, formData: FormData) {
  const organizationData = Object.fromEntries(formData)

  const { success, error, data } = organizationSchema.safeParse(organizationData)

  if (!success) {
    const errors = error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  try {
    await postOrganizations(data)
    return { success: true, message: 'Organization saved successfully', errors: null }
  } catch (error) {
    let message = 'Something went wrong in postOrganizations'
    if (error instanceof HTTPError) {
      message = (await error.response.json()).message
    }
    return { success: false, message, errors: null }
  }
}
