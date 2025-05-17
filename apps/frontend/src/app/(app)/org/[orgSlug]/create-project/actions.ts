'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(4, { message: 'Please, include at least 4 characters' }),
  description: z
    .string()
    .min(4, { message: 'Please, include at least 4 characters' }),
})

export async function createProject(_: unknown, formData: FormData) {
  const projectData = Object.fromEntries(formData)

  const { success, error, data } = projectSchema.safeParse(projectData)

  if (!success) {
    const errors = error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  try {
    return { success: true, message: 'Project saved successfully', errors: null }
  } catch (error) {
    let message = 'Something went wrong in postProjects'
    if (error instanceof HTTPError) {
      message = (await error.response.json()).message
    }
    return { success: false, message, errors: null }
  }
}
