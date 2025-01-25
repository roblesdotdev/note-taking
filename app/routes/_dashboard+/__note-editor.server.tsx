import { parseWithZod } from '@conform-to/zod'
import { type ActionFunctionArgs, redirect } from 'react-router'
import { z } from 'zod'
import { getNoteById, upsertNote } from '~/utils/notes.server'
import { NoteEditorSchema } from './__note-editor'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const submission = await parseWithZod(formData, {
    schema: NoteEditorSchema.superRefine(async (data, ctx) => {
      if (!data.id) return

      const note = await getNoteById(data.id)
      if (!note) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Note note found',
        })
      }
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return { result: submission.reply() }
  }

  const { id: noteId, ...data } = submission.value

  const newNote = await upsertNote({
    where: { id: noteId ?? '__new_note__' },
    create: {
      ...data,
    },
    update: {
      ...data,
    },
  })

  return redirect(`/notes/${newNote.id}`)
}
