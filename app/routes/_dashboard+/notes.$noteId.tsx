import { Form, Link, redirect } from 'react-router'
import { deleteNote, getNoteById } from '~/utils/notes.server'
import type { Route } from './+types/notes.$noteId'

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData()
  const intent = formData.get('_intent')
  if (intent !== 'delete') {
    throw new Response('Invalid submission', { status: 400 })
  }

  await deleteNote(params.noteId)

  return redirect('/notes')
}

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
      <header className="mb-6 flex items-center justify-between">
        <Link to="/notes">Go Back</Link>
        <div className="flex items-center gap-4">
          <Form
            method="post"
            onSubmit={e => {
              const hasConfirmation = window.confirm('Are you sure?')
              if (!hasConfirmation) {
                e.preventDefault()
              }
            }}
          >
            <button type="submit" name="_intent" value="delete">
              Delete
            </button>
          </Form>
          <Link to="edit">Edit</Link>
        </div>
      </header>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-medium">{note.title}</h1>
        <p>{note.content}</p>
      </div>
    </div>
  )
}
