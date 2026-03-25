import { z } from "zod";
import { RENTAL_ITEM_CATEGORIES } from "../constants/rentalItem.constants.ts";

const StatusEnum = z.enum(["available", "unavailable", "paused"]);
const CategoryEnum = z.enum(RENTAL_ITEM_CATEGORIES);
const SlugSchema = z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly");

export const RentalItemIdSchema = z.string().uuid("Invalid rental item id");

export const CreateRentalItemSchema = z.object({
    description: z.string().trim().min(1, "Description is required"),
    slug: SlugSchema,
    price_per_day: z.coerce.number().min(1, "Price per day must be at least 1"),
    images: z.array(z.string().url("Image must be a valid URL")).min(1),
    category: CategoryEnum,
    status: StatusEnum.default("available"),
    location_city: z.string().trim().min(1).max(80).optional(),
    location_state: z.string().trim().min(1).max(80).optional(),
    location_country: z.string().trim().min(1).max(80).optional(),
});

export type CreateRentalItemInput = z.infer<typeof CreateRentalItemSchema>;

export const UpdateRentalItemSchema = z
    .object({
        description: z.string().trim().min(1).optional(),
        slug: SlugSchema.optional(),
        price_per_day: z.coerce
            .number()
            .min(1, "Price per day must be at least 1")
            .optional(),
        images: z.array(z.string().url()).min(1).optional(),
        category: CategoryEnum.optional(),
        status: StatusEnum.optional(),
        location_city: z.string().trim().min(1).max(80).optional(),
        location_state: z.string().trim().min(1).max(80).optional(),
        location_country: z.string().trim().min(1).max(80).optional(),
    })
    .refine((data) => Object.values(data).some((v) => v !== undefined), {
        message: "At least one field is required",
    });

export type UpdateRentalItemInput = z.infer<typeof UpdateRentalItemSchema>;

const OptionalPositiveInt = z.preprocess(
    (value) => {
        if (typeof value !== "string") return value;
        if (value.trim() === "") return undefined;
        return value;
    },
    z.coerce.number().int().min(1).max(100).optional()
);

export const PublicListQuerySchema = z.object({
    category: z.preprocess(
        (value) => {
            if (typeof value !== "string") return value;
            const trimmed = value.trim();
            if (trimmed === "" || trimmed.toLowerCase() === "all")
                return undefined;
            return trimmed;
        },
        CategoryEnum.optional()
    ),
    page: OptionalPositiveInt,
    limit: OptionalPositiveInt,
});

export type PublicListQueryInput = z.infer<typeof PublicListQuerySchema>;
