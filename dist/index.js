"use strict";
// import app from "./app";
// import { db } from "./config/db";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// console.log("🔥 INDEX FILE LOADED");
// async function initTables() {
//   console.log("🚀 Initializing database tables...");
//   // log DB đang kết nối
//   const dbInfo = await db.query(
//     "SELECT current_database(), current_schema()"
//   );
//   console.log("🧪 Connected DB:", dbInfo.rows[0]);
//   await db.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS crawl_jobs (
//       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//       raw_keywords TEXT NOT NULL,
//       address TEXT,
//       region VARCHAR(50),
//       total_limit INT NOT NULL,
//       delay_seconds INT NOT NULL,
//       deep_scan BOOLEAN DEFAULT false,
//       deep_scan_website BOOLEAN DEFAULT false,
//       status VARCHAR(20) DEFAULT 'pending',
//       created_at TIMESTAMP DEFAULT NOW()
//     )
//   `);
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS crawl_tasks (
//       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//       job_id UUID REFERENCES crawl_jobs(id) ON DELETE CASCADE,
//       keyword TEXT NOT NULL,
//       address TEXT,
//       region VARCHAR(50),
//       result_limit INT NOT NULL,
//       delay_seconds INT NOT NULL,
//       deep_scan BOOLEAN DEFAULT false,
//       deep_scan_website BOOLEAN DEFAULT false,
//       status VARCHAR(20) DEFAULT 'pending',
//       result JSONB,
//       error_message TEXT,
//       created_at TIMESTAMP DEFAULT NOW(),
//       updated_at TIMESTAMP
//     )
//   `);
//   console.log("✅ All tables are ready");
// }
// (async () => {
//   try {
//     await initTables();
//     const PORT = Number(process.env.PORT || 10000);
//     app.listen(PORT, "0.0.0.0", () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ INIT FAILED", err);
//     process.exit(1);
//   }
// })();
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
console.log("🔥 INDEX FILE LOADED");
/**
 * Ensure column exists, if not → add it
 */
async function ensureColumn(table, column, definition) {
    const check = await db_1.db.query(`
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = $1 AND column_name = $2
    `, [table, column]);
    if (check.rowCount === 0) {
        console.log(`➕ Adding column "${column}" to table "${table}"`);
        await db_1.db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
    else {
        console.log(`✅ Column "${column}" already exists in "${table}"`);
    }
}
async function initTables() {
    console.log("🚀 Initializing database tables...");
    // 🔎 Log DB đang kết nối
    const dbInfo = await db_1.db.query("SELECT current_database(), current_schema()");
    console.log("🧪 Connected DB:", dbInfo.rows[0]);
    // 🔐 Extension cần thiết
    await db_1.db.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    // 🧱 Base tables (KHÔNG phụ thuộc schema cũ)
    await db_1.db.query(`
    CREATE TABLE IF NOT EXISTS crawl_jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      raw_keywords TEXT NOT NULL,
      address TEXT,
      region VARCHAR(50),
      total_limit INT NOT NULL,
      delay_seconds INT NOT NULL,
      deep_scan BOOLEAN DEFAULT false,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
    await db_1.db.query(`
    CREATE TABLE IF NOT EXISTS crawl_tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id UUID REFERENCES crawl_jobs(id) ON DELETE CASCADE,
      keyword TEXT NOT NULL,
      address TEXT,
      region VARCHAR(50),
      result_limit INT NOT NULL,
      delay_seconds INT NOT NULL,
      deep_scan BOOLEAN DEFAULT false,
      status VARCHAR(20) DEFAULT 'pending',
      result JSONB,
      error_message TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    )
  `);
    // 🧠 Self-heal schema (quan trọng)
    await ensureColumn("crawl_jobs", "deep_scan_website", "BOOLEAN DEFAULT false");
    await ensureColumn("crawl_tasks", "deep_scan_website", "BOOLEAN DEFAULT false");
    console.log("✅ All tables & columns are ready");
}
(async () => {
    try {
        await initTables();
        const PORT = Number(process.env.PORT || 10000);
        app_1.default.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ INIT FAILED", err);
        process.exit(1);
    }
})();
