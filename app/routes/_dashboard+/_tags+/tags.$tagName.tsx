import { ListTags } from '~/components/list-tags'
import { getNotesByTag } from '~/utils/tags.server'
import type { Route } from './+types/tags.$tagName'

export async function loader({ params }: Route.LoaderArgs) {
  const tagWithNotes = await getNotesByTag({ tag: params.tagName })

  if (!tagWithNotes) {
    throw new Response('Not found', { status: 404 })
  }

  return {
    notes: tagWithNotes.notes,
    tag: tagWithNotes.name,
  }
}

export default function TagNotesRoute({ loaderData }: Route.ComponentProps) {
  const { notes, tag } = loaderData
  return (
    <div>
      <h1 className="mb-6 text-lg font-bold">Notes by tag({tag})</h1>
      <ul className="flex flex-col gap-2">
        {notes.map(note => (
          <li key={note.id}>
            <h1 className="font-medium">{note.title}</h1>
            <ListTags tags={note.tags} />
          </li>
        ))}
      </ul>
    </div>
  )
}
