"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrawlTaskDetail = exports.updateCrawlTask = exports.getCrawlTasks = void 0;
const db_1 = require("../config/db");
const getCrawlTasks = async (req, res) => {
    const { status, jobId } = req.query;
    try {
        let query = `
      SELECT *
      FROM public.crawl_tasks
    `;
        const params = [];
        const conditions = [];
        if (status) {
            params.push(status);
            conditions.push(`status = $${params.length}`);
        }
        if (jobId) {
            params.push(jobId);
            conditions.push(`job_id = $${params.length}`);
        }
        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }
        query += ` ORDER BY created_at ASC`;
        const result = await db_1.db.query(query, params);
        return res.json({
            total: result.rowCount,
            data: result.rows,
        });
    }
    catch (err) {
        console.error("❌ getCrawlTasks error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getCrawlTasks = getCrawlTasks;
// export const updateCrawlTask = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { status, result, error_message } = req.body;
//   console.log("🔥 HIT updateCrawlTask", new Date().toISOString());
//   if (!id) {
//     return res.status(400).json({ message: "Missing task id" });
//   }
//   if (!status) {
//     return res.status(400).json({ message: "Missing status" });
//   }
//   try {
//     const query = `
//       UPDATE crawl_tasks
//       SET
//         status = $1,
//         result = $2,
//         error_message = $3,
//         updated_at = NOW()
//       WHERE id = $4
//       RETURNING *
//     `;
//     const params = [
//       status,
//       result ? JSON.stringify(result) : null,
//       error_message || null,
//       id,
//     ];
//     const updated = await db.query(query, params);
//     if (updated.rowCount === 0) {
//       return res.status(404).json({ message: "Task not found" });
//     }
//     return res.json({
//       message: "Task updated",
//       data: updated.rows[0],
//     });
//   } catch (err) {
//     console.error("❌ updateCrawlTask error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
const updateCrawlTask = async (req, res) => {
    const { id } = req.params;
    const { status, result, error_message } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Missing task id" });
    }
    if (!status) {
        return res.status(400).json({ message: "Missing status" });
    }
    const client = await db_1.db.connect();
    try {
        await client.query("BEGIN");
        // 1️⃣ Update TASK
        const taskResult = await client.query(`
      UPDATE crawl_tasks
      SET
        status = $1,
        result = $2,
        error_message = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `, [
            status,
            result ? JSON.stringify(result) : null,
            error_message || null,
            id,
        ]);
        if (taskResult.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Task not found" });
        }
        const task = taskResult.rows[0];
        const jobId = task.job_id;
        // 2️⃣ Lấy trạng thái TẤT CẢ task của job
        const statsResult = await client.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending')     AS pending,
        COUNT(*) FILTER (WHERE status = 'processing')  AS processing,
        COUNT(*) FILTER (WHERE status = 'success')     AS success,
        COUNT(*) FILTER (WHERE status = 'error')       AS error,
        COUNT(*)                                      AS total
      FROM public.crawl_tasks
      WHERE job_id = $1
      `, [jobId]);
        const stats = statsResult.rows[0];
        // 3️⃣ Suy ra JOB STATUS
        let jobStatus = "pending";
        if (Number(stats.processing) > 0) {
            jobStatus = "processing";
        }
        else if (Number(stats.error) > 0) {
            jobStatus = "error";
        }
        else if (Number(stats.success) === Number(stats.total)) {
            jobStatus = "success";
        }
        // 4️⃣ Update JOB
        await client.query(`
      UPDATE crawl_jobs
      SET
        status = $1
      WHERE id = $2
      `, [jobStatus, jobId]);
        await client.query("COMMIT");
        return res.json({
            message: "Task & Job updated",
            task,
            jobStatus,
        });
    }
    catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ updateCrawlTask error:", err);
        return res.status(500).json({ message: "Server error" });
    }
    finally {
        client.release();
    }
};
exports.updateCrawlTask = updateCrawlTask;
const getCrawlTaskDetail = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Missing task id" });
    }
    try {
        const result = await db_1.db.query(`
      SELECT *
      FROM public.crawl_tasks
      WHERE id = $1
      `, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.json({
            data: result.rows[0],
        });
    }
    catch (err) {
        console.error("❌ getCrawlTaskDetail error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getCrawlTaskDetail = getCrawlTaskDetail;
