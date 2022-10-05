import express, { Express } from "express";
import { DependencyInjector } from "./core/dependency-injector";

class App {
	public static async main() {
		const app: Express = express();

		await DependencyInjector.create();

		const { reminderRouter, environmentLocalStore } =
			DependencyInjector.getDependencies();

		app.use(express.json());

		app.use("/reminders", reminderRouter.getRouter());

		const PORT = environmentLocalStore.getPort();

		app.listen(PORT, () => {
			console.log(`App started on port ${PORT} 🚀`);
		});
	}
}

App.main();
