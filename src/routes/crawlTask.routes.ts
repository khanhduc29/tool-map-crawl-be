import express from "express";
import { getCrawlTaskDetail, getCrawlTasks, updateCrawlTask } from "../controllers/crawlTask.controller";

const router = express.Router();

router.get("/", getCrawlTasks); // 👈 GET TASK
// detail (⚠️ PHẢI ĐẶT TRƯỚC /:id PUT nếu có conflict)
router.get("/:id", getCrawlTaskDetail);
router.put("/:id", updateCrawlTask);

export default router;
