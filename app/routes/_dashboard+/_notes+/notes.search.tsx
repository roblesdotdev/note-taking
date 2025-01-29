import { redirect } from 'react-router'
import { SearchBar } from '~/components/search-bar'
import { db } from '~/utils/db.server'
import type { Route } from './+types/notes.search'

export async function loader({ request }: Route.LoaderArgs) {
  const query = new URL(request.url).searchParams.get('query')

  if (query === '') {
    return redirect('/notes/search')
  }

  const like = `${query ?? ''}`
  const notes = await db.note.findMany({
    where: {
      OR: [
        { title: { contains: like } },
        { tags: { some: { name: { contains: like } } } },
        { content: { contains: like } },
      ],
    },
    include: {
      tags: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: like === '' ? 3 : undefined,
  })

  return {
    query,
    notes,
  }
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const { query, notes } = loaderData
  const hasQuery = query && query.length > 0

  return (
    <div>
      <SearchBar
        autoSubmit={true}
        placeholder="Search notes by tag, title or content"
      />
      {hasQuery ? (
        <div className="mt-6">
          <h1>Results for '{query}'</h1>
          <pre>{JSON.stringify(notes, null, 2)}</pre>
        </div>
      ) : (
        <div className="mt-6">
          <p className="mb-4 text-lg">No query</p>
          <h1 className="text-lg font-bold">Check latest</h1>

          <pre>{JSON.stringify(notes, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
