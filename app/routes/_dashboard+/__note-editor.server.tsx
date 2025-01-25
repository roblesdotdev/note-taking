import { parseWithZod } from '@conform-to/zod'
import { type ActionFunctionArgs, redirect } from 'react-router'
import { createNote } from '~/utils/notes.server'
import { NoteEditorSchema } from './__note-editor'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: NoteEditorSchema })

  if (submission.status !== 'success') {
    return { result: submission.reply() }
  }

  const newNote = await createNote(submission.value)

  return redirect(`/notes/${newNote.id}`)
}
