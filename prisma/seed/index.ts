import { db } from '~/utils/db.server'
import { createFakeNote, createTags } from './utils'

async function seed() {
  // Clean db
  await db.note.deleteMany({})
  await db.tag.deleteMany({})

  // Insert dumb notes
  Promise.all(
    Array.from({ length: 10 }, async () => {
      const tags = createTags()
      await db.note.create({
        data: {
          ...createFakeNote(),
          tags: {
            connectOrCreate: tags.map(tagName => ({
              where: { name: tagName },
              create: { name: tagName },
            })),
          },
        },
      })
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
