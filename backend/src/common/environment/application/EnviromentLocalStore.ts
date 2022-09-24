import { EnvironmentLocalStoreFactory } from "./environmentLocalStoreFactory.interface";
import { EnvModel } from "../EnviromentModel";

export class EnvironmentLocalStore {
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

  getDynamoDbUrl(): string | undefined {
    return this.env.getProps().dynamoDBUrl;
  }

  getPort(): number {
    return Number(this.env.getProps().appPort);
  }
}
