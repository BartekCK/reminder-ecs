import express, { Express } from "express";
import { environmentLocalStore } from "./common/environment";
import reminderRouter from "./reminder/presentation/router";

const PORT = process.env.PORT || 8080;
const app: Express = express();

class App {
  public static async main() {
    const envService = await environmentLocalStore;

    app.use(express.json());

    app.use("/reminders", reminderRouter);

    app.listen(PORT, () => {
      console.log(`App started on port ${PORT} 🚀`);
    });
  }
}

App.main();
