import { db } from "@/db";
import { listings } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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
    console.error("GET error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    console.log("POST userId:", userId); // ← DEBUG

    if (!userId) {
      return NextResponse.json({ error: "Nejsi přihlášen" }, { status: 401 });
    }

    const body = await request.json();
    const NewListing = await db.insert(listings).values({
      userId,
      title: body.title,
      description: body.description,
      price: body.price?.toString() ?? null,
      isFree: body.isFree,
      category: body.category,
      status: "available",
      contact: body.contact,
      imageUrl: body.imageUrl ?? null,
      color: body.color ?? "#ffffff",
      locationAddress: body.location?.address ?? null,
      locationLat: body.location?.lat ?? null,
      locationLng: body.location?.lng ?? null,
    }).returning();
    return NextResponse.json(NewListing[0]);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
