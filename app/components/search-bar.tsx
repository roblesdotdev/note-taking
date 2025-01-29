import { useEffect } from 'react'
import { Form, useSearchParams, useSubmit } from 'react-router'
import { useDebounce } from '~/utils/misc'

export function SearchBar({
  placeholder = 'Search',
  autoSubmit = false,
}: {
  placeholder?: string
  autoSubmit?: boolean
}) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const submit = useSubmit()

  useEffect(() => {
    const searchField = document.getElementById('search-input')
    if (searchField instanceof HTMLInputElement) {
      searchField.value = query || ''
    }
  }, [query])

  const handleFormChange = useDebounce(async (form: HTMLFormElement) => {
    const isFirstSearch = query === null
    await submit(form, { replace: !isFirstSearch })
  }, 400)

  return (
    <Form
      method="get"
      onChange={e => autoSubmit && handleFormChange(e.currentTarget)}
    >
      <input
        className="w-full rounded-lg border px-3 py-4"
        aria-label="Search notes by tag, title or content"
        type="search"
        name="query"
        id="search-input"
        defaultValue={query || ''}
        placeholder={placeholder}
      />
    </Form>
  )
}
