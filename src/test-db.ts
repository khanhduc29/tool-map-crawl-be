// src/test-db.ts
import { db } from "./config/db";

(async () => {
  const res = await db.query("SELECT 1");
  console.log("DB OK", res.rows);
  process.exit(0);
})();
