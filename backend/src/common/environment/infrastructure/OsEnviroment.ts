import { EnvironmentLocalStoreFactory } from "../application/environmentLocalStoreFactory.interface";
import { IEnvModelProps } from "../EnviromentModel";
import * as path from "path";

export class OsEnvironment extends EnvironmentLocalStoreFactory {
  async getEnvProps(): Promise<IEnvModelProps> {
    const dotenv = await import("dotenv");

    const { NODE_ENV } = process.env;

    if (NODE_ENV === "production") {
      throw new Error(`${OsEnvironment.name} should not be use for production env`);
    }

    dotenv.config({
      path: path.resolve(
        process.cwd(),
        NODE_ENV === "development" ? ".env" : ".env.test"
      ),
    });

    const envs = this.requiredEnvNames.reduce((prev, envName) => {
      return { ...prev, [envName]: process.env[envName] };
    }, {});

    return this.mapFromDirtyEnvsIntoEnvPropsSchema(envs);
  }
}
