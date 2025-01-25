import type { Note } from '@prisma/client'
import { db } from './db.server'

export async function getNotes() {
  return db.note.findMany({})
}

export async function getNoteById(id: Note['id']) {
  return db.note.findUnique({ where: { id } })
}
