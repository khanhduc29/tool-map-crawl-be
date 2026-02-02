import express from "express";
import cors from "cors";
import crawlJobRoutes from "./routes/crawlJob.routes";
import crawlTaskRoutes from "./routes/crawlTask.routes";

const app = express();

// ✅ CORS (QUAN TRỌNG)
app.use(
  cors({
    origin: "http://localhost:5173", // FE Vite
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 👇 BẮT BUỘC CHO RENDER
app.get("/", (_req, res) => {
  res.status(200).send("OK");
});
app.use("/api/crawl-jobs", crawlJobRoutes);
app.use("/api/crawl-tasks", crawlTaskRoutes);

export default app;
