import { EnvironmentLocalStore } from "./EnviromentLocalStore";
import { SsmEnvironment } from "../infrastructure/SsmEnviroment";
import { OsEnvironment } from "../infrastructure/OsEnviroment";

const environmentLocalStore = EnvironmentLocalStore.create(
  process.env.NODE_ENV === "production" ? new SsmEnvironment() : new OsEnvironment()
);

export { environmentLocalStore };
