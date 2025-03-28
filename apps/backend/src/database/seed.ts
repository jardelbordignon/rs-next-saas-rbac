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

const passwordHash = await Bun.password.hash('123qwe')
usersData.push({
  name: 'João da Silva',
  email: 'joao@alfa.com',
  avatarUrl: 'https://github.com/jardelbordignon.png',
  passwordHash,
})
usersData.push({
  name: 'Maria dos Santos',
  email: 'maria@alfa.com',
  avatarUrl: faker.image.avatarGitHub(),
  passwordHash,
})

usersData.push({
  name: 'Ana Lucia de Souza',
  email: 'ana@bravo.com',
  avatarUrl: faker.image.avatarGitHub(),
  passwordHash,
})

usersData.push({
  name: 'José de Oliveira',
  email: 'jose@charlie.com',
  avatarUrl: faker.image.avatarGitHub(),
  passwordHash,
})

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

const usersResponse = await database.insert(users).values(usersData).returning()

const joao = usersResponse[0]
const maria = usersResponse[1]
const ana = usersResponse[2]
const jose = usersResponse[3]
const fakeUser = usersResponse[4]

console.log(chalk.yellow('🌱 Created users'))

/**
 * Create organizations
 */

const organizationsData: InsertOrganization[] = []

organizationsData.push({
  name: 'Alfa Financeiro',
  slug: 'alfa-financeiro',
  domain: 'http://alfa.com',
  avatarUrl: faker.image.avatar(),
  shouldAttachUsersByDomain: false,
  ownerId: joao.id,
})

organizationsData.push({
  name: 'Alfa',
  slug: 'alfa',
  domain: 'http://alfa.com',
  avatarUrl: faker.image.avatar(),
  shouldAttachUsersByDomain: true,
  ownerId: joao.id,
})

organizationsData.push({
  name: 'Bravo',
  slug: 'bravo',
  domain: 'http://bravo.com',
  avatarUrl: faker.image.avatar(),
  shouldAttachUsersByDomain: true,
  ownerId: ana.id,
})

organizationsData.push({
  name: 'Charlie',
  slug: 'charlie',
  domain: 'http://charlie.com',
  avatarUrl: faker.image.avatar(),
  shouldAttachUsersByDomain: true,
  ownerId: jose.id,
})

const name = faker.company.name()
const slug = faker.helpers.slugify(name).toLocaleLowerCase()
organizationsData.push({
  name,
  slug,
  domain: `http://${slug}.${faker.internet.domainSuffix()}`,
  avatarUrl: faker.image.avatar(),
  shouldAttachUsersByDomain: faker.datatype.boolean(),
  ownerId: fakeUser.id,
})

const organizationsResponse = await database
  .insert(organizations)
  .values(organizationsData)
  .returning()

const alfaFinanceiro = organizationsResponse[0]
const alfa = organizationsResponse[1]
const bravo = organizationsResponse[2]
const charlie = organizationsResponse[3]
const fakeOrganization = organizationsResponse[4]

console.log(chalk.yellow('🌱 Created organizations'))

/**
 * Create members
 */

const membersData: InsertMember[] = []

membersData.push({
  userId: joao.id,
  organizationId: alfaFinanceiro.id,
  role: 'BILLING',
})

membersData.push({
  userId: joao.id,
  organizationId: alfa.id,
  role: 'ADMIN',
})

membersData.push({
  userId: maria.id,
  organizationId: alfa.id,
})

membersData.push({
  userId: ana.id,
  organizationId: bravo.id,
  role: 'ADMIN',
})

membersData.push({
  userId: jose.id,
  organizationId: charlie.id,
  role: 'ADMIN',
})

membersData.push({
  userId: fakeUser.id,
  organizationId: fakeOrganization.id,
  role: 'ADMIN',
})

await database.insert(members).values(membersData)
console.log(chalk.yellow('🌱 Created members'))

/**
 * Create projects
 */
const projectsData: InsertProject[] = []

for (const organizationId of [alfa.id, bravo.id, charlie.id]) {
  for (let i = 0; i < 2; i++) {
    const name = faker.word.words(2)
    projectsData.push({
      name,
      slug: faker.helpers.slugify(name).toLocaleLowerCase(),
      description: faker.lorem.paragraph(),
      organizationId,
      ownerId: faker.helpers.arrayElement([joao, maria, ana, jose, fakeUser]).id,
      isPrivate: faker.datatype.boolean(),
    })
  }
}

await database.insert(projects).values(projectsData)
console.log(chalk.yellow('🌱 Created projects'))

// /**
//  * Create invites
//  */

const invitesData: InsertInvite[] = []
for (const email of [joao.email, maria.email, ana.email, jose.email]) {
  invitesData.push({
    email,
    role: faker.helpers.arrayElement(['MEMBER', 'ADMIN']),
    authorId: fakeUser.id,
    organizationId: fakeOrganization.id,
  })
}

await database.insert(invites).values(invitesData)
console.log(chalk.yellow('🌱 Created invites'))

console.log(chalk.greenBright('✅ Database seeded successfully!'))

process.exit(0)
