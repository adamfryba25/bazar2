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
  location?: {
    address: string,
    lat: number,
    lng: number,
  },
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
    description: "Prodám Iphone 13 Pro Max, stav jako nový, bez škrábanců",
    price: 12000,
    isFree: false,
    category: "Elektronika",
    status: "available",
    contact: "adam@blogic.cz",
    imageUrl: null,
    location: {
      address: "Praha, Česká republika",
      lat: 50.0755,
      lng: 14.4378,
    },
  },
  {
    id: "2",
    title: "Horské kolo",
    description: "Prodám horské kolo, používané, ale v dobrém stavu",
    price: 8000,
    isFree: false,
    category: "Ostatní",
    status: "reserved",
    contact: "martin.k@seznam.cz",
    imageUrl: null,
    location: {
      address: "Brno, Česká Republika",
      lat: 49.1951,
      lng: 16.6068,
    },
  },
  {
    id: "3",
    title: "Playstation 1",
    description: "Prodám Playstation 1, funkční, ale s kosmetyckými vadami",
    price: 4000,
    isFree: false,
    category: "Elektronika",
    status: "sold",
    contact: "retro.gaming@gmail.com",
    imageUrl: null,
    location: {
      address: "Ostrava, Česká Republika",
      lat: 49.8209,
      lng: 18.2625,
    },
  },
];
