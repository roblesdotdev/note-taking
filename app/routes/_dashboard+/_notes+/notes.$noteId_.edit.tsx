import { getNoteById } from '~/utils/notes.server'
import type { Route } from './+types/notes.$noteId_.edit'
import { NoteEditor } from './__note-editor'

export { action } from './__note-editor.server'

export async function loader({ params }: Route.LoaderArgs) {
  const note = await getNoteById(params.noteId)
  if (!note) {
    throw new Response('Not found', { status: 404 })
  }

  return {
    note,
  }
}

export default function EditNote({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { note } = loaderData
  return <NoteEditor note={note} actionData={actionData} />
}
