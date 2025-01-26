import React, {
  useState,
  useId,
  useRef,
  useCallback,
  type KeyboardEvent,
} from 'react'

const demoTags = [
  'React',
  'Dev',
  'Node',
  'Test',
  'Blog',
  'Music',
  'Gaming',
  'Tech',
  'HowTo',
]

export function TagSelect({
  items = demoTags,
  values = [],
  name = 'tags',
  placeholder = 'Search or create tags',
  ref,
}: {
  items?: string[]
  values?: string[]
  name?: string
  placeholder?: string
  ref?: React.Ref<{ reset: () => void }>
}) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(values)

  const inputId = useId()
  const listRef = useRef<HTMLUListElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  React.useImperativeHandle(ref, () => ({
    reset: () => {
      // Reset to the initial values
      setSelected(values)
      setQuery('')
      setIsOpen(false)
    },
  }))

  const filteredTags = React.useMemo(
    () =>
      items.filter(
        item =>
          item.toLowerCase().includes(query.toLowerCase().trim()) &&
          !selected.includes(item),
      ),
    [items, query, selected],
  )

  const handleTagSelect = useCallback((tag: string) => {
    setSelected(prev => [...prev, tag])
    setQuery('')
    inputRef.current?.focus()
  }, [])

  const handleTagRemove = useCallback((tag: string) => {
    setSelected(prev => prev.filter(item => item !== tag))
  }, [])

  const toggleDropdown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(prev => !prev)
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredTags.length > 0) {
          handleTagSelect(filteredTags[0])
          setIsOpen(false)
          inputRef.current?.focus()
        } else {
          // create tag
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(false)
        inputRef.current?.focus()
      }
    },
    [filteredTags, handleTagSelect],
  )

  return (
    <div className="relative w-full">
      <div className="group flex w-full items-center rounded-lg border pr-3 outline-2 focus-within:outline">
        <label htmlFor={inputId} className="sr-only">
          {placeholder}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          onChange={e => {
            const newQuery = e.target.value.trimStart()
            setQuery(newQuery)
            if (newQuery.length > 0 && !isOpen) {
              setIsOpen(true)
            }
          }}
          onKeyDown={handleKeyDown}
          onMouseDown={toggleDropdown}
          placeholder={placeholder}
          className="group-focus:ring-3 w-full flex-1 rounded-lg border border-transparent bg-transparent px-3 py-4 outline-none"
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 max-h-52 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
          <ul
            ref={listRef}
            id="tag-list"
            aria-label="Available Tags"
            className="w-full"
          >
            {filteredTags.length ? (
              filteredTags.map(tag => (
                <li
                  key={tag}
                  className="cursor-pointer p-2 hover:bg-neutral-200 focus:bg-neutral-200 focus:outline-none"
                  onClick={() => handleTagSelect(tag)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleTagSelect(tag)
                    }
                  }}
                >
                  {tag}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500" aria-live="polite">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}

      {selected.length > 0 && (
        <ul
          aria-label="Selected Tags"
          className="mt-2 flex flex-wrap items-center gap-2"
        >
          {selected.map(tag => (
            <li
              key={tag}
              className="flex items-center gap-2 rounded-lg bg-black px-2 py-1 text-xs font-medium text-white"
            >
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag} tag`}
                onClick={() => handleTagRemove(tag)}
                className="rounded p-1 text-xs font-bold hover:bg-gray-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        type="hidden"
        name={name}
        value={JSON.stringify(selected)}
        aria-hidden="true"
      />
    </div>
  )
}
