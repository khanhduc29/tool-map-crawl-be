"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crawlTask_controller_1 = require("../controllers/crawlTask.controller");
const router = express_1.default.Router();
router.get("/", crawlTask_controller_1.getCrawlTasks); // 👈 GET TASK
// detail (⚠️ PHẢI ĐẶT TRƯỚC /:id PUT nếu có conflict)
router.get("/:id", crawlTask_controller_1.getCrawlTaskDetail);
router.put("/:id", crawlTask_controller_1.updateCrawlTask);
exports.default = router;
