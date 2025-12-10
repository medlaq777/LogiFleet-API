import "dotenv/config";
import express from "express";
import Config from "./config/config.js";
import db from "./config/db.js";
import AuthRoute from "./routes/auth.route.js";
import TruckRoute from "./routes/truck.route.js";
import TrailerRoute from "./routes/trailer.route.js";
import TireRoute from "./routes/tire.route.js";
const app = express();
const port = Config.PORT;
app.use(express.json());
await db.connect();

app.use("/api", AuthRoute.build());
app.use("/api", TruckRoute.build());
app.use("/api", TrailerRoute.build());
app.use("/api", TireRoute.build());

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
