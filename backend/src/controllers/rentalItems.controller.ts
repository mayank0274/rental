import type { Request, Response } from "express";
import pool from "../db/postgres.ts";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.utils.ts";
import { ApiError, ApiSuccessRes } from "../utils/apiResponse.utils.ts";
import {
    CreateRentalItemSchema,
    PublicListQuerySchema,
    RentalItemIdSchema,
    UpdateRentalItemSchema,
} from "../schemas/rentalItem.schemas.ts";
import type { RentalItemRow } from "../types/rentalItem.types.ts";

export const createRentalItem = asyncErrorHandler(
    async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw ApiError.unauthorized();

        const parsed = CreateRentalItemSchema.safeParse(req.body);
        if (!parsed.success)
            throw ApiError.validationError(parsed.error.flatten().fieldErrors);

        const {
            title,
            description,
            slug,
            price_per_day,
            images,
            category,
            status,
            location_city,
            location_state,
            location_country,
        } = parsed.data;

        const { rows } = await pool.query<RentalItemRow>(
            `INSERT INTO rental_items
        (user_id, title, description, slug, price_per_day, images, category, status, location_city, location_state, location_country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
            [
                user.id,
                title,
                description,
                slug,
                price_per_day,
                images,
                category,
                status,
                location_city ?? null,
                location_state ?? null,
                location_country ?? null,
            ]
        );

        const item = rows[0];
        if (!item) throw ApiError.internal("Failed to create rental item");

        return res
            .status(201)
            .json(new ApiSuccessRes(201, "Rental item created", item));
    }
);

export const updateRentalItem = asyncErrorHandler(
    async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw ApiError.unauthorized();

        const idParsed = RentalItemIdSchema.safeParse(req.params.id);
        if (!idParsed.success) throw ApiError.validationError(idParsed.error.issues);
        const id = idParsed.data;

        const parsed = UpdateRentalItemSchema.safeParse(req.body);
        if (!parsed.success)
            throw ApiError.validationError(parsed.error.flatten().fieldErrors);

        const { rows: existing } = await pool.query<{ user_id: string }>(
            "SELECT user_id FROM rental_items WHERE id = $1 LIMIT 1",
            [id]
        );
        if (!existing[0]) throw ApiError.notFound("Rental item not found");
        if (existing[0].user_id !== user.id)
            throw ApiError.forbidden("You do not own this rental item");

        const updates: Array<{ key: string; value: unknown }> = [];
        const data = parsed.data;

        if (data.title !== undefined)
            updates.push({ key: "title", value: data.title });
        if (data.description !== undefined)
            updates.push({ key: "description", value: data.description });
        if (data.slug !== undefined)
            updates.push({ key: "slug", value: data.slug });
        if (data.price_per_day !== undefined)
            updates.push({ key: "price_per_day", value: data.price_per_day });
        if (data.images !== undefined)
            updates.push({ key: "images", value: data.images });
        if (data.category !== undefined)
            updates.push({ key: "category", value: data.category });
        if (data.status !== undefined)
            updates.push({ key: "status", value: data.status });
        if (data.location_city !== undefined)
            updates.push({ key: "location_city", value: data.location_city });
        if (data.location_state !== undefined)
            updates.push({ key: "location_state", value: data.location_state });
        if (data.location_country !== undefined)
            updates.push({ key: "location_country", value: data.location_country });

        const setClauses = updates.map(
            (u, i) => `${u.key} = $${i + 1}`
        );
        setClauses.push("updated_at = current_timestamp");

        const values = updates.map((u) => u.value);
        values.push(id, user.id);

        const { rows } = await pool.query<RentalItemRow>(
            `UPDATE rental_items
       SET ${setClauses.join(", ")}
     WHERE id = $${values.length - 1} AND user_id = $${values.length}
     RETURNING *`,
            values
        );

        const updated = rows[0];
        if (!updated) throw ApiError.internal("Failed to update rental item");

        return res
            .status(200)
            .json(new ApiSuccessRes(200, "Rental item updated", updated));
    }
);

export const deleteRentalItem = asyncErrorHandler(
    async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw ApiError.unauthorized();

        const idParsed = RentalItemIdSchema.safeParse(req.params.id);
        if (!idParsed.success) throw ApiError.validationError(idParsed.error.issues);
        const id = idParsed.data;

        const { rows: existing } = await pool.query<{ user_id: string }>(
            "SELECT user_id FROM rental_items WHERE id = $1 LIMIT 1",
            [id]
        );
        if (!existing[0]) throw ApiError.notFound("Rental item not found");
        if (existing[0].user_id !== user.id)
            throw ApiError.forbidden("You do not own this rental item");

        await pool.query("DELETE FROM rental_items WHERE id = $1", [id]);

        return res
            .status(200)
            .json(new ApiSuccessRes(200, "Rental item deleted"));
    }
);

export const getMyRentalItems = asyncErrorHandler(
    async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) throw ApiError.unauthorized();

        const { rows } = await pool.query<RentalItemRow>(
            "SELECT * FROM rental_items WHERE user_id = $1 ORDER BY created_at DESC",
            [user.id]
        );

        return res
            .status(200)
            .json(new ApiSuccessRes(200, "Your rental items", rows));
    }
);

export const listPublicRentalItems = asyncErrorHandler(
    async (req: Request, res: Response) => {
        const parsed = PublicListQuerySchema.safeParse(req.query);
        if (!parsed.success)
            throw ApiError.validationError(parsed.error.flatten().fieldErrors);

        const { category, page, limit } = parsed.data;
        const whereClauses: string[] = ["status = 'available'"];
        const filterValues: Array<string> = [];

        if (category) {
            filterValues.push(category);
            whereClauses.push(`category = $${filterValues.length}`);
        }

        const baseQuery = `FROM rental_items WHERE ${whereClauses.join(" AND ")}`;
        const shouldPaginate = page !== undefined || limit !== undefined;

        if (shouldPaginate) {
            const pageNumber = page ?? 1;
            const pageSize = limit ?? 20;
            const offset = (pageNumber - 1) * pageSize;

            const itemsQuery = `SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT $${
                filterValues.length + 1
            } OFFSET $${filterValues.length + 2}`;

            const itemsValues = [...filterValues, pageSize, offset];

            const [itemsResult, countResult] = await Promise.all([
                pool.query<RentalItemRow>(itemsQuery, itemsValues),
                pool.query<{ total: number }>(
                    `SELECT COUNT(*)::int AS total ${baseQuery}`,
                    filterValues
                ),
            ]);

            const total = countResult.rows[0]?.total ?? 0;
            const totalPages = Math.max(1, Math.ceil(total / pageSize));

            return res.status(200).json(
                new ApiSuccessRes(200, "Public rental items", {
                    items: itemsResult.rows,
                    pagination: {
                        page: pageNumber,
                        limit: pageSize,
                        total,
                        totalPages,
                        hasNext: pageNumber < totalPages,
                        hasPrev: pageNumber > 1,
                    },
                })
            );
        }

        const { rows } = await pool.query<RentalItemRow>(
            `SELECT * ${baseQuery} ORDER BY created_at DESC`,
            filterValues
        );

        return res.status(200).json(
            new ApiSuccessRes(200, "Public rental items", {
                items: rows,
                pagination: {
                    page: 1,
                    limit: rows.length,
                    total: rows.length,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: false,
                },
            })
        );
    }
);

export const getPublicRentalItemBySlug = asyncErrorHandler(
    async (req: Request, res: Response) => {
        const { slug } = req.params;

        if (!slug) throw ApiError.badRequest("Slug is required");

        const { rows } = await pool.query<any>(
            `SELECT 
                ri.*, 
                u.name as publisher_name, 
                u.email as publisher_email, 
                u.phone as publisher_phone
            FROM rental_items ri
            JOIN users u ON ri.user_id = u.id
            WHERE ri.slug = $1 
            LIMIT 1`,
            [slug]
        );

        const item = rows[0];
        if (!item) throw ApiError.notFound("Rental item not found");

        const formattedItem = {
            ...item,
            publisher: {
                name: item.publisher_name,
                email: item.publisher_email,
                phone: item.publisher_phone,
            },
        };

        // Remove the flat joined columns
        delete formattedItem.publisher_name;
        delete formattedItem.publisher_email;
        delete formattedItem.publisher_phone;

        return res
            .status(200)
            .json(new ApiSuccessRes(200, "Rental item details retrieved", formattedItem));
    }
);
