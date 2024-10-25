import { Express } from "express";
import { createCatalogRoutes } from "./catalog";

/**
 * Combines individual routes modules, in order to applied in a single step.
 */
export const createRoutes = (app: Express) => {
    createCatalogRoutes(app);
}