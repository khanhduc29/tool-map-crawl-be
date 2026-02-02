"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/test-db.ts
const db_1 = require("./config/db");
(async () => {
    const res = await db_1.db.query("SELECT 1");
    console.log("DB OK", res.rows);
    process.exit(0);
})();
