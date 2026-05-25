import { db } from "@/db";
import { listings } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const all = await db.select().from(listings).orderBy(desc(listings.createdAt));
    return NextResponse.json(all.map((l) => ({
      ...l,
      location: l.locationLat && l.locationLng
        ? { address: l.locationAddress, lat: l.locationLat, lng: l.locationLng }
        : null,
    })));
  } catch (error) {
    return NextResponse.json({ error: "Chyba při načítání" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newListing = await db.insert(listings).values({
      title: body.title,
      description: body.description,
      price: body.price?.toString() ?? null,
      isFree: body.isFree,
      category: body.category,
      status: "available",
      contact: body.contact,
      imageUrl: body.imageUrl ?? null,
      locationAddress: body.location?.address ?? null,
      locationLat: body.location?.lat ?? null,
      locationLng: body.location?.lng ?? null,
    }).returning();
    return NextResponse.json(newListing[0]);
  } catch (error) {
    return NextResponse.json({ error: "Chyba při vytváření" }, { status: 500 });
  }
}
