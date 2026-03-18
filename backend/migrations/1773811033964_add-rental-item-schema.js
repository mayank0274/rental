/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable("rental_items", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },
        user_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "cascade",
        },
        title: {
            type: "varchar(120)",
            notNull: true,
        },
        description: {
            type: "text",
            notNull: true,
        },
        price_per_day: {
            type: "numeric(10,2)",
            notNull: true,
            check: "price_per_day >= 0",
        },
        images: {
            type: "text[]",
            notNull: true,
            default: pgm.func("ARRAY[]::text[]"),
        },
        category: {
            type: "varchar(50)",
            notNull: true,
        },
        status: {
            type: "varchar(20)",
            notNull: true,
            default: "available",
            check: "status IN ('available', 'unavailable', 'paused')",
        },
        location_city: {
            type: "varchar(80)",
        },
        location_state: {
            type: "varchar(80)",
        },
        location_country: {
            type: "varchar(80)",
        },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
        updated_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp"),
            onUpdate: pgm.func("current_timestamp"),
        },
    });

    pgm.createIndex("rental_items", "user_id");
    pgm.createIndex("rental_items", "category");
    pgm.createIndex("rental_items", ["location_city", "location_state"]);
    pgm.createIndex("rental_items", "status");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("rental_items");
};
