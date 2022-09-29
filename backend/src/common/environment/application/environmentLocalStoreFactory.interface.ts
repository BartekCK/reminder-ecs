import { IEnvModelProps } from "../EnviromentModel";

const requiredEnvNames = [
	"AWS_REGION",
	"DYNAMO_DB_URL",
	"APP_PORT",
	"NODE_ENV",
	"EVENTS_TABLE_NAME",
];
type RequiredEnvNamesObjType = { [P in typeof requiredEnvNames[number]]: string };

export abstract class EnvironmentLocalStoreFactory {
	private _requiredEnvNames = requiredEnvNames;

	abstract getEnvProps(): Promise<IEnvModelProps>;

	protected mapFromDirtyEnvsIntoEnvPropsSchema = (
		dirtyEnvs: RequiredEnvNamesObjType
	): IEnvModelProps => {
		return {
			awsRegion: dirtyEnvs.AWS_REGION,
			dynamoDBUrl: dirtyEnvs.DYNAMO_DB_URL,
			appPort: dirtyEnvs.APP_PORT,
			environment: dirtyEnvs.NODE_ENV as "test" | "production" | "development",
			eventsTableName: dirtyEnvs.EVENTS_TABLE_NAME,
		};
	};

	get requiredEnvNames(): string[] {
		return [...this._requiredEnvNames];
	}
}
