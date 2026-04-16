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
    pgm.createTable("conversations", {
        publisher_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "CASCADE",
        },
        item_id: {
            type: "uuid",
            notNull: true,
            references: "rental_items(id)",
            onDelete: "CASCADE",
        },
        inquirer_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "CASCADE",
        },
        messages: {
            type: "jsonb",
            notNull: true,
            default: pgm.func("'[]'::jsonb"),
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
        },
    });

    pgm.addConstraint("conversations", "conversations_pkey", {
        primaryKey: ["publisher_id", "item_id", "inquirer_id"],
    });

    pgm.addConstraint("conversations", "conversations_no_self_chat", {
        check: "publisher_id != inquirer_id",
    });

    pgm.createIndex("conversations", "inquirer_id");
    pgm.createIndex("conversations", "item_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("conversations");
};
