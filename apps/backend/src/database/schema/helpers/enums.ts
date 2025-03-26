import { pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('Role', ['ADMIN', 'MEMBER', 'BILLING'])
export const accountProviderEnum = pgEnum('AccountProvider', ['GITHUB'])
export const tokenTypeEnum = pgEnum('TokenType', ['PASSWORD_RECOVER'])

export type AccountProvider = (typeof accountProviderEnum)['enumValues'][number]

// export enum ForeignKeys {
//   'USER_ACCOUNTS' = 'user_accounts_fk',
//   'USER_TOKENS' = 'user_tokens_fk',
//   'USER_INVITES' = 'user_invites_fk',
//   'USER_MEMBER_ON' = 'user_member_on_fk',
//   'ORGANIZATION_OWNER' = 'organization_owner_fk',
//   'ORGANIZATION_PROJECTS' = 'organization_projects_fk',
//   'PROJECT_OWNER' = 'project_owner_fk',
//   'ORGANIZATION_MEMBERS' = 'organization_members_fk',
//   'ORGANIZATION_INVITES' = 'organization_invites_fk',
// }
