// import { db } from "../config/db";

// async function init() {
//   await db.query(`
//     CREATE TABLE IF NOT EXISTS crawl_jobs (
//       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//       raw_keywords TEXT NOT NULL,
//       address TEXT,
//       region VARCHAR(50),
//       total_limit INT NOT NULL,
//       delay_seconds INT NOT NULL,
//       deep_scan BOOLEAN DEFAULT false,
//       status VARCHAR(20) DEFAULT 'pending',
//       created_at TIMESTAMP DEFAULT NOW()
//     );
//   `);

//   console.log("✅ Tables ready");
//   process.exit(0);
// }

// init();
import { db } from "../config/db";

async function init() {
  console.log("🔥 RESET DATABASE (DEV MODE)");

  // 🧨 DROP CON TRƯỚC
  await db.query(`
    DROP TABLE IF EXISTS crawl_tasks CASCADE;
  `);

  await db.query(`
    DROP TABLE IF EXISTS crawl_jobs CASCADE;
  `);

  // 🧩 JOB CHA
  await db.query(`
    CREATE TABLE crawl_jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      raw_keywords TEXT NOT NULL,
      address TEXT,
      region VARCHAR(50),

      total_limit INT NOT NULL,
      delay_seconds INT NOT NULL,
      deep_scan BOOLEAN DEFAULT false,

      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // 🧩 TASK CON – WORKER XỬ LÝ
  await db.query(`
    CREATE TABLE crawl_tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id UUID REFERENCES crawl_jobs(id) ON DELETE CASCADE,

      keyword TEXT NOT NULL,
      address TEXT,
      region VARCHAR(50),

      result_limit INT DEFAULT 50,
      delay_seconds INT DEFAULT 5,
      deep_scan BOOLEAN DEFAULT false,

      status VARCHAR(20) DEFAULT 'pending',
      result JSONB,
      error_message TEXT,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
    );
  `);

  console.log("✅ Tables crawl_jobs & crawl_tasks recreated");
  process.exit(0);
}

init();
