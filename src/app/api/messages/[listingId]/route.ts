import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ listingId: string }> }) {
  try {
    const { listingId } = await params;
    console.log("GET listingId:", listingId);
    const all = await db
      .select()
      .from(messages)
      .where(eq(messages.listingId, listingId))
      .orderBy(asc(messages.createdAt));
    return NextResponse.json(all);
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ listingId: string }> }) {
  try {
    const { listingId } = await params;
    console.log("POST listingId from params:", listingId);

    const body = await req.json();
    console.log("POST messages body:", body);

    if (!body.userId || !body.userName || !body.text) {
      return NextResponse.json({ error: "Chybí povinná pole" }, { status: 400 });
    }

    const newMessage = await db.insert(messages).values({
      listingId,
      userId: body.userId,
      userName: body.userName,
      text: body.text,
    }).returning();

    return NextResponse.json(newMessage[0]);
  } catch (error) {
    console.error("POST messages error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
