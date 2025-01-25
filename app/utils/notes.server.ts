import type { Note, Prisma } from '@prisma/client'
import { db } from './db.server'

export async function getNotes() {
  return db.note.findMany({ orderBy: { updatedAt: 'desc' } })
}

export async function getNoteById(id: Note['id']) {
  return db.note.findUnique({ where: { id } })
}

export async function upsertNote(options: Prisma.NoteUpsertArgs) {
  return db.note.upsert({ ...options })
}
