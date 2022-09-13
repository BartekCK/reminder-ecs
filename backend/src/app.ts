import express, { Express } from "express";
import reminderRouter from "./reminder/presentation/router";

const PORT = process.env.PORT || 8080;
const app: Express = express();

app.use(express.json());

app.use("/reminders", reminderRouter);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT} 🚀`);
});
