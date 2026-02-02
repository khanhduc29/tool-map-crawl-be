// import app from "./app";

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
import app from "./app";
import { db } from "./config/db";

async function initTables() {
  console.log("🚀 Initializing database tables...");

  await db.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  await db.query(`
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

  await db.query(`
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

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ INIT FAILED", err);
    process.exit(1);
  }
})();
