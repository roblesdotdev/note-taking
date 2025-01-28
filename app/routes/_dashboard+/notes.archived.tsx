import { getArchivedNotes } from '~/utils/notes.server'
import type { Route } from './+types/notes.archived'

export async function loader() {
  const archivedNotes = await getArchivedNotes()
  return {
    notes: archivedNotes,
  }
}

export default function ({ loaderData }: Route.ComponentProps) {
  const { notes } = loaderData

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
