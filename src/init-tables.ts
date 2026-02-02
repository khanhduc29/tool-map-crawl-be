import { db } from "./config/db";

async function initTables() {
  try {
    console.log("🚀 Initializing database tables...");

    await db.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // JOBS
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

    // TASKS  ❗ ĐÃ SỬA limit -> result_limit
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
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // RESULTS
    await db.query(`
      CREATE TABLE IF NOT EXISTS crawl_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID REFERENCES crawl_tasks(id) ON DELETE CASCADE,
        name TEXT,
        address TEXT,
        phone TEXT,
        website TEXT,
        rating FLOAT,
        total_reviews INT,
        opening_hours TEXT,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        url TEXT NOT NULL,
        crawled_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("✅ All tables are ready");
    process.exit(0);
  } catch (err) {
    console.error("❌ Init tables error:", err);
    process.exit(1);
  }
}

initTables();
