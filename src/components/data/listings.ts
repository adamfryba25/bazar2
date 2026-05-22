export type ListingStatus = "available" | "reserved" | "sold";

export type ListingCategory =
  | "Nábytek"
  | "Dětské věci"
  | "Oblečení"
  | "Elektronika"
  | "Knihy"
  | "Ostatní";

export type Listing = {
  id: string,
  title: string,
  description: string,
  price: number | null,
  isFree: boolean,
  category: ListingCategory,
  status: ListingStatus,
  contact: string,
  imageUrl: string | null,
};

export const categories: ListingCategory[] = [
  "Nábytek",
  "Dětské věci",
  "Oblečení",
  "Elektronika",
  "Knihy",
  "Ostatní",
];

export const statuses: { value: ListingStatus; label: string }[] = [
  { value: "available", label: "Dostupné" },
  { value: "reserved", label: "Rezervováno" },
  { value: "sold", label: "Prodáno / předáno" },
];

export const initialListings: Listing[] = [
  {
    id: "1",
    title: "Iphone 13 Pro Max",
    description: "Prodám Iphone 13 Pro Max, stav jako nový, bez škrábanců.",
    price: 12000,
    isFree: false,
    category: "Elektronika",
    status: "available",
    contact: "adam@blogic.cz",
    imageUrl: null,
  },
  {
    id: "2",
    title: "Horské kolo",
    description: "Prodám horské kolo, používáné, ale v dobrém stavu.",
    price: 8000,
    isFree: false,
    category: "Ostatní",
    status: "reserved",
    contact: "martin.k@seznam.cz",
    imageUrl: null,
  },
  {
    id: "3",
    title: "Playstation 1",
    description: "Prodám Playstation 1, funkční, ale s kosmetickými vadami",
    price: 4000,
    isFree: false,
    category: "Elektronika",
    status: "sold",
    contact: "retro.gaming@gmail.com",
    imageUrl: null,
  },
];
