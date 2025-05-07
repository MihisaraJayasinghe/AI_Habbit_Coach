// app/api/coach/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { habit } = await req.json();

  if (!habit) {
    return NextResponse.json({ error: 'Missing habit' }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OpenAI API key');
    return NextResponse.json({ error: 'Server configuration error: Missing API key.' }, { status: 500 });
  }

  try {
    const prompt = `You are an inspiring AI habit coach. Your goal is to help a user build the habit of "${habit}".
Create a 7-day (or a suitable number of days, typically between 5-10, if 7 is not optimal for this specific habit) step-by-step plan for a beginner.
Each step should be for one distinct day.
IMPORTANT: Start each day's task description with "Day X: " where X is the day number (e.g., "Day 1: ", "Day 2: ").
Keep each daily task concise, actionable, positive, and easy to follow.
Focus on gradual progression.
Example for 'learn to meditate':
Day 1: Find a quiet space and sit comfortably for 2 minutes, focusing on your breath.
Day 2: Meditate for 3 minutes today. Notice any sensations without judgment.
Day 3: Extend your meditation to 5 minutes. Try a guided meditation if you like.
Generate only the plan itself.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or gpt-4 if available and preferred
      messages: [
        { role: 'system', content: 'You are an inspiring AI habit coach providing daily plans.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500, // Increased slightly for potentially longer plans
      temperature: 0.6, // Slightly lower for more focused and structured output
    });

    const text = response.choices?.[0]?.message?.content || '';

    // Enhanced parsing for "Day X: task" format
    const rawSteps = text.split('\n').filter(line => line.trim().length > 0);
    const structuredSteps: Array<{ dayLabel: string; task: string }> = [];

    rawSteps.forEach(line => {
      const match = line.match(/^(Day\s*\d+):\s*(.*)/i);
      if (match && match[1] && match[2]) {
        structuredSteps.push({
          dayLabel: match[1].trim(), // "Day 1", "Day 2", etc.
          task: match[2].trim(),
        });
      } else if (structuredSteps.length > 0) {
        // If a line doesn't match but we have started parsing, append to the previous task (for multi-line tasks from AI)
        // This is a basic way to handle it; more robust parsing might be needed if AI is very inconsistent.
        // For now, we assume AI gives one line per day task as requested.
        // structuredSteps[structuredSteps.length - 1].task += ` ${line.trim()}`;
      }
    });

    if (structuredSteps.length === 0 && text.length > 0) {
      // Fallback if "Day X:" parsing fails but there's text.
      // This indicates the AI didn't follow the format.
      // We could return an error or try a simpler split. For now, let's indicate a format issue.
      console.warn("AI did not return the expected 'Day X:' format. Raw text:", text);
      // For simplicity, we'll treat the entire response as a single step, or return error.
      // Returning an error or a message to rephrase might be better.
      return NextResponse.json({ error: 'AI failed to generate a structured daily plan. Please try rephrasing your habit.' }, { status: 500 });
    }
    
    return NextResponse.json({ steps: structuredSteps });

  } catch (err: any) {
    console.error('OpenAI API error:', err);
    let errorMessage = 'AI failed to generate steps.';
    if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error.message;
    } else if (err.message) {
        errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}