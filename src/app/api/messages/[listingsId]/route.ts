import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(_req: Request, { params }: { params: Promise<{ listingId: string }> }) {
  try {
    const { listingId } = await params;
    const all = await db
      .select()
      .from(messages)
      .where(eq(messages.listingId, listingId))
      .orderBy(asc(messages.createdAt));
    return NextResponse.json(all);
  } catch {
    return NextResponse.json({ error: "Chyba při načítání zpráv" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ listingId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Nejsi přihlášen" }, { status: 401 });
    }

    const { listingId } = await params;
    const body = await req.json();

    const newMessage = await db.insert(messages).values({
      listingId,
      userId,
      userName: body.userName,
      text: body.text,
    }).returning();

    return NextResponse.json(newMessage[0])
  } catch {
    return NextResponse.json({ error: "Chyba při odesílání zprávy" }, { status: 500 });
  }
}
