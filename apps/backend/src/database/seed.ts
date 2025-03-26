import { fakerPT_BR as faker } from '@faker-js/faker'
import chalk from 'chalk'
import { database } from './connection'
import {
  type InsertInvite,
  type InsertMember,
  type InsertOrganization,
  type InsertProject,
  type InsertUser,
  invites,
  members,
  organizations,
  projects,
  users,
} from './schema'

type User = Omit<InsertUser, 'id'> & { id: string }
type Organization = Omit<InsertOrganization, 'id'> & { id: string }

let john: User
let jane: User
let otherUsers: User[] = []
let acmeJohnBilling: Organization
let acmeJohn: Organization
let acmeJane: Organization

await database.delete(invites)
await database.delete(members)
await database.delete(projects)
await database.delete(organizations)
await database.delete(users)

console.log(chalk.yellow('🧹 Database reset'))

/**
 * Create users
 */
const usersData: InsertUser[] = []

const passwordHash = await Bun.password.hash('abc@123')
usersData.push({
  name: 'John Doe',
  email: 'john.doe@acme.com',
  avatarUrl: 'https://github.com/jardelbordignon.png',
  passwordHash,
})
usersData.push({
  name: 'Jane Doe',
  email: 'jane.doe@acme.com',
  avatarUrl: 'https://github.com/jardelbordignon.png',
  passwordHash,
})

for (let i = 0; i < 5; i++) {
  const sex = faker.helpers.arrayElement(['male', 'female'])
  const fullName = {
    firstName: faker.person.firstName(sex),
    lastName: faker.person.lastName(sex),
  }
  usersData.push({
    name: `${fullName.firstName} ${fullName.lastName}`,
    email: faker.internet.email(fullName).toLocaleLowerCase(),
    avatarUrl: faker.image.avatarGitHub(),
    passwordHash,
  })
}

const usersResponse = await database.insert(users).values(usersData).returning()
john = usersResponse[0]
jane = usersResponse[1]
otherUsers = usersResponse.slice(2)

console.log(chalk.yellow('🌱 Created users'))

/**
 * Create organizations
 */

const organizationsData: InsertOrganization[] = []

organizationsData.push({
  name: 'Acme Inc. (John Billing)',
  slug: 'acme-john-billing',
  domain: 'http://acme.com',
  avatarUrl: faker.image.avatar(),
  shouldAttachUsersByDomain: true,
  ownerId: john.id,
})

organizationsData.push({
  name: 'Acme Inc. (John)',
  slug: 'acme-john',
  domain: 'http://acme.com',
  avatarUrl: faker.image.avatar(),
  shouldAttachUsersByDomain: true,
  ownerId: john.id,
})

organizationsData.push({
  name: 'Acme Inc. (Jane)',
  slug: 'acme-jane',
  domain: 'http://acme.com',
  avatarUrl: faker.image.avatar(),
  shouldAttachUsersByDomain: true,
  ownerId: jane.id,
})

for (let i = 0; i < 3; i++) {
  const name = faker.company.name()
  const slug = faker.helpers.slugify(name).toLocaleLowerCase()
  organizationsData.push({
    name,
    slug,
    domain: `http://${slug}.${faker.internet.domainSuffix()}`,
    avatarUrl: faker.image.avatar(),
    shouldAttachUsersByDomain: faker.datatype.boolean(),
    ownerId: faker.helpers.arrayElement(otherUsers).id,
  })
}

const organizationsResponse = await database
  .insert(organizations)
  .values(organizationsData)
  .returning()

acmeJohnBilling = organizationsResponse[0]
acmeJohn = organizationsResponse[1]
acmeJane = organizationsResponse[2]

console.log(chalk.yellow('🌱 Created organizations'))

/**
 * Create members
 */

const membersData: InsertMember[] = []

membersData.push({
  userId: john.id,
  organizationId: acmeJohnBilling.id,
  role: 'BILLING',
})

membersData.push({
  userId: john.id,
  organizationId: acmeJohn.id,
  role: 'ADMIN',
})

membersData.push({
  userId: jane.id,
  organizationId: acmeJohn.id,
})

membersData.push({
  userId: jane.id,
  organizationId: acmeJane.id,
  role: 'ADMIN',
})

membersData.push({
  userId: john.id,
  organizationId: acmeJane.id,
})

for (let i = 0; i < 2; i++) {
  membersData.push({
    userId: faker.helpers.arrayElement(otherUsers).id,
    organizationId: acmeJohn.id,
  })
}
for (let i = 0; i < 2; i++) {
  membersData.push({
    userId: faker.helpers.arrayElement(otherUsers).id,
    organizationId: acmeJane.id,
  })
}

await database.insert(members).values(membersData)
console.log(chalk.yellow('🌱 Created members'))

/**
 * Create projects
 */
const projectsData: InsertProject[] = []

for (const organizationId of [acmeJohn.id, acmeJane.id]) {
  for (let i = 0; i < 3; i++) {
    const name = faker.word.words(2)
    projectsData.push({
      name,
      slug: faker.helpers.slugify(name).toLocaleLowerCase(),
      description: faker.lorem.paragraph(),
      organizationId,
      ownerId: faker.helpers.arrayElement(otherUsers).id,
      isPrivate: faker.datatype.boolean(),
    })
  }
}

await database.insert(projects).values(projectsData)
console.log(chalk.yellow('🌱 Created projects'))

/**
 * Create invites
 */

const invitesData: InsertInvite[] = []
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
