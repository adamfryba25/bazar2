import { db } from "@/db";
import { listings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await db
      .update(listings)
      .set({ status: body.status })
      .where(eq(listings.id, id))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: "Chyba při aktualizaci" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(listings).where(eq(listings.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Chyba při mazání" }, { status: 500 });
  }
}
