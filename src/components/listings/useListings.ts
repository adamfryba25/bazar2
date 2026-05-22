"use client";

import { useEffect, useState } from "react";
import type { ListingCategory, ListingStatus } from "@/components/data/listings";

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: string | null;
  isFree: boolean;
  category: ListingCategory;
  status: ListingStatus;
  contact: string;
  imageUrl: string | null;
  createdAt: string;
};

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [ready, setReady] = useState(false);

  const fetchListings = () => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setReady(true);
      })
      .catch(() => setReady(true));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const addListing = async (listing: {
    title: string;
    description: string;
    price: number | null;
    isFree: boolean;
    category: ListingCategory;
    status: ListingStatus;
    contact: string;
    imageUrl: string | null;
  }) => {
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listing),
    });
    const newListing = await res.json();
    setListings((prev) => [newListing, ...prev]);
  };

  const updateListing = async (id: string, listing: {
    title: string;
    description: string;
    price: number | null;
    isFree: boolean;
    category: ListingCategory;
    contact: string;
    imageUrl: string | null;
  }) => {
    console.log("fetch URL:", `/api/listings/${id}`);
    console.log("data:", listing);
    const res = await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listing),
    });
    console.log("response status:", res.status);
    const updated = await res.json();
    console.log("updated:", updated);
    setListings((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
  };

  const updateListingStatus = async (id: string, status: ListingStatus) => {
    await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteListing = async (id: string) => {
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    listings,
    addListing,
    updateListing,
    updateListingStatus,
    deleteListing,
    refetch: fetchListings,
    ready,
  };
}
