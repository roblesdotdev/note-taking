import type { Note, Prisma } from '@prisma/client'
import { db } from './db.server'

async function getNotes({ archived = false }: { archived?: boolean } = {}) {
  return db.note.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { tags: true },
    where: {
      archived,
    },
  })
}

export async function getArchivedNotes() {
  return getNotes({ archived: true })
}

export async function getPublicNotes() {
  return getNotes()
}

export async function getNoteById(id: Note['id']) {
  return db.note.findUnique({ where: { id }, include: { tags: true } })
}

export async function upsertNote(options: Prisma.NoteUpsertArgs) {
  return db.note.upsert({ ...options })
}

export async function deleteNote(id: Note['id']) {
  return db.note.delete({ where: { id } })
}

export async function toggleNote(id: Note['id']) {
  const note = await db.note.findUnique({
    where: { id },
    select: { archived: true },
  })

  if (!note) {
    throw new Error('Note not found')
  }

  // Actualizamos al estado opuesto
  return db.note.update({
    where: { id },
    data: {
      archived: !note.archived,
    },
  })
}
