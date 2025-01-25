import { Link, Outlet } from 'react-router'

export default function NotesLayout() {
  return (
    <div>
      <header className="flex h-16 items-center px-4">
        <nav className="flex w-full items-center justify-between">
          <Link to=".">
            <h1>Note Taking</h1>
          </Link>
          <Link to="notes/new">New Note</Link>
        </nav>
      </header>
      <main className="px-4">
        <Outlet />
      </main>
    </div>
  )
}
