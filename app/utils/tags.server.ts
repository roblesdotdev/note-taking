import { db } from './db.server'

export async function getAllTags() {
  return db.tag.findMany({
    include: {
      _count: {
        select: {
          notes: true,
        },
      },
    },
  })
}

export async function getNotesByTag({ tag }: { tag: string }) {
  return db.tag.findFirst({
    where: { name: { contains: tag } },
    include: { notes: { include: { tags: true } } },
  })
}
