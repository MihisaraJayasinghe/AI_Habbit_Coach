"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  dayLabel: string;
  task: string;
}

export default function Home() {
  const [habit, setHabit] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSteps([]);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habit }),
      });
      if (!res.ok) throw new Error("Failed to get steps");
      const data = await res.json();
      setSteps(data.steps);
    } catch (err) {
      setError("Could not fetch steps. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-white overflow-x-hidden p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-200"
      >
        <h1 className="text-4xl font-bold mb-4 text-primary text-center">
          AI Habit Coach
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white/80 placeholder-gray-500"
            placeholder="e.g. Wake up early"
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-accent px-6 py-3 rounded-xl text-white font-semibold hover:bg-green-600 transition"
          >
            {loading ? "Thinking..." : "Guide Me"}
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-appleRed mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence>
          {steps.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-4"
            >
              <h2 className="text-2xl font-semibold mb-4 text-blue-700 text-center">
                Your Personalized Plan
              </h2>
              <motion.ol
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="flex flex-col gap-4"
              >
                {steps.map((step, index) => (
                  <motion.li
                    key={index}
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="bg-white/90 border-l-4 border-primary p-4 rounded-2xl shadow-md cursor-default"
                  >
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white font-bold rounded-full mr-3">
                        {step.dayLabel.replace('Day ', '')}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {step.dayLabel}
                      </h3>
                    </div>
                    <p className="text-gray-700 pl-11">{step.task}</p>
                  </motion.li>
                ))}
              </motion.ol>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <footer className="mt-12 text-gray-400 text-sm text-center">
        Designed with ❤️ for habit-builders. Powered by OpenAI.
        <br />
        <span className="text-xs text-gray-300">
          Apple-inspired, colorful, and easy to use.
        </span>
      </footer>
    </div>
  );
}
