import { createServer } from "http";
import express, { Express } from "express";
import helmet from "helmet";
import { getConfig } from "./config";
import { createRoutes } from "./routes";

const port = getConfig("http:port", 5000);

const expressApp: Express = express();
expressApp.use(helmet());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

createRoutes(expressApp);

const server = createServer(expressApp);
server.listen(port, () => console.log(`HTTP Server is listening on port ${port}`));