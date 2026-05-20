"use client";

import { useEffect, useState } from "react";
import {
  initialListings,
  type Listing,
  type ListingStatus,
} from "@/components/data/listings";

const STORAGE_KEY = "blogic-bazar-listings";

export function useListings() {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if(raw){
      try {
        setListings(JSON.parse(raw) as Listing[]);
      }
      catch{
        setListings(initialListings);
      }
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if(!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings, ready]);

  const addListing = (listing: Omit<Listing, "id">) => {
    const newListing: Listing = {
      ...listing,
      id: crypto.randomUUID(),
    };
    setListings((prev) => [newListing, ...prev]);
  };

  const updateListingStatus = (id: string, status: ListingStatus) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  return{
    listings,
    addListing,
    updateListingStatus,
    deleteListing,
    ready,
  };
}
