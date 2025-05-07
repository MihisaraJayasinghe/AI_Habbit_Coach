export default function HabitList({ habits }) {
    return (
      <ul className="space-y-2">
        {habits.map((h) => (
          <li key={h._id} className="p-2 border rounded flex justify-between">
            <span>{h.name}</span>
            <a
              href={`/api/tip/${encodeURIComponent(h.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Get Tip
            </a>
          </li>
        ))}
      </ul>
    );
  }