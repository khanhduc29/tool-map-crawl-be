"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const crawlJob_routes_1 = __importDefault(require("./routes/crawlJob.routes"));
const crawlTask_routes_1 = __importDefault(require("./routes/crawlTask.routes"));
const app = (0, express_1.default)();
// ✅ CORS (QUAN TRỌNG)
app.use((0, cors_1.default)({
    origin: [
        "https://tool-map-crawl-fe.vercel.app",
        "http://localhost:5173",
    ],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 👇 BẮT BUỘC CHO RENDER
app.get("/", (_req, res) => {
    res.status(200).send("OK");
});
app.use("/api/crawl-jobs", crawlJob_routes_1.default);
app.use("/api/crawl-tasks", crawlTask_routes_1.default);
exports.default = app;
