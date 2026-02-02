import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 DB ENV CHECK:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

export const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});
