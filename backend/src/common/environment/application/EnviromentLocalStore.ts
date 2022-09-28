import { EnvironmentLocalStoreFactory } from "./environmentLocalStoreFactory.interface";
import { EnvModel } from "../EnviromentModel";
import { IEnvironmentDatabase } from "../../database";

export class EnvironmentLocalStore implements IEnvironmentDatabase {
	private env: EnvModel;

	private constructor(env: EnvModel) {
		this.env = env;
	}

	public static async create(
		factory: EnvironmentLocalStoreFactory
	): Promise<EnvironmentLocalStore> {
		const envPropsResult = await factory.getEnvProps();

		const envModel = EnvModel.create(envPropsResult);

		return new EnvironmentLocalStore(envModel);
	}

	getAwsRegion(): string {
		return this.env.getProps().awsRegion;
	}

	getDynamoDbUrl(): string | null {
		return this.env.getProps().dynamoDBUrl || null;
	}

	getPort(): number {
		return Number(this.env.getProps().appPort);
	}

	getEventsTableName(): string {
		return this.env.getProps().eventsTableName;
	}

	getEnvStage(): "test" | "production" | "development" {
		return this.env.getProps().environment;
	}
}
