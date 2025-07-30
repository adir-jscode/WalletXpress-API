import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("DigitalXpress DB is connected ✅");

    server = app.listen(envVars.PORT, () => {
      console.log(`server is running on port ${envVars.PORT} 💳`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();
