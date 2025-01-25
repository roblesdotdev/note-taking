import {
  FormProvider,
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, Link } from 'react-router'
import { z } from 'zod'
import type { Info } from './+types/notes.new'

export const NoteEditorSchema = z.object({
  title: z.string().min(4),
  content: z.string(),
})

export function NoteEditor({ actionData }: { actionData: Info['actionData'] }) {
  const [form, fields] = useForm({
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: NoteEditorSchema })
    },
  })
  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <Link to="/notes">Go back</Link>
        <div className="flex items-center gap-4">
          <button
            className="cursor-pointer hover:underline"
            type="reset"
            {...form.reset.getButtonProps()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer hover:underline"
            form={form.id}
          >
            Save
          </button>
        </div>
      </header>
      <FormProvider context={form.context}>
        <Form method="post" {...getFormProps(form)}>
          <div className="flex flex-col gap-4">
            <div>
              <input
                {...getInputProps(fields.title, { type: 'text' })}
                key={fields.title.key}
                className="w-full rounded-lg border px-3 py-4"
                placeholder="Note title..."
              />
              <ErrorList
                errors={fields.title.errors}
                id={fields.title.errorId}
              />
            </div>
            <div>
              <textarea
                {...getTextareaProps(fields.content)}
                key={fields.content.key}
                className="h-80 w-full rounded-lg border px-3 py-4"
                placeholder="Note content..."
              />
              <ErrorList
                errors={fields.content.errors}
                id={fields.content.errorId}
              />
            </div>
          </div>
        </Form>
      </FormProvider>
    </>
  )
}

type ListOfErrors = Array<string | null | undefined> | null | undefined

function ErrorList({ id, errors }: { id?: string; errors?: ListOfErrors }) {
  const errorsToRender = errors?.filter(Boolean)
  if (!errorsToRender?.length) return null

  return (
    <ul id={id}>
      {errorsToRender.map(err => (
        <li className="text-sm" key={err}>
          {err}
        </li>
      ))}
    </ul>
  )
}
