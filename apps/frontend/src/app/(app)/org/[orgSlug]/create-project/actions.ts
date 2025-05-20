'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'
import { getCurrentOrgCookie } from '@/auth/auth'
import { postProjects } from '@/http/post-projects'

const projectSchema = z.object({
  name: z.string().min(4, { message: 'Please, include at least 4 characters' }),
  description: z
    .string()
    .min(4, { message: 'Please, include at least 4 characters' }),
})

export async function createProject(formData: FormData) {
  const projectData = Object.fromEntries(formData)

  const { success, error, data } = projectSchema.safeParse(projectData)

  if (!success) {
    const errors = error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const orgSlug = await getCurrentOrgCookie()
  if (!orgSlug) {
    return {
      success: false,
      message: 'Organization reference not found',
      errors: null,
    }
  }

  try {
    await postProjects({ ...data, orgSlug })
    return { success: true, message: 'Project saved successfully', errors: null }
  } catch (error) {
    let message = 'Something went wrong in postProjects'
    if (error instanceof HTTPError) {
      message = (await error.response.json()).message
    }
    return { success: false, message, errors: null }
  }
}
