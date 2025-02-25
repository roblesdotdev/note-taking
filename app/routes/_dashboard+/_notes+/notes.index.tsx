import { Link } from 'react-router'
import { ListTags } from '~/components/list-tags'
import { getPublicNotes } from '~/utils/notes.server'
import type { Route } from './+types/notes.index'

export async function loader() {
  const notes = await getPublicNotes()
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
            {note.tags.length ? (
              <ListTags tags={note.tags} />
            ) : (
              <span className="block text-sm">No tags</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
