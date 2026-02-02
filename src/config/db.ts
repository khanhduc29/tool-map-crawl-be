// import { Pool } from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// console.log("🔍 DB ENV CHECK:", {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
// });

// export const db = new Pool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.on("connect", () => {
//   console.log("✅ PostgreSQL connected");
// });
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === "production";

console.log("🔎 ===== DB ENV DEBUG =====");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("isProduction:", isProduction);

if (isProduction) {
  console.log("👉 Using DATABASE_URL (Render)");
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL
      ? process.env.DATABASE_URL.replace(/:\/\/.*@/, "://***@")
      : "❌ NOT FOUND"
  );
} else {
  console.log("👉 Using LOCAL Postgres");
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_PORT:", process.env.DB_PORT);
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_NAME:", process.env.DB_NAME);
}

console.log("🔎 =========================");

export const db = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }
);

db.on("connect", async (client) => {
  console.log("✅ PostgreSQL connected");

  try {
    const res = await client.query("SELECT current_database(), current_schema()");
    console.log("🧪 Connected DB:", res.rows[0]);
  } catch (err) {
    console.error("❌ Test query failed", err);
  }
});

db.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err);
});
