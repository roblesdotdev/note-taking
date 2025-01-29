import { db } from './db.server'

export async function getAllTags(query?: string) {
  return db.tag.findMany({
    where: {
      name: {
        contains: query,
      },
    },
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
