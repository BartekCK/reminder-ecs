import { EnvironmentLocalStoreFactory } from "../application/environmentLocalStoreFactory.interface";
import { VError } from "verror";
import { IEnvModelProps } from "../EnviromentModel";
import { SSM } from "@aws-sdk/client-ssm";

export class SsmEnvironment extends EnvironmentLocalStoreFactory {
	private readonly ssm: SSM;

	constructor(ssm?: SSM) {
		super();

		switch (process.env.NODE_ENV) {
			case "development":
				// eslint-disable-next-line no-case-declarations
				const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

				if (!(AWS_REGION && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY)) {
					throw new Error("Envs for development should exist");
				}

				this.ssm = new SSM({
					region: AWS_REGION,
					credentials: {
						accessKeyId: AWS_ACCESS_KEY_ID,
						secretAccessKey: AWS_SECRET_ACCESS_KEY,
					},
				});
				break;

			case "test":
				if (!ssm) {
					throw new Error("SSM instance should be provided for test env");
				}

				this.ssm = ssm;
				break;

			default:
				this.ssm = new SSM({});
		}
	}

	getEnvProps = async (): Promise<IEnvModelProps> => {
		try {
			const paramsResponse = await this.ssm.getParameters({
				Names: this.requiredEnvNames,
				WithDecryption: true,
			});

			if (!paramsResponse || !paramsResponse.Parameters) {
				throw new VError();
			}

			const envs = paramsResponse.Parameters.reduce((prev: any, parameter: any) => {
				if (!parameter.Name) {
					throw new VError("Parameter name don't exist", parameter);
				}
				return { ...prev, [parameter.Name]: parameter.Value };
			}, {});

			return this.mapFromDirtyEnvsIntoEnvPropsSchema(envs as Record<string, any>);
		} catch (error) {
			throw new VError("Error occurred during getting envs from AWS SSM", error);
		}
	};
}
