export function ListTags({ tags }: { tags: { name: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {tags.map(tag => (
        <li key={tag.name} className="text-sm">
          {tag.name}
        </li>
      ))}
    </ul>
  )
}
