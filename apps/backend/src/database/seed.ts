import { fakerPT_BR as faker } from '@faker-js/faker'
import chalk from 'chalk'
import { database } from './connection'
import {
  type InsertInviteData,
  type InsertOrganization,
  type InsertUserData,
  invites,
  organizations,
  users,
} from './schema'

await database.delete(invites)
await database.delete(organizations)
await database.delete(users)

console.log(chalk.yellow('🧹 Database reset'))

/**
 * Create users
 */
const usersData: InsertUserData[] = []

for (let i = 0; i < 5; i++) {
  const sex = faker.helpers.arrayElement(['male', 'female'])
  const fullName = {
    firstName: faker.person.firstName(sex),
    lastName: faker.person.lastName(sex),
  }
  usersData.push({
    name: `${fullName.firstName} ${fullName.lastName}`,
    email: faker.internet.email(fullName).toLocaleLowerCase(),
    passwordHash: faker.internet.password(),
    avatarUrl: faker.image.avatar(),
  })
}

await database.insert(users).values(usersData)
console.log(chalk.yellow('🌱 Created users'))

/**
 * Create organizations
 */

const organizationsData: InsertOrganization[] = []
for (let i = 0; i < 5; i++) {
  const name = faker.company.name()
  const slug = faker.helpers.slugify(name).toLocaleLowerCase()
  organizationsData.push({
    name,
    slug,
    avatarUrl: faker.image.avatar(),
    ownerId: faker.helpers.arrayElement(await database.select().from(users)).id,
    domain: `http://${slug}.${faker.internet.domainSuffix()}`,
    shouldAttachUsersByDomain: faker.datatype.boolean(),
  })
}

await database.insert(organizations).values(organizationsData)
console.log(chalk.yellow('🌱 Created organizations'))

/**
 * Create invites
 */

const invitesData: InsertInviteData[] = []
for (let i = 0; i < 5; i++) {
  invitesData.push({
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['MEMBER', 'ADMIN']),
    authorId: faker.helpers.arrayElement(await database.select().from(users)).id,
    organizationId: faker.helpers.arrayElement(
      await database.select().from(organizations),
    ).id,
  })
}

await database.insert(invites).values(invitesData)
console.log(chalk.yellow('🌱 Created invites'))

console.log(chalk.greenBright('✅ Database seeded successfully!'))

process.exit(0)
