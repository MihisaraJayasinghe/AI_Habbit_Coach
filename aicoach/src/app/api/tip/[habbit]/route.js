import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(request, { params }) {
  const { habit } = params;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a friendly habit coach." },
      { role: "user", content: `Give me a short tip for building the habit: ${habit}` },
    ],
  });
  const tip = completion.choices?.[0]?.message?.content || "";
  return NextResponse.json({ habit, tip });
}