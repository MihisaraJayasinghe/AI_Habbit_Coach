import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const habits = await db.collection("habits").find().toArray();
  return NextResponse.json(habits);
}

export async function POST(request) {
  const { name } = await request.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db
    .collection("habits")
    .insertOne({ name, logs: [], createdAt: new Date() });
  return NextResponse.json(result.ops ? result.ops[0] : { insertedId: result.insertedId });
}