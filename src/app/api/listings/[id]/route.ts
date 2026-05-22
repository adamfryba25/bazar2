import { db } from "@/db";
import { listings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NetworkIcon } from "lucide-react";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (body.status !== undefined) updateData.status = body.status;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price?.toString() ?? null;
    if (body.isFree !== undefined) updateData.isFree = body.isFree;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.contact !== undefined) updateData.contact = body.contact;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;

    const updated = await db
      .update(listings)
      .set(updateData)
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
