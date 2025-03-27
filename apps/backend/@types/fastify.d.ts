import type { SelectMember, SelectOrganization } from '@/database/schema'
import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(
      _slug: string,
    ): Promise<{ organization: SelectOrganization; membership: SelectMember }>
  }
}
