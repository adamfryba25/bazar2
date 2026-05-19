export type ListingStatus = "avaible" | "reserved" | "sold";

export type ListingCategories =
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
    category: ListingCategories,
    status: ListingStatus,
    contact: string
  };

  export const categories : ListingCategories[] = [
    "Nábytek",
    "Dětské věci",
    "Oblečení",
    "Elektronika",
    "Knihy",
    "Ostatní"
  ];

  export const statuses : {value: ListingStatus; label: string}[] = [
    { value: "avaible", label: "Dostupné" },
    { value: "reserved", label: "Rezervované" },
    { value: "sold", label: "Prodáno / předáno" }
  ]
