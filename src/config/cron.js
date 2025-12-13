import cron from "node-cron";
import MaintenanceService from "../services/maintenance.service.js";

class CronConfig {
  static registerDailyTireMaintenanceJob() {
    cron.schedule("0 0 * * *", async () => {
      console.log("Running daily tire maintenance check...");
      try {
        await MaintenanceService.checkDailyTires();
        console.log("Daily tire maintenance check completed.");
      } catch (error) {
        console.error("Error running daily tire maintenance check:", error);
      }
    });
  }
}

export default CronConfig;
