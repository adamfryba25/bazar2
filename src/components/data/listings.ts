export type ListingStatus = "available" | "reserved" | "sold";

export type ListingCategory =
  | "Nábytek"
  | "Dětské věci"
  | "Oblečení"
  | "Elektronika"
  | "Knihy"
  | "Ostatní";

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  isFree: boolean;
  category: ListingCategory;
  status: ListingStatus;
  contact: string;
  imageUrl: string | null;
  color?: string;
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
};

export const categories: ListingCategory[] = [
  "Nábytek",
  "Dětské věci",
  "Oblečení",
  "Elektronika",
  "Knihy",
  "Ostatní",
];

export const categoryColors: Record<ListingCategory, string> = {
  "Nábytek": "#fff8e1",
  "Dětské věci": "#fce4ec",
  "Oblečení": "#f3e5f5",
  "Elektronika": "#e3f2fd",
  "Knihy": "#e0f2f1",
  "Ostatní": "#f5f5f5",
};

export const statuses: { value: ListingStatus; label: string }[] = [
  { value: "available", label: "Dostupné" },
  { value: "reserved", label: "Rezervováno" },
  { value: "sold", label: "Prodáno / předáno" },
];

export const initialListings: Listing[] = [];
