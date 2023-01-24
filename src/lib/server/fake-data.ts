import { error, ok, type Error, type Result } from "$lib/result"
import { faker } from "@faker-js/faker"
import { Account, AccountList } from "./account"
import { Assignment } from "./assignment"
import { Category, CategoryList } from "./category"
import { query } from "./database"
import { Group, GroupList } from "./group"
import { Resource } from "./resource"

function syncRepeat(count: number, fn: () => unknown) {
  for (let index = 0; index < count; index++) {
    fn()
  }
}

function repeat(
  count: number,
  fn: () => PromiseLike<Result<unknown>>
): Promise<Result<void>> {
  return new Promise((resolve) => {
    let done = 0

    for (let index = 0; index < count; index++) {
      fn().then((result) => {
        if (!result.ok) {
          resolve(result)
          return
        }

        done++
        console.log("created", done + 1)

        if (done + 1 == count) {
          resolve(ok())
        }
      })
    }
  })
}

class ErroredResult {
  constructor(readonly error: Error) {}
}

function unwrap(value: Error): never
function unwrap<U>(value: Result<U>): U
function unwrap<U>(value: Result<U>): U {
  if (!value.ok) {
    throw new ErroredResult(value)
  }

  return value.value
}

async function run<T>(fn: () => PromiseLike<T>): Promise<Result<T>> {
  try {
    return ok(await fn())
  } catch (error) {
    if (error instanceof ErroredResult) {
      return error.error
    } else {
      throw error
    }
  }
}

function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Creates fake accounts. */
export function createAccounts(count: number) {
  return repeat(count, () => {
    const sex = faker.name.sexType()
    const first = faker.name.firstName(sex)
    const last = faker.name.lastName()
    const name = faker.name.fullName({ firstName: first, lastName: last, sex })
    const email = faker.helpers.unique(faker.internet.email, [first, last])

    return Account.create({ email, name })
  })
}

function capitalize(text: string) {
  return text[0]?.toUpperCase() + text.slice(1)
}

function plural(noun: string) {
  if (noun.endsWith("s")) {
    return noun + "es"
  }

  if (noun.endsWith("x")) {
    return noun.slice(0, -1) + "es"
  }

  if (noun.endsWith("y")) {
    return noun.slice(0, -1) + "ies"
  }

  return noun + "s"
}

function createGroupTitle() {
  const adverb = faker.word.adverb()
  const adjective = faker.word.adjective()
  const noun = plural(faker.word.noun())

  return capitalize(`${adverb} ${adjective} ${noun}`)
}

/** Creates fake groups with random members. */
export function createGroups(count: number) {
  return run(async () => {
    const accounts = unwrap(
      await new AccountList({}).select({
        id: true,
        memberOfIds: true,
      })
    ).sort((a, b) => a.memberOfIds.length - b.memberOfIds.length)

    if (accounts.length < 105) {
      unwrap(
        error(
          `There is not a large enough sample size to pick from. Found ${accounts.length} accounts; expected at least 105 (100 members + 5 leaders).`
        )
      )
    }

    for (let index = 0; index < count; index++) {
      const managerCount = faker.helpers.arrayElement([
        between(3, 5), // very large classes
        2, // large classes
        2, // large classes
        2, // large classes
        1, // normal class
        1, // normal class
        1, // normal class
        1, // normal class
        1, // normal class
        1, // normal class
      ])

      const memberCount = faker.helpers.arrayElement([
        between(1, 4), // small friend group
        between(6, 15), // small class
        between(6, 15), // small class
        between(10, 30), // varied class size
        between(10, 30), // varied class size
        between(10, 30), // varied class size
        between(40, 60), // large class
        between(40, 60), // large class
        between(40, 60), // large class
        between(50, 100), // everyone in the grade
      ])

      const members = faker.helpers.arrayElements(
        accounts,
        managerCount + memberCount
      )

      const title = createGroupTitle()

      const result = await Group.create({
        title,
        managers: {
          connect: members.slice(0, managerCount).map(({ id }) => ({ id })),
        },
        members: {
          connect: members.map(({ id }) => ({ id })),
        },
      })

      if (!result.ok) {
        unwrap(result)
      }

      console.log("created", index + 1)
    }
  })
}

/** Creates fake groups, specifically targeting people in few existing groups. */
export function createGroupsForUnpopular(count: number) {
  return run(async () => {
    for (let index = 0; index < count; index++) {
      const accounts = unwrap(
        await new AccountList({}).select({
          id: true,
          memberOfIds: true,
        })
      ).sort((a, b) => a.memberOfIds.length - b.memberOfIds.length)

      if (accounts.length < 105) {
        unwrap(
          error(
            `There is not a large enough sample size to pick from. Found ${accounts.length} accounts; expected at least 105 (100 members + 5 leaders).`
          )
        )
      }

      const managerCount = faker.helpers.arrayElement([
        between(3, 5), // very large classes
        2, // large classes
        2, // large classes
        2, // large classes
        1, // normal class
        1, // normal class
        1, // normal class
        1, // normal class
        1, // normal class
        1, // normal class
      ])

      const memberCount = faker.helpers.arrayElement([
        between(1, 4), // small friend group
        between(6, 15), // small class
        between(6, 15), // small class
        between(10, 30), // varied class size
        between(10, 30), // varied class size
        between(10, 30), // varied class size
        between(40, 60), // large class
        between(40, 60), // large class
        between(40, 60), // large class
        between(50, 100), // everyone in the grade
      ])

      const members = accounts.slice(0, managerCount + memberCount)
      const title = createGroupTitle()

      const result = await Group.create({
        title,
        managers: {
          connect: members.slice(0, managerCount).map(({ id }) => ({ id })),
        },
        members: {
          connect: members.map(({ id }) => ({ id })),
        },
      })

      if (!result.ok) {
        unwrap(result)
      }

      console.log("created", index + 1)
    }
  })
}

function createCategoryTitle() {
  return capitalize(`${faker.color.human()} ${faker.word.adjective()}`)
}

/** Creates fake categories. Once completed, every group will have at least one category. */
export function createMinimumRequiredCategories() {
  return run(async () => {
    let iter = 0

    while (true) {
      iter++

      const groups = unwrap(
        await new GroupList({
          categoryIds: { isEmpty: true },
        }).select({
          id: true,
        })
      )

      if (groups.length == 0) {
        return
      }

      const numberOfGroupsWithThisCategory = faker.helpers.arrayElement([
        between(5, 10), // classes with a huge number of sections
        between(2, 4), // classes often have multiple sections (8-1, 8-2, etc.)
        between(2, 4), // classes often have multiple sections (8-1, 8-2, etc.)
        between(2, 4), // classes often have multiple sections (8-1, 8-2, etc.)
        between(2, 4), // classes often have multiple sections (8-1, 8-2, etc.)
        between(2, 4), // classes often have multiple sections (8-1, 8-2, etc.)
        1, // standard
        1, // standard
        1, // standard
      ])

      const title = createCategoryTitle()

      const result = await Category.create({
        title,
        groups: {
          connect: faker.helpers
            .arrayElements(groups, numberOfGroupsWithThisCategory)
            .map(({ id }) => ({ id })),
        },
      })

      if (!result.ok) {
        unwrap(result)
      }

      console.log("created", iter)
    }
  })
}

/** Creates fake categories. Once completed, every group will have at least one category. */
export function createExtraCategories(count: number) {
  return run(async () => {
    for (let index = 0; index < count; index++) {
      const groups = unwrap(
        await new GroupList({}).select({
          id: true,
        })
      )

      const numberOfGroupsWithThisCategory = faker.helpers.arrayElement([
        between(5, 10), // classes with a huge number of sections
        between(2, 4), // classes often have multiple sections (8-1, 8-2, etc.)
        between(2, 4), // classes often have multiple sections (8-1, 8-2, etc.)
        between(2, 4), // classes often have multiple sections (8-1, 8-2, etc.)
        between(2, 4), // classes often have multiple sections (8-1, 8-2, etc.)
        between(2, 4), // classes often have multiple sections (8-1, 8-2, etc.)
        1, // standard
        1, // standard
        1, // standard
      ])

      const title = createCategoryTitle()

      const result = await Category.create({
        title,
        groups: {
          connect: faker.helpers
            .arrayElements(groups, numberOfGroupsWithThisCategory)
            .map(({ id }) => ({ id })),
        },
      })

      if (!result.ok) {
        unwrap(result)
      }

      console.log("created", index + 1)
    }
  })
}

function createTitle() {
  return capitalize(faker.company.bs())
}

function aOrAn(nextWord: string) {
  const char = nextWord[0]?.toLowerCase()

  if (char == "a" || char == "e" || char == "i" || char == "o" || char == "u") {
    return "an"
  } else {
    return "a"
  }
}

function addEd(verb: string) {
  if (verb.endsWith("n")) {
    return verb + "ned"
  } else if (verb.endsWith("e")) {
    return verb + "d"
  } else {
    return verb + "ed"
  }
}

function createBulletPoint() {
  const adj = faker.word.adjective()

  return faker.helpers.arrayElement([
    capitalize(`${aOrAn(adj)} ${adj} has been made to ${faker.company.bs()}.`),
    capitalize(
      `${faker.word.adverb()} copy how <em>they</em> ${faker.company.bs()}.`
    ),
    capitalize(
      `${faker.word.verb()} ${plural(
        faker.word.noun()
      )} and ${faker.word.verb()} <strong>the</strong> ${faker.word.noun()}.`
    ),
    capitalize(`The ${faker.word.noun()} has ${addEd(faker.word.verb())}.`),
    capitalize(`${faker.word.adverb()}!`),
  ])
}

function createList() {
  const points: string[] = []

  syncRepeat(
    faker.helpers.arrayElement([
      0,
      between(1, 2),
      3,
      between(1, 4),
      between(2, 5),
      between(7, 10),
    ]),
    () => points.push(`<li>${createBulletPoint()}</li>`)
  )

  const type = faker.helpers.arrayElement(["ol", "ul"])

  return `<${type}>${points.join("")}</${type}>`
}

function createParagraph() {
  const lorem: string[] = []

  syncRepeat(
    faker.helpers.arrayElement([1, 1, 1, 1, 2, 2, between(3, 4)]),
    () => lorem.push(`<p>${faker.lorem.paragraph()}</p>`)
  )

  return lorem.join("")
}

function createBody() {
  const items: string[] = [
    faker.helpers.arrayElement([createParagraph(), createList()]),
  ]

  syncRepeat(between(0, 3), () => {
    const item = faker.helpers.arrayElement([
      createParagraph(),
      createList(),
      undefined,
    ])

    if (item) {
      items.push(item)
    }
  })

  return items.join("")
}

function createSection() {
  const heading = `<h2>${faker.word.adverb()} ${faker.word.verb()} ${faker.word.adjective()} ${plural(
    faker.word.noun()
  )}</h2>`

  return heading + createBody()
}

function createDescription() {
  const subheadings: string[] = []

  syncRepeat(
    faker.helpers.arrayElement([0, 0, 0, 0, 1, 1, between(2, 3)]),
    () => subheadings.push(createSection())
  )

  return `<blockquote><p>${capitalize(
    faker.company.catchPhrase()
  )}</p><p>— ${faker.name.fullName()}</p></blockquote>${createBody()}${subheadings.join(
    ""
  )}`
}

const timePeriods = [
  "Second",
  "Minute",
  "Hour",
  "Day",
  "Day",
  "Week",
  "Fortnight",
  "Month",
  "Year",
  "Decade",
  "Century",
]

function createLink(): { href: string; title: string } {
  const href =
    Math.random() < 0.25 ? "https://zsnout.com/" : faker.internet.url()

  const title = faker.helpers.arrayElement([
    // Weird Clowns: The city is quickly burning
    `${capitalize(faker.word.adjective())} ${capitalize(
      plural(faker.word.noun())
    )}: The ${faker.word.noun()} is ${faker.word.adverb()} ${faker.word.adjective()}`,
    `${capitalize(faker.word.noun())} of the ${faker.helpers.arrayElement(
      timePeriods
    )}: ${capitalize(faker.word.adjective())} ${faker.word.noun()}`,
    faker.hacker.phrase(),
  ])

  return { href, title }
}

const day = 24 * 60 * 60 * 1000

export function createAssignments(count: number) {
  return run(async () => {
    const categories = unwrap(
      await new CategoryList({}).select({
        groupIds: true,
        id: true,
      })
    )

    console.log("got category list")

    return repeat(count, () => {
      const category = faker.helpers.arrayElement(categories)

      return Assignment.create({
        category: { id: category.id },
        description: createDescription(),
        due: new Date(
          +new Date() +
            faker.helpers.arrayElement([
              between(1 * day, 2 * day), // homework
              between(1 * day, 2 * day), // homework
              between(1 * day, 2 * day), // homework
              between(1 * day, 2 * day), // homework
              between(1 * day, 2 * day), // homework
              between(3 * day, 5 * day), // HW for the week
              between(3 * day, 5 * day), // HW for the week
              between(3 * day, 5 * day), // HW for the week
              between(10 * day, 30 * day), // project
              faker.helpers.arrayElement([
                between(60 * day, 100 * day), // large project
                between(150 * day, 210 * day), // semester project
              ]), // half the probability of ^^^^^^^^^^^^^^^^^^^^^
            ])
        ),
        files: [],
        groupIds: category.groupIds,
        links: faker.helpers.arrayElements(
          [createLink(), createLink(), createLink(), createLink()],
          faker.helpers.arrayElement([0, 0, 0, 0, 1, 2, 2, 3, 3, 4])
        ),
        points: faker.helpers.arrayElement([
          0, // ungraded
          0, // ungraded
          between(1, 2), // homework 1 2
          between(1, 2), // homework 1 2
          between(1, 3), // homework 1 2 3
          between(1, 3), // homework 1 2 3
          between(2, 3), // homework   2 3
          between(2, 3), // homework   2 3
          between(10, 15), // quiz
          between(20, 30), // major test or project
        ]),
        title: createTitle(),
        viewableAfter: new Date(),
      })
    })
  })
}

export function createResources(count: number) {
  return run(async () => {
    const categories = unwrap(
      await new CategoryList({}).select({
        groupIds: true,
        id: true,
      })
    )

    console.log("got category list")

    return repeat(count, () => {
      const category = faker.helpers.arrayElement(categories)

      return Resource.create({
        category: { id: category.id },
        description: createDescription(),
        files: [],
        groupIds: category.groupIds,
        links: faker.helpers.arrayElements(
          [createLink(), createLink(), createLink(), createLink()],
          faker.helpers.arrayElement([0, 0, 0, 0, 1, 2, 2, 3, 3, 4])
        ),
        title: createTitle(),
        viewableAfter: new Date(),
      })
    })
  })
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function clear() {
  return query(async (database) => {
    await database.account.deleteMany()
    await database.assignment.deleteMany()
    await database.assignmentStatus.deleteMany()
    await database.category.deleteMany()
    await database.discussion.deleteMany()
    await database.group.deleteMany()
    await database.magicLink.deleteMany()
    await database.message.deleteMany()
    await database.period.deleteMany()
    await database.resource.deleteMany()
    await database.session.deleteMany()
    await database.unverifiedAccount.deleteMany()
    return {}
  })
}

export async function suite() {
  console.clear()
  console.log("creating accounts...")
  await wait(2000)
  await createAccounts(1000)

  console.clear()
  console.log("created accounts.")
  console.log("creating groups...")
  await wait(2000)
  await createGroups(100)
  await createGroupsForUnpopular(50)
  await createGroups(100)
  await createGroupsForUnpopular(50)
  await createGroups(100)
  await createGroupsForUnpopular(50)
  await createGroups(100)
  await createGroupsForUnpopular(50)
  await createGroups(100)
  await createGroupsForUnpopular(50)
  await createGroups(100)
  await createGroupsForUnpopular(50)
  await createGroups(100)
  await createGroupsForUnpopular(50)
  await createGroups(100)
  await createGroupsForUnpopular(50)

  console.clear()
  console.log("created accounts.")
  console.log("created groups.")
  console.log("creating categories...")
  await wait(2000)
  await createMinimumRequiredCategories()
  for (let i = 0; i < 8; i++) {
    await createExtraCategories(125)
  }

  console.clear()
  console.log("created accounts.")
  console.log("created groups.")
  console.log("created categories.")
  console.log("creating assignments...")
  await wait(2000)
  for (let i = 0; i < 40; i++) {
    await createAssignments(25)
  }
}
