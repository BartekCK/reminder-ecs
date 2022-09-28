export interface IEnvironmentDatabase {
	getAwsRegion: () => string;
	getEnvStage: () => "test" | "production" | "development";
	getDynamoDbUrl: () => string | null;
}
