import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ listingId: string; messageId: string }> }
) {
  try {
    const { messageId } = await params;

    const existing = await db.select().from(messages).where(eq(messages.id, messageId));
    if (!existing[0]) {
      return NextResponse.json({ error: "Zpráva nenalezena" }, { status: 404 });
    }

    await db.delete(messages).where(eq(messages.id, messageId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE message error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
