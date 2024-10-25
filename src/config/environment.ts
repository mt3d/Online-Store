export enum Env {
    Development = "development",
    Production = "production"
}

export const getEnvironment = () : Env => {
    /** The convention for node.js is to specify the environment
     * using an environment variable, named NODE_ENV.
     */

    const env = process.env.NODE_ENV;

    /** If the variable isn't set or has been set to development
     * then the application is in the development environment.
     */
    return env === undefined || env === Env.Development ? Env.Development : Env.Production;
}