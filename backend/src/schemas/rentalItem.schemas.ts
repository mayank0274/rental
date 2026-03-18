import { z } from "zod";

const StatusEnum = z.enum(["available", "unavailable", "paused"]);

export const RentalItemIdSchema = z.string().uuid("Invalid rental item id");

export const CreateRentalItemSchema = z.object({
    description: z.string().trim().min(1, "Description is required"),
    price_per_day: z.coerce.number().min(1, "Price per day must be at least 1"),
    images: z.array(z.string().url("Image must be a valid URL")).min(1),
    category: z.string().trim().min(1, "Category is required").max(50),
    status: StatusEnum.default("available"),
    location_city: z.string().trim().min(1).max(80).optional(),
    location_state: z.string().trim().min(1).max(80).optional(),
    location_country: z.string().trim().min(1).max(80).optional(),
});

export type CreateRentalItemInput = z.infer<typeof CreateRentalItemSchema>;

export const UpdateRentalItemSchema = z
    .object({
        description: z.string().trim().min(1).optional(),
        price_per_day: z.coerce
            .number()
            .min(1, "Price per day must be at least 1")
            .optional(),
        images: z.array(z.string().url()).min(1).optional(),
        category: z.string().trim().min(1).max(50).optional(),
        status: StatusEnum.optional(),
        location_city: z.string().trim().min(1).max(80).optional(),
        location_state: z.string().trim().min(1).max(80).optional(),
        location_country: z.string().trim().min(1).max(80).optional(),
    })
    .refine((data) => Object.values(data).some((v) => v !== undefined), {
        message: "At least one field is required",
    });

export type UpdateRentalItemInput = z.infer<typeof UpdateRentalItemSchema>;

export const PublicListQuerySchema = z.object({
    category: z.string().trim().min(1).max(50).optional(),
});

export type PublicListQueryInput = z.infer<typeof PublicListQuerySchema>;
