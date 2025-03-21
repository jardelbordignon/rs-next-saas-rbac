import { z } from 'zod'

export const roleSchema = z.enum(['ADMIN', 'BILLING', 'MEMBER'])
export type Role = z.infer<typeof roleSchema>
