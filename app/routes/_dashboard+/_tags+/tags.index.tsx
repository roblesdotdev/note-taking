import { Link } from 'react-router'
import { getAllTags } from '~/utils/tags.server'
import type { Route } from './+types/tags.index'

export async function loader() {
  const tags = await getAllTags()
  return {
    tags,
  }
}

export default function AllTags({ loaderData }: Route.ComponentProps) {
  const { tags } = loaderData
  return (
    <div>
      <h1 className="mb-6 text-lg font-bold">All tags</h1>
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
