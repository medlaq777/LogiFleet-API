import "dotenv/config";
import express from "express";
import Config from "./config/config.js";
import db from "./config/db.js";

const app = express();
app.use(express.json());
await db.connect();

app.use((err, res) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

const port = Config.PORT;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
