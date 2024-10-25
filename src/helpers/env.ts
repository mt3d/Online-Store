import { getEnvironment } from "../config"
import { Env } from "../config";

export const isDevelopment = (value: any) => {
    return getEnvironment() === Env.Development;
}