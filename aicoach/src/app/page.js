"use client";
import { useState, useEffect } from "react";
import HabitForm from "@/components/HabitForm";
import HabitList from "@/components/HabitList";

export default function Home() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    fetch("/api/habits")
      .then((res) => res.json())
      .then(setHabits);
  }, []);

  const addHabit = async (name) => {
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const newHabit = await res.json();
    setHabits((h) => [...h, newHabit]);
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Habit Coach</h1>
      <HabitForm onAdd={addHabit} />
      <HabitList habits={habits} />
    </main>
  );
}