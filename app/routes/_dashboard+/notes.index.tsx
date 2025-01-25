import { Link } from 'react-router'
import { getNotes } from '~/utils/notes.server'
import type { Route } from './+types/notes.index'

export async function loader() {
  const notes = await getNotes()
  return {
    notes,
  }
}

export default function NotesRoute({ loaderData }: Route.ComponentProps) {
  const { notes } = loaderData

  return (
    <div className="mt-6">
      <ul className="flex flex-col gap-4">
        {notes.map(note => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
