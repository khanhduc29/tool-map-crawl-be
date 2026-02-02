"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("🔍 CREATE DB ENV:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
});
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres", // ⚠️ LUÔN postgres
});
(async () => {
    try {
        await pool.query("CREATE DATABASE maps_crawler");
        console.log("✅ Database maps_crawler CREATED");
    }
    catch (err) {
        if (err.code === "42P04") {
            console.log("ℹ️ Database maps_crawler ALREADY EXISTS");
        }
        else {
            console.error("❌ Create DB error:", err);
        }
    }
    finally {
        await pool.end();
    }
})();
