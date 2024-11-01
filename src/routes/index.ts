import { Express } from "express";
import { createCatalogRoutes } from "./catalog";
import { createCartMiddleware, createCartRoutes } from "./cart";
import { createOrderRoutes } from "./orders";

/**
 * Combines individual routes modules, in order to applied in a single step.
 */
export const createRoutes = (app: Express) => {
    createCartMiddleware(app);
    createCatalogRoutes(app);
    createCartRoutes(app);
    createOrderRoutes(app);
}