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
  // UUID support
  pgm.createExtension("pgcrypto", { ifNotExists: true });

  // users table
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: {
      type: "varchar(50)",
      notNull: true,
    },
    email: {
      type: "varchar(100)",
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: "text",
      notNull: true,
    },
    phone: {
      type: "varchar(10)",
      unique: true,
    },
    is_verified: {
      type: "boolean",
      notNull: true,
      default: false,
    },
    is_active: {
      type: "boolean",
      notNull: true,
      default: true,
    },
    role: {
      type: "varchar(20)",
      notNull: true,
      default: "user",
      check: "role IN ('user', 'admin')",
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
};




export const down = (pgm) => {
  pgm.dropTable("users");
};
