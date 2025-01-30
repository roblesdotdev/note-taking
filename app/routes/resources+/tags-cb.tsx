import { useCombobox, useMultipleSelection } from 'downshift'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFetcher } from 'react-router'
import { db } from '~/utils/db.server'
import type { Route } from './+types/tags-cb'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('query')
  const tags = await db.tag.findMany({
    where: q
      ? {
          name: {
            contains: q,
          },
        }
      : undefined,
    take: q ? undefined : 10,
  })
  return { tags }
}

interface Option {
  id: string
  name: string
}

export function TagsCombobox({ initialValues }: { initialValues: Option[] }) {
  const [inputValue, setInputValue] = useState('')
  const [selectedItems, setSelectedItems] = useState<Option[]>(initialValues)
  const fetcher = useFetcher<typeof loader>()

  const items = useMemo(() => {
    const allItems = (fetcher.data?.tags ?? []) as Array<Option>
    return allItems.filter(
      item => !selectedItems.some(selected => selected.id === item.id),
    )
  }, [selectedItems, fetcher.data?.tags])

  const resourceUrl = '/resources/tags-cb'
  const searchParams = new URLSearchParams()
  searchParams.set('query', inputValue)
  const fetchUrl = `${resourceUrl}?${searchParams}`
  const loadRef = useRef(fetcher.load)
  useEffect(() => {
    loadRef.current = fetcher.load
  })

  useEffect(() => {
    loadRef.current(fetchUrl)
  }, [fetchUrl])

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection<Option>({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            setSelectedItems(newSelectedItems || [])
            break
          default:
            break
        }
      },
    })

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    inputValue,
    selectedItem: null,
    onStateChange: ({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue || '')
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            setInputValue('')
            setSelectedItems([...selectedItems, newSelectedItem])
          }
          break
        default:
          break
      }
    },
    onInputValueChange: changes => {
      fetcher.submit(
        { query: changes.inputValue ?? '' },
        { method: 'get', action: '/resources/tags-cb' },
      )
    },
  })

  return (
    <div className="relative w-full">
      <div className="mb-2 flex w-full flex-wrap gap-2">
        {selectedItems.map((selectedItemForRender, index) => (
          <span
            key={`selected-item-${
              // biome-ignore lint/suspicious/noArrayIndexKey: use index to prevent fail
              index
            }`}
            {...getSelectedItemProps({
              selectedItem: selectedItemForRender,
              index,
            })}
            className="flex items-center rounded bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800"
          >
            {selectedItemForRender.name}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                removeSelectedItem(selectedItemForRender)
              }}
              className="ml-1 rounded-full p-1 hover:bg-neutral-200 hover:font-bold"
            >
              x
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          placeholder="Select options..."
          className="w-full rounded-lg border px-3 py-4"
          {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
        />
        <button
          type="button"
          aria-label="toggle menu"
          className="absolute inset-y-0 right-0 flex items-center px-4"
          {...getToggleButtonProps()}
        >
          &#8595;
        </button>
      </div>
      <ul
        className="absolute inset-x-0 z-10 mt-1 max-h-56 overflow-y-auto p-0"
        {...getMenuProps()}
      >
        {isOpen && items.length > 0
          ? items.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className={`${
                  highlightedIndex === index ? 'bg-blue-100' : 'bg-white'
                } ${selectedItem?.id === item.id ? 'font-black' : ''} relative cursor-default py-2 pr-9 pl-3 select-none`}
                {...getItemProps({ item, index })}
              >
                <span className="block truncate">{item.name}</span>
                {selectedItems.find(
                  selectedItem => selectedItem.id === item.id,
                ) && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                    ✓
                  </span>
                )}
              </li>
            ))
          : null}
      </ul>
      <input
        type="hidden"
        name="tags"
        value={JSON.stringify(selectedItems.map(tags => tags.name))}
        aria-hidden="true"
      />
    </div>
  )
}

export default function ResourceRoute({ loaderData }: Route.ComponentProps) {
  const { tags } = loaderData
  return <pre>{JSON.stringify(tags, null, 2)}</pre>
}
