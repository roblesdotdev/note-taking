import { Link } from 'react-router'

export function meta() {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function Home() {
  return (
    <div className="grid place-items-center pt-24">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-medium">Note Taking</h1>
        <Link to="/notes">Get Started</Link>
      </div>
    </div>
  )
}
