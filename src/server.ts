import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
import { seedAdmin } from "./app/utils/seedAdmin";
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
  await seedAdmin();
})();

//unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log(`unhandled rejection detected..Server is shutting down..`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//uncaught exception error
process.on("uncaughtException", (err) => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//cloud related error
process.on("SIGTERM", (err) => {
  console.log("SIGTERM Signal Received..Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//manual server off
process.on("SIGINT", (err) => {
  console.log("SIGINT Signal Received..Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
