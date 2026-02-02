"use strict";
// import app from "./app";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
console.log("🔥 INDEX FILE LOADED");
async function initTables() {
    console.log("🚀 Initializing database tables...");
    // log DB đang kết nối
    const dbInfo = await db_1.db.query("SELECT current_database(), current_schema()");
    console.log("🧪 Connected DB:", dbInfo.rows[0]);
    await db_1.db.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
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
    console.log("✅ All tables are ready");
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
