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
    pgm.addColumn("rental_items", {
        slug: {
            type: "varchar(160)",
        },
    });

    pgm.sql(
        "UPDATE rental_items SET slug = CONCAT('item-', id) WHERE slug IS NULL"
    );

    pgm.alterColumn("rental_items", "slug", {
        notNull: true,
    });

    pgm.createIndex("rental_items", "slug", { unique: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropIndex("rental_items", "slug");
    pgm.dropColumn("rental_items", "slug");
};
