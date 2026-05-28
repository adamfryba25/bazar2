import { db } from "@/db";
import { listings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.select().from(listings).where(eq(listings.id, id));
    if (!existing[0]) {
      return NextResponse.json({ error: "Inzerát nenalezen" }, { status: 404 });
    }

    // Ochrana vlastníka – při úpravě celého inzerátu (ne jen statusu)
    if (body.title !== undefined) {
      const { userId } = await auth();
      if (!userId || existing[0].userId !== userId) {
        return NextResponse.json({ error: "Nemáš oprávnění" }, { status: 403 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.isFree !== undefined) updateData.isFree = body.isFree;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.contact !== undefined) updateData.contact = body.contact;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.color !== undefined) updateData.color = body.color;        // ← NOVÉ

    const updated = await db
      .update(listings)
      .set(updateData)
      .where(eq(listings.id, id))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Nejsi přihlášen" }, { status: 401 });
    }

    const existing = await db.select().from(listings).where(eq(listings.id, id));
    if (!existing[0]) {
      return NextResponse.json({ error: "Inzerát nenalezen" }, { status: 404 });
    }

    if (existing[0].userId !== userId) {
      return NextResponse.json({ error: "Nemáš oprávnění" }, { status: 403 });
    }

    await db.delete(listings).where(eq(listings.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
