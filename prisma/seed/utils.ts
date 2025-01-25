import { faker } from '@faker-js/faker'

export function createFakeNote() {
  return {
    title: faker.book.title(),
    content: faker.hacker.phrase(),
  }
}
