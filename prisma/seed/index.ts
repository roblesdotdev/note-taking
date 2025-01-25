import { db } from '~/utils/db.server'
import { createFakeNote } from './utils'

async function seed() {
  // Clean db
  await db.note.deleteMany({})

  // Insert dumb notes
  Promise.all(
    Array.from({ length: 10 }, async () => {
      await db.note.create({ data: createFakeNote() })
    }),
  )
}

seed()
  .catch(e => {
    // biome-ignore lint/suspicious/noConsole: check seed error
    console.error(e)
  })
  .finally(async () => {
    await db.$disconnect()
  })
