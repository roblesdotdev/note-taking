import { Link } from 'react-router'

export default function NoteDetail() {
  return (
    <div className="mt-6">
      <header className="mb-6">
        <Link to="/notes">Go Back</Link>
      </header>
      <h1>Note detail</h1>
    </div>
  )
}
