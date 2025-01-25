import { faker } from '@faker-js/faker'

export function createFakeNote() {
  return {
    title: faker.book.title(),
    content: faker.hacker.phrase(),
  }
}

export function randomCount({
  min = 1,
  max = 5,
}: {
  min?: number
  max?: number
}) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function createTags() {
  return Array.from({ length: randomCount({}) }, () =>
    faker.commerce.department(),
  )
}
