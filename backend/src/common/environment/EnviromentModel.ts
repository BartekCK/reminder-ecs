import { z } from "zod";

const envModelSchema = z.object({
	awsRegion: z.string(),
	appPort: z.string(),
	environment: z.enum(["test", "development", "production"]),
	dynamoDBUrl: z.string().optional(),
	eventsTableName: z.string(),
});

export type IEnvModelProps = z.infer<typeof envModelSchema>;

export class EnvModel {
	private readonly props: IEnvModelProps;

	private constructor(props: IEnvModelProps) {
		this.props = props;
	}

	public static create(data: IEnvModelProps): EnvModel {
		const validationResult = envModelSchema.parse(data);

		return new EnvModel(validationResult);
	}

	public getProps(): IEnvModelProps {
		return this.props;
	}
}
