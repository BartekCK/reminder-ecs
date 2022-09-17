import { IEnvModelProps } from "../EnviromentModel";

const requiredEnvNames = ["AWS_REGION", "DYNAMO_DB_URL"];
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
    };
  };

  get requiredEnvNames(): string[] {
    return [...this._requiredEnvNames];
  }
}
