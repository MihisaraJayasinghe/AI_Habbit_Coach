import { useState } from "react";

export default function HabitForm({ onAdd }) {
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name) return;
        onAdd(name);
        setName("");
      }}
      className="flex gap-2 mb-4"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New habit"
        className="flex-1 p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Add
      </button>
    </form>
  );
}