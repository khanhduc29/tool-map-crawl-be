import { Request, Response } from "express";
import { db } from "../config/db";
import { parseKeywords } from "../utils/keyword.util";
import { CreateCrawlJobRequest } from "../types/crawl";

export const createCrawlJob = async (
  req: Request<{}, {}, CreateCrawlJobRequest>,
  res: Response
) => {
  const {
    keyword,
    address,
    limit,
    delay,
    region,
    deepScan = false,
  } = req.body;

  if (!keyword || !limit || !delay) {
    return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
  }

  const keywords = parseKeywords(keyword);

  if (keywords.length === 0) {
    return res.status(400).json({ message: "Keyword rỗng" });
  }

  // 1️⃣ Create JOB
  const jobResult = await db.query(
    `
    INSERT INTO crawl_jobs
      (raw_keywords, address, region, total_limit, delay_seconds, deep_scan)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
    `,
    [keyword, address, region, limit, delay, deepScan]
  );

  const job = jobResult.rows[0];

  // 2️⃣ Split limit cho từng task
  const perTask = Math.floor(limit / keywords.length);
  const remainder = limit % keywords.length;

  const tasks = [];

  for (let i = 0; i < keywords.length; i++) {
    const taskLimit = i === 0 ? perTask + remainder : perTask;

    const taskResult = await db.query(
      `
      INSERT INTO crawl_tasks
        (job_id, keyword, address, region, result_limit, delay_seconds, deep_scan)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [job.id, keywords[i], address, region, taskLimit, delay, deepScan]
    );

    tasks.push(taskResult.rows[0]);
  }

  return res.json({
    job,
    tasks,
  });
};


export const getCrawlJobs = async (req: Request, res: Response) => {
  const { status } = req.query;

  try {
    let query = `
      SELECT *
      FROM crawl_jobs
    `;
    const params: any[] = [];

    if (status) {
      query += ` WHERE status = $1`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await db.query(query, params);

    return res.json({
      total: result.rowCount,
      data: result.rows,
    });
  } catch (err) {
    console.error("❌ getCrawlJobs error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};