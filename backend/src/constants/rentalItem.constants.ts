export const RENTAL_ITEM_CATEGORIES = [
    "bikes",
    "cars",
    "tools",
    "cameras",
    "electronics",
    "furniture",
    "sports",
    "outdoor",
    "party",
    "baby",
    "music",
    "costumes",
    "books",
    "other",
] as const;

export type RentalItemCategory = (typeof RENTAL_ITEM_CATEGORIES)[number];
