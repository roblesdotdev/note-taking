import { Link } from 'react-router'

export default function NotesRoute() {
  return (
    <div className="mt-6">
      <ul className="flex flex-col gap-4">
        <li>
          <Link to="/notes/1">First Note</Link>
        </li>
        <li>
          <Link to="/notes/1">Second Note</Link>
        </li>
      </ul>
    </div>
  )
}
