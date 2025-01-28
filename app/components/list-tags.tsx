import { Link } from 'react-router'

export function ListTags({ tags }: { tags: { name: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {tags.map(tag => (
        <li key={tag.name} className="text-sm">
          <Link to={`/tags/${tag.name.toLocaleLowerCase()}`}>{tag.name}</Link>
        </li>
      ))}
    </ul>
  )
}
