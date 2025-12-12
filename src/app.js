import "dotenv/config";
import express from "express";
import Config from "./config/config.js";
import db from "./config/db.js";
import AuthRoute from "./routes/auth.route.js";
import TruckRoute from "./routes/truck.route.js";
import TrailerRoute from "./routes/trailer.route.js";
import TireRoute from "./routes/tire.route.js";
import TripRoute from "./routes/trip.route.js";
import MaintenanceRoute from "./routes/maintenance.route.js";
import ReportRoute from "./routes/report.route.js";
import cron from "node-cron";
import MaintenanceService from "./services/maintenance.service.js";

const app = express();
const port = Config.PORT;
app.use(express.json());
await db.connect();

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily tire maintenance check...");
  try {
    await MaintenanceService.checkDailyTires();
    console.log("Daily tire maintenance check completed.");
  } catch (error) {
    console.error("Error running daily tire maintenance check:", error);
  }
});

app.use("/api", AuthRoute.build());
app.use("/api", TripRoute.build());
app.use("/api", TrailerRoute.build());
app.use("/api", TireRoute.build());
app.use("/api", TruckRoute.build());
app.use("/api", MaintenanceRoute.build());
app.use("/api", ReportRoute.build());

app.use((err, req, res, next) => {
  console.error("Error on", req.method, req.path);
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
