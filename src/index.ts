// import app from "./app";

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import initTables  from "./init-tables";

(async () => {
  await initTables(); // 🔥 PHẢI CHẠY

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
