export interface RentalItemRow {
    id: string;
    user_id: string;
    description: string;
    price_per_day: string;
    images: string[];
    category: string;
    status: "available" | "unavailable" | "paused";
    location_city: string | null;
    location_state: string | null;
    location_country: string | null;
    created_at: Date;
    updated_at: Date;
}
