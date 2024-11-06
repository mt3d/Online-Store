import { readFileSync } from "node:fs";
import { Env, getEnvironment } from "./environment";
import { merge } from "./merge";
import { config as dotenvconfig } from "dotenv";

dotenvconfig({
    path: "overrides.env", override: false
});

// The main configuration file.
const file = process.env.SERVER_CONFIG ?? "server.config.json";
const data = JSON.parse(readFileSync(file).toString());

dotenvconfig({
    // read development.env during development, and production.env during production.
    path: getEnvironment().toString() + ".env"
});

try {
    // An environment specific configuration file (i.e. production.server.config.json).
    const envFile = getEnvironment().toString() + "." + file;
    const envData = JSON.parse(readFileSync(envFile).toString());
    merge(data, envData);
} catch {
    // do nothing - the file doesn't exist or isn't readable
}

/**
 * Accepts a string in the form "http:port", where keys are separated by colons.
 * The keys are used to navigate through the configuration data to find a value.
 * 
 * @param defaultValue - A default value that will be returned if a value
 * has not been loaded from the configuration files.
 */
export const getConfig = (path: string, defaultValue: any = undefined) => {
    /**
     * data {
     *     http {
     *         port: 5000
     *     }
     * }
     * 
     * #1 val = data
     * #2 val = data[http]
     * #3 val = data[port] (i.e. http[port])
     */
    
    const paths = path.split(":");
    let val = data;
    paths.forEach(p => val = val[p]);
    return val ?? defaultValue;
}

export const getSecret = (name: string) => {
    const secret = process.env[name];

    if (secret === undefined) {
        throw new Error(`Undefined secret: ${name}`)
    }

    return secret;
}

export { getEnvironment, Env };