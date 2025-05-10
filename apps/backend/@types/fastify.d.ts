import type { SelectMember, SelectOrganization } from '@/database/schema'
import 'fastify'

declare module 'fastify' {
  export type Membership = {
    userId: string
    organization: SelectOrganization
    membership: SelectMember
  }

  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(_slug: string): Promise<Membership>
  }
}
