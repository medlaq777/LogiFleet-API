import mongoose from "mongoose";
import Config from "./config.js";

class Database {
  connected = false;

  async connect() {
    if (this.connected) return;
    if (!Config.MONGOURI) throw new Error("MongoDb Uri Error!");
    try {
      await mongoose.connect(Config.MONGOURI);
      this.connected = true;
      console.log("MongoDb OK");
    } catch (err) {
      console.error("MongoDB Connection Error:", err);
    }
  }
}

export default new Database();
