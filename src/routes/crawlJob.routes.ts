import express from "express";
import { createCrawlJob, getCrawlJobs } from "../controllers/crawlJob.controller";

const router = express.Router();

router.post("/", createCrawlJob);
router.get("/", getCrawlJobs); 

export default router;
