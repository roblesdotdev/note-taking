import { Link, redirect } from 'react-router'
import { SearchBar } from '~/components/search-bar'
import { getAllTags } from '~/utils/tags.server'
import type { Route } from './+types/tags.index'

export async function loader({ request }: Route.LoaderArgs) {
  const query = new URL(request.url).searchParams.get('query')

  if (query === '') {
    return redirect('/tags')
  }

  const tags = await getAllTags(query ?? undefined)
  return {
    tags,
    query,
  }
}

export default function AllTags({ loaderData }: Route.ComponentProps) {
  const { query, tags } = loaderData
  const hasQuery = query && query.length > 0
  return (
    <div>
      <h1 className="mb-6 text-lg font-bold">
        {hasQuery ? `Results for "${query}"` : 'All tags'}
      </h1>
      <SearchBar autoSubmit={true} placeholder="Filter by tag name" />
      <ul className="flex flex-col gap-2">
        {tags.map(tag => (
          <li key={tag.id}>
            <Link to={`/tags/${tag.name.toLocaleLowerCase()}`}>
              <h1 className="font-medium">
                {tag.name}{' '}
                <span className="text-xs font-normal">
                  ({tag._count.notes})
                </span>
              </h1>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
