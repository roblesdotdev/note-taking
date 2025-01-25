import { Link } from 'react-router'
import { getNoteById } from '~/utils/notes.server'
import type { Route } from './+types/notes.$noteId'

export async function loader({ params }: Route.LoaderArgs) {
  const note = await getNoteById(params.noteId)

  if (!note) {
    throw new Response('Not found', { status: 404 })
  }

  return {
    note,
  }
}

export default function NoteDetail({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData
  return (
    <div className="mt-6">
      <header className="mb-6">
        <Link to="/notes">Go Back</Link>
      </header>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-medium">{note.title}</h1>
        <p>{note.content}</p>
      </div>
    </div>
  )
}
